import {z} from 'zod';
import {secid} from './normalize';
import type {ResearchNote, Snapshot, Watch} from './types';

const date=z.string().datetime({offset:true});
const code=z.string().refine(v=>{try{secid(v);return true;}catch{return false;}},'股票代码无效');
const link=z.string().max(2000).url().refine(v=>/^https?:\/\//i.test(v),'只支持 http 或 https 链接');
const number=z.number().finite().nullable();
const quote=z.object({code:z.string(),secid:z.string(),name:z.string().max(100),price:number,change:number,amount:number,volume:number,high:number,low:number,open:number,previous:number,main:number,superLarge:number,large:number,medium:number,small:number,mainRatio:number,turnover:number,timestamp:number});
const snapshotSchema=z.object({code,name:z.string().max(100),capturedAt:date,quote:quote.nullable(),sector:quote.nullable(),market:z.array(quote).max(4),financialPeriod:z.string().nullable(),source:link});
const fields=z.object({code,title:z.string().trim().min(1,'请填写标题').max(100),body:z.string().trim().min(1,'请填写分析与证据').max(12000),outlook:z.enum(['观察','逻辑增强','逻辑减弱']),sourceUrl:z.union([z.literal(''),link])});
const noteSchema=fields.extend({id:z.string().min(1).max(100),snapshot:snapshotSchema,createdAt:date,updatedAt:date}).refine(n=>n.code===n.snapshot.code,'快照股票与记录不一致');
const watchSchema=z.object({code,name:z.string().trim().min(1).max(100),createdAt:date});
const librarySchema=z.object({version:z.literal(1),watches:z.array(watchSchema).max(20),notes:z.array(noteSchema).max(5000)}).superRefine((value,ctx)=>{
 if(new Set(value.watches.map(x=>x.code)).size!==value.watches.length||new Set(value.notes.map(x=>x.id)).size!==value.notes.length)ctx.addIssue({code:z.ZodIssueCode.custom,message:'备份存在重复记录编号'});
});
export type Library={version:1;watches:Watch[];notes:ResearchNote[]};
export type NoteInput={code:string;title:string;body:string;outlook:string;sourceUrl:string;id?:string;updatedAt?:string;snapshot?:Snapshot};
export const DATABASE='stock-observatory-v1';
const initial=():Library=>({version:1,watches:[{code:'601012',name:'隆基绿能',createdAt:new Date().toISOString()}],notes:[]});
function readableError(error:unknown):Error {
 if(error instanceof z.ZodError)return new Error(error.issues[0]?.message??'记录格式无效');
 if(error instanceof DOMException)return new Error(error.name==='QuotaExceededError'?'本机存储空间不足，请先导出备份并释放空间后重试':'无法读写本机记录，请检查浏览器是否允许此网站存储数据');
 return error instanceof Error?error:new Error('本机记录操作失败，请重试');
}
export function parseBackup(raw:string):Library {
 if(raw.length>10*1024*1024)throw new Error('备份文件不能超过 10 MB');
 try{const input=JSON.parse(raw);return librarySchema.parse({...input,version:input.version??1});}
 catch{throw new Error('备份格式无效，原有记录未改变。请选择本应用导出的 JSON 文件。');}
}
export class LocalLibrary {
 private db?:Promise<IDBDatabase>;
 constructor(private factory:()=>IDBFactory=()=>globalThis.indexedDB,private name=DATABASE){}
 private open(){
  if(!this.db)this.db=new Promise<IDBDatabase>((resolve,reject)=>{
   let request:IDBOpenDBRequest;
   try{request=this.factory().open(this.name,1);}catch(e){reject(e);return;}
   request.onupgradeneeded=()=>request.result.createObjectStore('library');
   request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{db.close();this.db=undefined;};resolve(db);};
   request.onerror=()=>reject(request.error);
   request.onblocked=()=>reject(new Error('请关闭本网站的其他旧页面后重试'));
  }).catch(e=>{this.db=undefined;throw readableError(e);});
  return this.db;
 }
 private async transact<T>(mode:IDBTransactionMode,action:(library:Library)=>T):Promise<T>{
  const db=await this.open();
  return new Promise<T>((resolve,reject)=>{
   const tx=db.transaction('library',mode),store=tx.objectStore('library'),request=store.get('root');let result:T,reason:unknown;
   request.onsuccess=()=>{try{
    // Validate persisted data; corrupt data is never silently replaced with an empty library.
    const library=request.result===undefined?initial():librarySchema.parse(request.result);
    result=action(library);
    if(mode==='readwrite')store.put(librarySchema.parse(library),'root');
   }catch(e){reason=e;tx.abort();}};
   tx.oncomplete=()=>resolve(result);
   tx.onabort=()=>reject(readableError(reason??tx.error));
   tx.onerror=()=>{reason=reason??tx.error;};
  });
 }
 read(){return this.transact('readonly',v=>v);}
 addWatch(watch:Watch){return this.transact('readwrite',library=>{
  const w=watchSchema.parse(watch);if(library.watches.some(x=>x.code===w.code))throw new Error('这只股票已在自选中');
  if(library.watches.length>=20)throw new Error('最多关注 20 只股票，请先移除一只');
  library.watches.push(w);return w;
 });}
 removeWatch(value:string){return this.transact('readwrite',library=>{library.watches=library.watches.filter(w=>w.code!==value);});}
 saveNote(input:NoteInput){return this.transact('readwrite',library=>{
  const values=fields.parse(input);const old=input.id?library.notes.find(n=>n.id===input.id):undefined;
  if(input.id&&(!old||old.updatedAt!==input.updatedAt))throw new Error('记录已在其他页面修改或删除。请重新加载后选择编辑；当前草稿仍保留。');
  const now=new Date(Math.max(Date.now(),old?Date.parse(old.updatedAt)+1:0)).toISOString();
  const record=noteSchema.parse({...values,id:old?.id??crypto.randomUUID(),snapshot:old?.snapshot??input.snapshot,createdAt:old?.createdAt??now,updatedAt:now});
  library.notes=[record,...library.notes.filter(n=>n.id!==record.id)].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));return record;
 });}
 deleteNote(id:string,updatedAt:string){return this.transact('readwrite',library=>{
  const current=library.notes.find(n=>n.id===id);
  if(!current||current.updatedAt!==updatedAt)throw new Error('记录已发生变化，请重新加载后再删除');
  library.notes=library.notes.filter(n=>n.id!==id);
 });}
 importBackup(backup:Library){return this.transact('readwrite',library=>{
  const incoming=librarySchema.parse(backup),watchIds=new Set(library.watches.map(w=>w.code)),noteIds=new Set(library.notes.map(n=>n.id));
  const watches=incoming.watches.filter(w=>!watchIds.has(w.code)),notes=incoming.notes.filter(n=>!noteIds.has(n.id));
  if(library.watches.length+watches.length>20)throw new Error('合并后自选超过 20 只，请先移除不需要的自选');
  library.watches.push(...watches);library.notes.push(...notes);library.notes.sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
  return {watches:watches.length,notes:notes.length,skipped:incoming.notes.length-notes.length};
 });}
}
export const library=new LocalLibrary();
export function announceLibraryChange(){if(typeof BroadcastChannel!=='undefined'){const channel=new BroadcastChannel(DATABASE);channel.postMessage('changed');channel.close();}}
export function listenLibraryChange(reload:()=>void){if(typeof BroadcastChannel==='undefined')return()=>{};const channel=new BroadcastChannel(DATABASE);channel.onmessage=reload;return()=>channel.close();}

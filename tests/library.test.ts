import {test} from 'node:test';
import assert from 'node:assert/strict';
import {IDBFactory} from 'fake-indexeddb';
import {LocalLibrary,parseBackup,type NoteInput} from '../lib/library';
const input:NoteInput={code:'601012',title:'测试周复盘',body:'仅测试存储，不是投资结论。',outlook:'观察',sourceUrl:'',snapshot:{code:'601012',name:'隆基绿能',capturedAt:'2026-11-03T08:00:00.000Z',quote:null,sector:null,market:[],financialPeriod:null,source:'https://quote.eastmoney.com/'}};
const setup=()=>{const factory=new IDBFactory();return [new LocalLibrary(()=>factory),new LocalLibrary(()=>factory)] as const;};
test('first use, saving, reload, editing and deletion retain snapshot and independent records',async()=>{
 const [a,b]=setup();assert.equal((await a.read()).watches[0].code,'601012');
 const first=await a.saveNote(input);await a.addWatch({code:'000001',name:'平安银行',createdAt:new Date().toISOString()});
 const other=await a.saveNote({...input,code:'000001',snapshot:{...input.snapshot!,code:'000001'},title:'另一只股票'});
 assert.equal((await b.read()).notes.length,2);
 const edited=await b.saveNote({...first,title:'已编辑',snapshot:{...first.snapshot,financialPeriod:'2099-12-31'}});
 assert.equal(edited.snapshot.financialPeriod,null);assert.notEqual(edited.updatedAt,first.updatedAt);
 await b.removeWatch('601012');assert.equal((await a.read()).notes.length,2);
 await a.deleteNote(edited.id,edited.updatedAt);assert.deepEqual((await b.read()).notes.map(x=>x.id),[other.id]);
});
test('simultaneous tabs serialize writes and stale edit/delete cannot overwrite changes',async()=>{
 const [a,b]=setup();const [first,second]=await Promise.all([a.saveNote(input),b.saveNote({...input,title:'第二条'})]);
 assert.equal((await a.read()).notes.length,2);
 const latest=await b.saveNote({...first,body:'最新证据'});
 await assert.rejects(a.saveNote({...first,body:'旧草稿'}),/其他页面/);
 await assert.rejects(a.deleteNote(first.id,first.updatedAt),/发生变化/);
 const records=(await a.read()).notes;assert.equal(records.find(n=>n.id===first.id)?.body,latest.body);assert.ok(records.find(n=>n.id===second.id));
});
test('export/import round trip is additive, repeated imports do not duplicate or overwrite',async()=>{
 const [a]=setup();const record=await a.saveNote(input),backup=parseBackup(JSON.stringify({...await a.read(),exportedAt:new Date().toISOString()}));
 const [destination]=setup();let result=await destination.importBackup(backup);assert.equal(result.notes,1);
 await destination.saveNote({...record,title:'本机更新'});result=await destination.importBackup(backup);assert.equal(result.notes,0);assert.equal(result.skipped,1);assert.equal((await destination.read()).notes[0].title,'本机更新');
 assert.throws(()=>parseBackup('{malformed'),/格式无效/);
 assert.throws(()=>parseBackup(JSON.stringify({...backup,notes:[{...record,sourceUrl:'javascript:alert(1)'}]})),/格式无效/);
 assert.throws(()=>parseBackup(JSON.stringify({...backup,version:9})),/格式无效/);
 assert.equal((await destination.read()).notes.length,1);
});
test('invalid input and storage refusal do not report success; retry recovers',async()=>{
 const [a]=setup();await assert.rejects(a.saveNote({...input,title:''}));assert.equal((await a.read()).notes.length,0);
 await assert.rejects(a.saveNote({...input,snapshot:{...input.snapshot!,code:'000001'}}));
 let blocked=true;const factory=new IDBFactory(),store=new LocalLibrary(()=>{if(blocked)throw new DOMException('denied','SecurityError');return factory;});
 await assert.rejects(store.saveNote(input),/无法读写/);blocked=false;await store.saveNote(input);assert.equal((await store.read()).notes.length,1);
});
test('duplicate watch rejected and invalid backup transaction leaves prior records intact',async()=>{
 const [a]=setup();await assert.rejects(a.addWatch({code:'601012',name:'隆基绿能',createdAt:new Date().toISOString()}),/已在自选/);
 const record=await a.saveNote(input),backup=await a.read();
 await assert.rejects(a.importBackup({...backup,notes:[record,record]}),/重复记录/);assert.equal((await a.read()).notes.length,1);
});

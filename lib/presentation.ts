import type {MarketPacket,Snapshot,Section} from './types';
export const fixed=(n:number|null|undefined,d=2)=>n==null?'—':n.toLocaleString('zh-CN',{minimumFractionDigits:d,maximumFractionDigits:d});
export const percent=(n:number|null|undefined)=>n==null?'—':`${n>0?'+':''}${fixed(n)}%`;
export const money=(n:number|null|undefined)=>n==null?'—':Math.abs(n)>=1e8?`${fixed(n/1e8)} 亿`:Math.abs(n)>=1e4?`${fixed(n/1e4)} 万`:fixed(n);
export const tone=(n:number|null|undefined)=>n==null||n===0?'flat':n>0?'up':'down';
export function localDate(value:string|number){return new Date(typeof value==='number'?value*1000:value).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false});}
export function mergePacket(previous:MarketPacket|undefined,next:MarketPacket):MarketPacket{
 if(!previous||previous.code!==next.code)return next;
 const keep=<T,>(old:Section<T>,fresh:Section<T>):Section<T>=>fresh.error&&old.data?{...old,error:fresh.error,stale:true}:fresh;
 return {...next,quotes:keep(previous.quotes,next.quotes),history:keep(previous.history,next.history),fundamentals:keep(previous.fundamentals,next.fundamentals),announcements:keep(previous.announcements,next.announcements)};
}
export function snapshot(p:MarketPacket):Snapshot{const q=p.quotes.data??[];return {code:p.code,name:q.find(x=>x.secid===`${p.code.startsWith('6')?'1':'0'}.${p.code}`)?.name??p.code,capturedAt:new Date().toISOString(),quote:q.find(x=>x.secid===`${p.code.startsWith('6')?'1':'0'}.${p.code}`)??null,sector:q.find(x=>x.secid===p.sectorId)??null,market:q.filter(x=>['1.000001','0.399001','0.399006','1.000300'].includes(x.secid)),financialPeriod:p.fundamentals.data?.latest.period??null,source:'https://quote.eastmoney.com/'};}

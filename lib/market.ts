import {normalizeBars,normalizeFundamentals,normalizeQuote,secid} from './normalize';
import type {Announcement,Bar,MarketPacket,Quote,Section} from './types';

type VendorResponse={data?:{diff?:Record<string,unknown>[];klines?:unknown;list?:Record<string,unknown>[]};success?:boolean|number;result?:{data?:Record<string,unknown>[]}};
const cache=new Map<string,{until:number;value:unknown}>();
const inflight=new Map<string,Promise<unknown>>();
const SOURCE='https://quote.eastmoney.com/';
async function remote<T>(url:string,ttl:number,parse:(json:VendorResponse)=>T):Promise<{value:T;at:string}>{
 const cached=cache.get(url);if(cached&&cached.until>Date.now())return cached.value as {value:T;at:string};
 const pending=inflight.get(url);if(pending)return pending as Promise<{value:T;at:string}>;
 const promise=(async()=>{
  const response=await fetch(url,{credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(8000)});
  if(!response.ok)throw new Error(`数据源响应 ${response.status}`);
  const value={value:parse(await response.json() as VendorResponse),at:new Date().toISOString()};
  if(cache.size>=160)cache.delete(cache.keys().next().value!);
  cache.set(url,{value,until:Date.now()+ttl});return value;
 })();inflight.set(url,promise);try{return await promise;}finally{inflight.delete(url);}
}
function url(base:string,p:Record<string,string|number>){return `${base}?${new URLSearchParams(Object.entries(p).map(([k,v])=>[k,String(v)]))}`;}
export async function quotes(ids:string[]){return remote(url('https://push2.eastmoney.com/api/qt/ulist.np/get',{secids:[...new Set(ids)].sort().join(','),fltt:2,fields:'f2,f3,f5,f6,f12,f13,f14,f15,f16,f17,f18,f62,f66,f72,f78,f84,f184,f124,f8'}),45000,(j):Quote[]=>{if(!Array.isArray(j?.data?.diff))throw new Error('行情暂不可用');return j.data.diff.map(normalizeQuote);});}
export async function history(code:string){return remote(url('https://push2his.eastmoney.com/api/qt/stock/kline/get',{secid:secid(code),klt:101,fqt:1,lmt:260,end:'20500101',fields1:'f1,f2,f3,f4,f5,f6',fields2:'f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61'}),300000,(j):Bar[]=>normalizeBars(j?.data?.klines));}
async function report(code:string,reportName:string,pageSize:number){return remote(url('https://datacenter.eastmoney.com/securities/api/data/v1/get',{reportName,columns:'ALL',filter:`(SECURITY_CODE="${code}")`,pageSize,pageNumber:1,sortColumns:'REPORT_DATE',sortTypes:-1}),3600000,(j):Record<string,unknown>[]=>{if(!j.success||!Array.isArray(j?.result?.data))throw new Error('财报暂不可用');return j.result.data;});}
export async function financials(code:string){
 const [main,industry]=await Promise.all([report(code,'RPT_F10_FINANCE_MAINFINADATA',12),report(code,'RPT_DMSK_FN_INCOME',1).catch(()=>null)]);
 return {value:normalizeFundamentals(main.value,industry?.value[0]),at:main.at};
}
async function announcements(code:string){return remote(url('https://np-anotice-stock.eastmoney.com/api/security/ann',{sr:-1,page_size:8,page_index:1,ann_type:'A',client_source:'web',stock_list:code}),600000,(j):Announcement[]=>{if(j.success!==1||!Array.isArray(j?.data?.list))throw new Error('公告暂不可用');return j.data.list.map((r:Record<string,unknown>)=>({id:String(r.art_code),title:String(r.title),date:String(r.notice_date).slice(0,10),url:`https://data.eastmoney.com/notices/detail/${code}/${encodeURIComponent(String(r.art_code))}.html`}));});}
async function section<T>(p:Promise<{value:T;at:string}>,source=SOURCE):Promise<Section<T>> {try{const r=await p;return {data:r.value,fetchedAt:r.at,error:null,source};}catch(e){return {data:null,fetchedAt:new Date().toISOString(),error:e instanceof Error?e.message:'数据源连接失败',source};}}
export const INDEX_IDS=['1.000001','0.399001','0.399006','1.000300'];
export async function marketPacket(code:string,watchCodes:string[]):Promise<MarketPacket>{
 secid(code);
 const fundamentalPromise=section(financials(code),'https://data.eastmoney.com/bbsj/');
 const historyPromise=section(history(code));const noticePromise=section(announcements(code),'https://data.eastmoney.com/notices/');
 const f=await fundamentalPromise;
 const sectorId=f.data?.sectorCode??(code==='601012'?'90.BK1031':null);
 const q=section(quotes([...INDEX_IDS,...watchCodes.map(secid),secid(code),...(sectorId?[sectorId]:[])]));
 const [quoteSection,h,n]=await Promise.all([q,historyPromise,noticePromise]);
 return {code,requestedAt:new Date().toISOString(),quotes:quoteSection,history:h,fundamentals:f,announcements:n,sectorId};
}

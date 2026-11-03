import {test} from 'node:test';
import assert from 'node:assert/strict';
import {marketPacket} from '../lib/market';
import {mergePacket} from '../lib/presentation';
test('direct data path caches, retains partial success on failure and recovers on retry',async()=>{
 const original=globalThis.fetch,clock=Date.now;let now=clock(),fail=false,calls=0;
 Date.now=()=>now;
 globalThis.fetch=async(input)=>{
  calls++;const u=new URL(String(input));
  assert.ok(['push2.eastmoney.com','push2his.eastmoney.com','datacenter.eastmoney.com','np-anotice-stock.eastmoney.com'].includes(u.hostname));
  if(u.hostname==='push2.eastmoney.com'){
   if(fail)throw new Error('连接失败');
   return Response.json({data:{diff:[{f12:'600519',f13:1,f14:'贵州茅台',f2:1400,f3:1,f124:1793692800}]}});
  }
  if(u.hostname==='push2his.eastmoney.com')return Response.json({data:{klines:['2026-11-03,1390,1400,1410,1380,100,14000000']}});
  if(u.hostname==='np-anotice-stock.eastmoney.com')return Response.json({success:1,data:{list:[]}});
  return Response.json({success:true,result:{data:u.searchParams.get('reportName')==='RPT_DMSK_FN_INCOME'?[{INDUSTRY_CODE:'0896',INDUSTRY_NAME:'白酒'}]:[{REPORT_DATE:'2026-03-31',NOTICE_DATE:'2026-04-30',SECURITY_NAME_ABBR:'贵州茅台',TOTALOPERATEREVE:100,MLR:50}]}});
 };
 try{
  const first=await marketPacket('600519',['600519']);assert.equal(first.quotes.data?.[0].price,1400);assert.equal(first.history.data?.length,1);assert.deepEqual(first.announcements.data,[]);assert.equal(first.sectorId,'90.BK0896');
  const count=calls;await marketPacket('600519',['600519']);assert.equal(calls,count);
  now+=46000;fail=true;const partial=await marketPacket('600519',['600519']);assert.ok(partial.quotes.error);assert.ok(partial.history.data);assert.equal(mergePacket(first,partial).quotes.stale,true);
  fail=false;const recovered=await marketPacket('600519',['600519']);assert.equal(recovered.quotes.error,null);assert.equal(mergePacket(first,recovered).quotes.stale,undefined);
 }finally{globalThis.fetch=original;Date.now=clock;}
});

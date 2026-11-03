import type { Bar, Fundamentals, Quarter, Quote } from './types';

export function numeric(value:unknown):number|null {return (typeof value==='number'&&Number.isFinite(value))?value:null;}
export function secid(code:string):string {if(!/^(60[01358]\d{3}|68[89]\d{3}|00[0123]\d{3}|30[01]\d{3}|[48]\d{5}|92\d{4})$/.test(code))throw new Error('请输入有效的六位 A 股代码');return `${code.startsWith('6')?'1':'0'}.${code}`;}
export function normalizeQuote(r:Record<string,unknown>):Quote {
 const n=(k:string)=>numeric(r[k]);
 if(typeof r.f12!=='string'||typeof r.f14!=='string')throw new Error('行情格式不完整');
 return {code:r.f12,secid:`${r.f13}.${r.f12}`,name:r.f14,price:n('f2'),change:n('f3'),amount:n('f6'),volume:n('f5'),high:n('f15'),low:n('f16'),open:n('f17'),previous:n('f18'),main:n('f62'),superLarge:n('f66'),large:n('f72'),medium:n('f78'),small:n('f84'),mainRatio:n('f184'),turnover:n('f8'),timestamp:n('f124')};
}
export function normalizeBars(rows:unknown):Bar[]{
 if(!Array.isArray(rows))throw new Error('历史行情暂缺');
 return rows.map((row)=>{const [date,...v]=String(row).split(',');const values=v.map(Number);if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||v.slice(0,6).some(x=>x.trim()==='')||values.slice(0,6).some(x=>!Number.isFinite(x))||values.length<6)throw new Error('历史行情格式异常');return {date,open:values[0],close:values[1],high:values[2],low:values[3],volume:values[4],amount:values[5]};}).sort((a,b)=>a.date.localeCompare(b.date));
}
type Row=Record<string,unknown>;
export function normalizeFundamentals(rows:Row[],industry:Row|undefined):Fundamentals {
 if(!rows.length)throw new Error('暂无可用财报');
 const sorted=[...rows].sort((a,b)=>String(b.REPORT_DATE).localeCompare(String(a.REPORT_DATE)));
 const latest=sorted[0];
 function cumulative(r:Row):Quarter {const revenue=numeric(r.TOTALOPERATEREVE),gross=numeric(r.MLR);return {period:String(r.REPORT_DATE).slice(0,10),published:String(r.NOTICE_DATE).slice(0,10),revenue,profit:numeric(r.PARENTNETPROFIT),deducted:numeric(r.KCFJCXSYJLR),cash:numeric(r.NETCASH_OPERATE_PK),grossMargin:revenue&&gross!==null?gross/revenue*100:null};}
 const quarters=sorted.slice(0,8).map(r=>{
  const c=cumulative(r),year=c.period.slice(0,4),month=c.period.slice(5,7);
  if(month==='03')return c;
  const previousMonth=({'06':'03','09':'06','12':'09'} as Record<string,string>)[month];
  const prev=sorted.find(x=>String(x.REPORT_DATE).startsWith(`${year}-${previousMonth}-`));
  const diff=(key:string)=>{const a=numeric(r[key]),b=prev?numeric(prev[key]):null;return a!==null&&b!==null?a-b:null;};
  const revenue=diff('TOTALOPERATEREVE'),gross=diff('MLR');
  return {...c,revenue,profit:diff('PARENTNETPROFIT'),deducted:diff('KCFJCXSYJLR'),cash:diff('NETCASH_OPERATE_PK'),grossMargin:revenue&&gross!==null?gross/revenue*100:null};
 });
 const industryCode=String(industry?.INDUSTRY_CODE??'');
 return {name:String(latest.SECURITY_NAME_ABBR),sectorCode:/^\d{4}$/.test(industryCode)?`90.BK${industryCode}`:null,sectorName:typeof industry?.INDUSTRY_NAME==='string'?industry.INDUSTRY_NAME:null,quarters,latest:cumulative(latest),debtRatio:numeric(latest.ZCFZL),revenueYoY:numeric(latest.TOTALOPERATEREVETZ)};
}

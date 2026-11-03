'use client';
import {useState,useEffect,useRef} from 'react';
import type {Bar} from '@/lib/types';
import {fixed,money} from '@/lib/presentation';
export default function PriceChart({bars,range}:{bars:Bar[];range:number}){
 const rows=bars.slice(-range),[active,setActive]=useState<number|null>(null),[table,setTable]=useState(false),[width,setWidth]=useState(700),container=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(!container.current)return;const observer=new ResizeObserver(entries=>{const w=entries[0].contentRect.width;if(w>0)setWidth(w);});observer.observe(container.current);return()=>observer.disconnect();},[]);
 if(!rows.length)return <div className="blank">暂无历史行情</div>;
 const min=Math.min(...rows.map(x=>x.low)),max=Math.max(...rows.map(x=>x.high)),span=max-min||1,vol=Math.max(...rows.map(x=>x.volume))||1;
 const end=width-18,start=40,plot=end-start,x=(i:number)=>start+i/Math.max(1,rows.length-1)*plot,y=(v:number)=>24+(max-v)/span*182;
 const path=rows.map((r,i)=>`${i?'L':'M'}${x(i)},${y(r.close)}`).join(' '),i=Math.min(active??rows.length-1,rows.length-1),current=rows[i];
 return <><div className="chart-readout"><span>{current.date}</span><span>开 <b>{fixed(current.open)}</b></span><span>收 <b>{fixed(current.close)}</b></span><span>高 {fixed(current.high)}</span><span>低 {fixed(current.low)}</span><button className="text-button" onClick={()=>setTable(!table)}>{table?'收起数据表':'数据表'}</button></div>
 <div ref={container} className="chart" tabIndex={0} role="img" aria-label={`前复权收盘价图，${current.date} 收盘 ${current.close} 元。左右方向键查看，也可打开数据表。`} onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();setActive(Math.max(0,Math.min(rows.length-1,i+(e.key==='ArrowLeft'?-1:1))));}}} onMouseLeave={()=>setActive(null)} onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();setActive(Math.max(0,Math.min(rows.length-1,Math.round((e.clientX-r.left-start)/plot*(rows.length-1)))));}}>
 <svg viewBox={`0 0 ${width} 290`} preserveAspectRatio="none" aria-hidden="true">{[0,1,2,3].map(k=><g key={k}><line x1={start} x2={end} y1={24+k*182/3} y2={24+k*182/3} className="gridline"/><text x="4" y={28+k*182/3}>{fixed(max-k*span/3)}</text></g>)}<path d={`${path} L${end},206 L${start},206 Z`} className="chart-area"/><path d={path} className="chart-line"/>{rows.map((r,j)=><rect key={r.date} x={x(j)-Math.max(1,plot*.35/rows.length)} y={266-r.volume/vol*36} width={Math.max(1,plot*.7/rows.length)} height={r.volume/vol*36} className={r.close>=r.open?'volume-up':'volume-down'}/>)}<text x={start} y="285">{rows[0].date}</text><text x={end} y="285" textAnchor="end">{rows.at(-1)?.date}</text>{active!==null&&<g><line x1={x(i)} x2={x(i)} y1="18" y2="266" className="crosshair"/><circle cx={x(i)} cy={y(current.close)} r="4" fill="var(--accent)"/></g>}</svg></div>
 {table&&<div className="table-scroll chart-table"><table><thead><tr><th>日期</th><th>开盘</th><th>收盘</th><th>最高</th><th>最低</th><th>成交额</th></tr></thead><tbody>{[...rows].reverse().map(r=><tr key={r.date}><td>{r.date}</td><td>{fixed(r.open)}</td><td>{fixed(r.close)}</td><td>{fixed(r.high)}</td><td>{fixed(r.low)}</td><td>{money(r.amount)}</td></tr>)}</tbody></table></div>}</>;
}

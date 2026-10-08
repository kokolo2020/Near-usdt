export default async function handler(request) {
 const params=new URL(request.url).searchParams;
 const symbol=params.get("symbol")||"NEAR-USDT";
 if(!/^(SOL|NEAR|ETH|LINK|XRP)-USDT$/.test(symbol))return Response.json({error:"Unsupported symbol"},{status:400});
 const cursor=Number(params.get("before"));
 const end=Number.isFinite(cursor)&&cursor>0?Math.floor(cursor):Math.floor(Date.now()/1000);
 const start=end-1490*300;
 const url=`https://api.kucoin.com/api/v1/market/candles?type=5min&symbol=${symbol}&startAt=${start}&endAt=${end}`;
 try {
  const response=await fetch(url,{signal:AbortSignal.timeout(12000),headers:{Accept:"application/json"}});
  if(!response.ok)throw Error("KuCoin HTTP "+response.status);
  const json=await response.json();
  if(json.code!=="200000"||!Array.isArray(json.data))throw Error("Unexpected response");
  return Response.json({data:json.data,count:json.data.length},{headers:{"Cache-Control":"no-store"}});
 }catch(e){return Response.json({error:"Exchange data unavailable",detail:String(e.message)},{status:502});}
}
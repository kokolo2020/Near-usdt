export default async function handler(request) {
 const params=new URL(request.url).searchParams;
 const offset=Math.min(25920,Math.max(0,Math.floor(Number(params.get("offset"))||0)));
 const end=Math.floor(Date.now()/300)*300-offset*300;
 const start=end-1399*300;
 const url=`https://api.kucoin.com/api/v1/market/candles?type=5min&symbol=NEAR-USDT&startAt=${start}&endAt=${end}`;
 try {
  const response=await fetch(url,{signal:AbortSignal.timeout(12000),headers:{Accept:"application/json"}});
  if(!response.ok)throw Error("KuCoin HTTP "+response.status);
  const json=await response.json();
  if(json.code!=="200000"||!Array.isArray(json.data))throw Error("Unexpected response");
  return Response.json({data:json.data},{headers:{"Cache-Control":"public, max-age=60"}});
 } catch(e){return Response.json({error:"Exchange data unavailable",detail:String(e.message)},{status:502});}
}
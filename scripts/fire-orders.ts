import fetch from "node-fetch";
const URL = "http://localhost:3000/api/orders/execute";
async function fire(n:number){
  const tasks = [];
  for(let i=0;i<n;i++){
    tasks.push(fetch(URL, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({orderType:'market', tokenIn:'SOL', tokenOut:'USDC', amount:1}) }));
  }
  const res = await Promise.all(tasks);
  const bodies = await Promise.all(res.map(r=>r.json()));
  console.log('fired', n, bodies.map(b=>b.orderId));
}
fire(Number(process.argv[2]||10)).catch(console.error);

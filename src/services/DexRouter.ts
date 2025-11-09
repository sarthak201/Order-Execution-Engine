import { randomUUID } from 'crypto';

export class DexRouter {

  async route(tokenIn: string, tokenOut: string, amount: number) {

    const dexes = ["raydium", "meteora"];

    const bestDex = dexes[Math.floor(Math.random() * dexes.length)];

    const price = 9 + Math.random() * 2;

    const txHash = randomUUID();



    return { dex: bestDex, price, txHash };

  }



  async executeSwap(tokenIn: string, tokenOut: string, amount: number) {

    return this.route(tokenIn, tokenOut, amount);

  }

}


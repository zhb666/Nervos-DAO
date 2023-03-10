import { capacityOf, deposit as daoDeposit } from "../wallet";


async function capacity() {
  const capacity = await capacityOf();
  console.log(Number(capacity.toString())/ 100000000);
}

async function deposit() {
  const txhash = await daoDeposit(BigInt(166 * 10 ** 8), 1000);
  console.log(txhash);
}

capacity();
deposit();

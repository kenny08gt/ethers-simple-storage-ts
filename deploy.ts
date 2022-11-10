import { JsonRpcProvider } from "@ethersproject/providers";
import { Contract, ContractFactory, ethers, Wallet } from "ethers";
import * as fs from "fs-extra";

async function main() {
  // hHTTP://127.0.0.1:7545
  const provider: JsonRpcProvider = new (
    await ethers
  ).providers.JsonRpcProvider("HTTP://127.0.0.1:7545");
  const wallet: Wallet = new (await ethers).Wallet(
    "01cd373cdafa3941d290c0053a271eb60da7575de7cecbc3f8d07371852c1e8c",
    provider
  );

  // To deploy a contract we need the ABI and binary of a contract
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );
  const contractFactory: ContractFactory = new (await ethers).ContractFactory(
    abi,
    binary,
    wallet
  );
  console.log("Deploying, please wait...");
  const contract: Contract = await contractFactory.deploy();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

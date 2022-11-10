import { JsonRpcProvider, TransactionReceipt } from "@ethersproject/providers"
import { BigNumber, Contract, ContractFactory, ethers, Wallet } from "ethers"
import * as fs from "fs-extra"
import * as dotenv from "dotenv"

dotenv.config()

declare var process: {
    env: {
        PRIVATE_KEY: string
        RPC_URL: string
        PRIVATE_KEY_PASSWORD: string
    }
    exit: any
}

async function main() {
    // hHTTP://127.0.0.1:7545
    const provider: JsonRpcProvider = new (
        await ethers
    ).providers.JsonRpcProvider(process.env.RPC_URL)
    const wallet: Wallet = new (await ethers).Wallet(
        process.env.PRIVATE_KEY,
        provider
    )
    // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf-8")
    // let wallet: Wallet = ethers.Wallet.fromEncryptedJsonSync(
    // encryptedJson,
    // process.env.PRIVATE_KEY_PASSWORD
    // )

    // wallet = await wallet.connect(provider)

    // To deploy a contract we need the ABI and binary of a contract
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    )
    const contractFactory: ContractFactory = new (await ethers).ContractFactory(
        abi,
        binary,
        wallet
    )
    console.log("Deploying, please wait...")
    const contract: Contract = await contractFactory.deploy()

    const deploymentReceipt: TransactionReceipt =
        await contract.deployTransaction.wait(1)

    console.log(`Contract address: ${contract.address}`)

    //   console.log("Here is the deployment transactions: ");
    //   console.log(contract.deployTransaction);

    //   console.log("Here is the transaction receipt:");
    //   console.log(deploymentReceipt);

    const currentFavoriteNumber: BigNumber = await contract.retrieve()
    console.log(`Current favorite number: ${currentFavoriteNumber.toString()}`)

    const transcationResponse = await contract.store("7")
    const transactionReceipt = await transcationResponse.wait(1)

    const udpatedFavoriteNumber: BigNumber = await contract.retrieve()
    console.log(`Current favorite number: ${udpatedFavoriteNumber.toString()}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

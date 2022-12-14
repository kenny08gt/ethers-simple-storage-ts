import { ethers, Wallet } from "ethers"
import * as fs from "fs-extra"
import * as dotenv from "dotenv"

dotenv.config()

async function main() {
    const wallet: Wallet = new ethers.Wallet(process.env.PRIVATE_KEY!)
    const encryptedJsonKey = await wallet.encrypt(
        process.env.PRIVATE_KEY_PASSWORD!,
        process.env.PRIVATE_KEY
    )

    fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

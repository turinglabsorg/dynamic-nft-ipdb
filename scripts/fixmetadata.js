const { ethers, utils } = require("ethers");
const fs = require('fs');

async function main() {
    const configs = JSON.parse(fs.readFileSync(process.env.CONFIG).toString())
    const ABI = {
        IPDB: [{
            "inputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "cid",
                    "type": "string"
                }
            ],
            "name": "store",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        NFT: [
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "tokenURI",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]
    }
    const provider = new ethers.providers.JsonRpcProvider(configs.provider);
    let wallet = new ethers.Wallet(configs.owner_key).connect(provider)
    const ipdb = new ethers.Contract(configs.ipdb_address, ABI.IPDB, wallet)

    // Update metadata into IPDB
    const tokenId = 1
    const cid = "UPDATED_NFT_CID"
    const result = await ipdb.store(tokenId.toString(), cid)
    console.log(result)

    // Read updated URI from NFT contract
    const contract = new ethers.Contract(configs.contract_address, ABI.NFT, wallet)
    const uri = await contract.tokenURI(tokenId)
    console.log("UPDATED METADATA URI IS:", uri)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

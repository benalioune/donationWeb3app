let web3;
let donationContract;
const donationAddress = "0x0673D77F0e705A805cB0AdCc4a4c909f63BbDE2D";

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else {
        alert("Veuillez installer MetaMask pour utiliser cette DApp!");
    }

    const donationAbi = [

        {
            "constant": true,
            "inputs": [],
            "name": "donationCount",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x2abfab4d"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "address"
                },
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "donationsByDonateur",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x51c7f7d6"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "donations",
            "outputs": [
                {
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "name": "donateur",
                    "type": "address"
                },
                {
                    "name": "montant",
                    "type": "uint256"
                },
                {
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xf8626af8"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "name": "donateur",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "montant",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "name": "DonationCreated",
            "type": "event",
            "signature": "0x6389d52932f001f805bda3695335e2ce2064320790f711cffd61bf0805131ce7"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "createDonation",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function",
            "signature": "0x08196a9e"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_id",
                    "type": "uint256"
                }
            ],
            "name": "getDonation",
            "outputs": [
                {
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "name": "donateur",
                    "type": "address"
                },
                {
                    "name": "montant",
                    "type": "uint256"
                },
                {
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0xef07a81f"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_donateur",
                    "type": "address"
                }
            ],
            "name": "getDonationsByDonateur",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
            "signature": "0x88c656ab"
        }

    ];

    donationContract = new web3.eth.Contract(donationAbi, donationAddress);
});

async function createDonation() {
    const amount = document.getElementById('donationAmount').value;
    const accounts = await web3.eth.getAccounts();
    await donationContract.methods.createDonation().send({ from: accounts[0], value: amount });
}

async function listDonations() {
    const donationCount = await donationContract.methods.donationCount().call();
    const donationsList = document.getElementById('donationsList');
    donationsList.innerHTML = '';

    for (let i = 1; i <= donationCount; i++) {
        const donation = await donationContract.methods.getDonation(i).call();

        // Conversion explicite des BigInt en Number pour les opérations mathématiques
        const donationId = Number(donation.id);
        const donateur = donation.donateur;
        const montant = Number(donation.montant);
        const timestamp = Number(donation.timestamp); // Conversion en Number pour manipulation

        const listItem = document.createElement('li');
        listItem.textContent = `Donateur: ${donateur}, Montant: ${montant} ETH, Timestamp: ${new Date(timestamp * 1000).toLocaleString()}`;
        donationsList.appendChild(listItem);
    }
}


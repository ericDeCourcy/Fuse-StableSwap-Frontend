class Pool {
    constructor(address, rewardsContractAddress, poolTokens, LPToken) {
        this.address = address;
        this.rewardsContractAddress = rewardsContractAddress;
        this.poolTokens = poolTokens;
        this.LPToken = LPToken;
        this.allTokens = JSON.parse(JSON.stringify(this.poolTokens));
        this.allTokens.push(this.LPToken);
    }

    async getTokenApprovalHTML() {
        let buttonsHTML = '';
        let allTokensAreApproved = true;

        const tokenAllowanceTransactionData =
            '0xdd62ed3e'
            + ''.padStart(24, '0')
            + ethereum.selectedAddress.slice(2,)
            + ''.padStart(24, '0')
            + activePool.address.replace(/^0x/, '');

        for (const token of this.allTokens) {
            let disabled = '';
            let status = '';
            try {
                const allowance = await ethereum.request({
                    method: 'eth_call',
                    params: [{
                        to: token.address,
                        data: tokenAllowanceTransactionData
                    }]
                });
                if (allowance != 0) {
                    disabled = 'disabled';
                    status = 'Token already approved.';
                } else {
                    allTokensAreApproved = false;
                }
            } catch(error) {
                console.log(error);
                allTokensAreApproved = false;
            }
            buttonsHTML += `<button id="approve${token.name}Button" 
                onclick="approveToken(this, ${token.index})" ${disabled}>
                    Approve ${token.name}
                </button>
                <span id="approve${token.name}Status" class="status">${status}</span>
                <br/>`;
        }
        if (allTokensAreApproved) {
            return null;
        } else {
            return buttonsHTML;
        }
    }

    getSelectTokenHTML(labelText, elementName) {
        let optionsHTML = '';
        this.poolTokens.forEach((token) => {
            optionsHTML += `<option value=${token.index}>
                    ${token.name}
                </option>`;
        });
        return `<label for="${elementName}">${labelText}</label>
            <select id="${elementName}" name="${elementName}">
                ${optionsHTML}
            </select>`;
    }

    getInputTokenAmountHTML(labelText, partialElementName) {
        let inputHTML = '';
        this.poolTokens.forEach((token) => {
            const elementName = token.name + partialElementName;
            inputHTML += `<label for="${elementName}">${token.name} ${labelText}</label>
                <input id="${elementName}" name="${elementName}" type="number" min="0" value="0" />`;
        });
        return inputHTML;
    }

    getTokenValuesFromElements(partialElementName) {
        // TODO alanna - l2code
        let tokenValues = '';
        activePool.poolTokens.forEach((token) => {
            const elementName = token.name + partialElementName;
            const elementValue = document.getElementById(elementName).value;
            tokenValues += token.scaleAndPad(elementValue);
        });
        return tokenValues;
    }

    getTransactionParams(transactionData) {
        return {
          nonce: '0x00',
          gasPrice: '0x3B9ACA00', // gasPrice is 1 Gwei. customizable by user during MetaMask confirmation.
          gas: '0x0F4240', // customizable by user during MetaMask confirmation.
          to: this.address, // fake swap address
          from: ethereum.selectedAddress,
          value: '0x00', // Only required to send ether to the recipient from the initiating external account.
          data: transactionData,
          chainId: '0x7a', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        }
    }

    getRewardsTransactionParams(transactionData) {
        const transactionParams = this.getTransactionParams(transactionData);
        transactionParams['to'] = this.rewardsContractAddress;
        return transactionParams;
    }
}

class Token {
    constructor(index, name, address, decimals) {
        this.index = index;
        this.name = name;
        this.address = address;
        this.decimals = decimals;
    }

    scaleAndPad(value) {
        return (value * this.decimals).toString(16).padStart(64, '0');
    }
}


const fakePool = new Pool(
    '0xeADfEa5f18c1E1D5030dd352f293d78865a264a2', //swap
    '0x82cCDecF87141190F6A69321FB88F040aff83B08', //rewards
    [
        new Token(0, 'Fake-DAI', '0xa277bc1c1612Bb327D79746475aF29F7a93e8E64', 1e+18),
        new Token(1, 'Fake-USDC', '0x88c784FACBE88A20601A32Bd98d9Da8d59d08F92', 1e+6),
        new Token(2, 'Fake-USDT', '0xa479351d97e997EbCb453692Ef16Ce06730bEBF4', 1e+6),
    ],
    new Token(3, 'Fake-LP', '0x410a69Cdb3320594019Ef14A7C3Fb4Abaf6e962e', 1e+18)
);

const usd1Pool = new Pool(
    '0x3E192A2Eae22B3DB07a0039E10bCe29097E881B9',
    '0xFc99135BAEa5D21267b2c26E3d8518aaf07f2644',
    [
        new Token(0, 'DAI', '0x94Ba7A27c7A95863d1bdC7645AC2951E0cca06bA', 1e+18),
        new Token(1, 'USDC', '0x620fd5fa44BE6af63715Ef4E65DDFA0387aD13F5', 1e+6),
        new Token(2, 'USDT', '0xFaDbBF8Ce7D5b7041bE672561bbA99f79c532e10', 1e+6)
    ],
    new Token(3, 'USD1-LP', '0x61374FE435360A4a39b31045D1B71A9351f64B31', 1e+18)
);

const usd2Pool = new Pool(
    '0xECf95fFBa3e1Eb5f673606bC944fD093BB5D8EeD', //swap
    '0x9df200F086222084D86e252691d06C71480e440D', //rewards
    [
        new Token(0, 'DAI', '0x94Ba7A27c7A95863d1bdC7645AC2951E0cca06bA', 1e+18),
        new Token(1, 'fUSD', '0x249BE57637D8B013Ad64785404b24aeBaE9B098B', 1e+18),
        new Token(2, 'USDT', '0xFaDbBF8Ce7D5b7041bE672561bbA99f79c532e10', 1e+6)
    ],
    new Token(3, 'USD2-LP', '0x6A5Ea3652b88a9d066094216ACa18aC58eA216f5', 1e+18)
);

const pools = {
    Fake: fakePool,
    USD1: usd1Pool,
    USD2: usd2Pool
};

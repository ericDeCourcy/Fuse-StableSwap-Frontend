/* global tokens */

class Pool {
    constructor(address, rewardsContractAddress, poolTokens, LPToken) {
        this.address = address;
        this.rewardsContractAddress = rewardsContractAddress;
        this.poolTokens = poolTokens;
        this.LPToken = LPToken;
    }

    getTokenApprovalHTML() {
        let buttonsHTML = '';

        const allTokens = JSON.parse(JSON.stringify(this.poolTokens));
        allTokens.push(this.LPToken);
        allTokens.forEach(token => {
            buttonsHTML += `<button id="approve${token.name}Button" 
                onclick="approveToken(this, ${token.id})">
                    Approve ${token.name}
                </button>
                <span id="approve${token.name}Status" class="status"></span>
                <br/>`;
        });
        return buttonsHTML;
    }

    getSelectTokenHTML(labelText, elementName) {
        let optionsHTML = '';
        this.poolTokens.forEach((token) => {
            optionsHTML += `<option value=${token.id}>
                    ${token.name}
                </option>`;
        });
        return `<label for="${elementName}">${labelText}</label>
            <select id="${elementName}" name="${elementName}">
                ${optionsHTML}
            </select>`;
    }

    getInputTokenAmountHTML(labelText, elementName) {
        let inputHTML = '';
        this.poolTokens.forEach((token) => {
            const thisElementName = token.name + elementName;
            inputHTML += `<label for="${thisElementName}">${token.name} ${labelText}</label>
                <input id="${thisElementName}" name="${thisElementName}" type="number" min="0" value="0" />`;
        });
        return inputHTML;
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

const fakePool = new Pool(
    // TODO eric verify this is the pool address. called 'fake swap address' in main.
    '0xeADfEa5f18c1E1D5030dd352f293d78865a264a2', 
    // TODO eric verify this is the rewards contract address.
    '0x82cCDecF87141190F6A69321FB88F040aff83B08',
    [tokens[0], tokens[1], tokens[2]],
    tokens[3]
);
/* global tokens */

class Pool {
    constructor(address, LPTokenAddress, rewardsContractAddress, tokens) {
        this.address = address;
        this.LPTokenAddress = LPTokenAddress;
        this.rewardsContractAddress = rewardsContractAddress;
        this.tokens = tokens;
    }

    getSelectTokenHTML(labelText, elementName) {
        let optionsHTML = '';
        this.tokens.forEach((token) => {
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
        this.tokens.forEach((token) => {
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
    '0x410a69Cdb3320594019Ef14A7C3Fb4Abaf6e962e',
    // TODO eric verify this is the rewards contract address.
    '0x82cCDecF87141190F6A69321FB88F040aff83B08',
    [tokens[0], tokens[1], tokens[2]]
);
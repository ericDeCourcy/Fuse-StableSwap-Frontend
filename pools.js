/* global tokens */

class Pool {
    constructor(address, lpTokenAddress, rewardsContractAddress, tokens) {
        this.address = address;
        this.lpTokenAddress = lpTokenAddress;
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
}

const fakePool = new Pool(
    // TODO eric verify this is the pool address. called 'fake swap address' in main.
    '0xeADfEa5f18c1E1D5030dd352f293d78865a264a2', 
    '0x410a69Cdb3320594019Ef14A7C3Fb4Abaf6e962e',
    // TODO eric verify this is the rewards contract address.
    '0x82cCDecF87141190F6A69321FB88F040aff83B08',
    [tokens[0], tokens[1], tokens[2]]
);
import { tokens } from './tokens.js';

class Pool {
    constructor(address, lpTokenAddress, rewardsContractAddress, poolTokens) {
        this.address = address;
        this.lpTokenAddress = lpTokenAddress;
        this.rewardsContractAddress = rewardsContractAddress;
        this.poolTokens = poolTokens;
    }

    getSelectTokenHTML() {
        
    }
}

export const fakePool = new Pool(
    // TODO eric verify this is the pool address. called 'fake swap address' in main.
    '0xeADfEa5f18c1E1D5030dd352f293d78865a264a2', 
    '0x410a69Cdb3320594019Ef14A7C3Fb4Abaf6e962e',
    // TODO eric verify this is the rewards contract address.
    '0x82cCDecF87141190F6A69321FB88F040aff83B08',
    [tokens[0], tokens[1], tokens[2]]
);
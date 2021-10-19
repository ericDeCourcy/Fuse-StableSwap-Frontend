class Token {
    constructor(id, name, address, decimals) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.decimals = decimals;
    }

    scale(value) {
        return value * this.decimals;
    }

    scaleAndPad(value) {
        return this.scale(value).toString(16).padStart(64, '0');
    }
}

const tokens = [
    new Token(0, 'Fake-DAI', '0xa277bc1c1612Bb327D79746475aF29F7a93e8E64', 1e+18),
    new Token(1, 'Fake-USDC', '0x88c784FACBE88A20601A32Bd98d9Da8d59d08F92', 1e+6),
    new Token(2, 'Fake-USDT', '0xa479351d97e997EbCb453692Ef16Ce06730bEBF4', 1e+6),
    new Token(3, 'Fake-LP', '0x410a69Cdb3320594019Ef14A7C3Fb4Abaf6e962e', 1e+18)
]
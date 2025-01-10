interface ICrypto {
    coin: string,
    price: number,
    marketCap: number,
    change24h: number,
    timestamp: Date
}

export { ICrypto };
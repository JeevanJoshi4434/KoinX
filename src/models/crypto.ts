import { Schema, Model, model } from 'mongoose';
import { ICrypto } from '../types/crypto';

// Mongoose Schema and Model for Crypto
const cryptoSchema: Schema<ICrypto> = new Schema(
    {
        coin: { type: String, required: true },
        price: { type: Number, required: true },
        marketCap: { type: Number, required: true },
        change24h: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const CryptoModel: Model<ICrypto> = model<ICrypto>('Crypto', cryptoSchema);


export class Crypto {

    constructor() {

    }

    /**
     * Creates a new Crypto document in the database
     * @returns Promise<ICrypto>
     */
    public static async create(coin: string, price: number, marketCap: number, change24h: number, timestamp: Date): Promise<ICrypto> {
        const crypto = new CryptoModel({ coin, price, marketCap, change24h, timestamp });
        return await crypto.save();
    }

    /**
     * Static method to find the latest record of a cryptocurrency
     * @param coin - Coin name
     * @returns Promise<ICrypto | null>
     */
    public static async findLatest(coin: string): Promise<ICrypto | null> {
        return await CryptoModel.findOne({ coin }).sort({ timestamp: -1 }).exec();
    }

    /**
     * Static method to find the last N records of a cryptocurrency
     * @param coin - Coin name
     * @param limit - Number of records to fetch
     * @returns Promise<ICrypto[]>
     */
    public static async findLastNRecords(coin: string, limit: number): Promise<ICrypto[]> {
        return await CryptoModel.find({ coin }).sort({ timestamp: -1 }).limit(limit).exec();
    }
}

import axios from "axios";
import { Crypto } from "../models/crypto";
import { Request, Response } from "express";
import { globalErrorHandler } from "../utils/errorHandler";



class CryptoController extends Crypto {
    constructor() {
        super();
    }

    /**
     * Background job to fetch cryptocurrency data and store it in the database.
     * This function fetches data from CoinGecko API and saves it.
     */
    public static async fetchAndStoreCryptoData(): Promise<void> {
        const coins = ["bitcoin", "matic-network", "ethereum"]; // CoinGecko IDs
        const baseURL = "https://api.coingecko.com/api/v3";

        try {
            for (const coin of coins) {
                const response:any = await axios.get(`${baseURL}/simple/price`, {
                    params: {
                        ids: coin,
                        vs_currencies: "usd",
                        include_market_cap: true,
                        include_24hr_change: true,
                    },
                });

                const data = response.data[coin];
                if (data) {
                    await this.create(coin, data.usd, data.usd_market_cap, data.usd_24h_change, new Date());
                }else{
                    throw new Error("Data not found");
                }
            }
        } catch (error) {
            console.error("Error fetching and storing cryptocurrency data:", error);
        }
    }

    /**
     * API to get the latest stats for a specific cryptocurrency.
     * Endpoint: /stats
     */
    public static async getStats(req: Request, res: Response): Promise<void> {
        const { coin } = req.query;
        if (!coin) {
            res.status(400).json({ error: "Coin query parameter is required." });
            return;
        }

        try {
            const latestRecord = await super.findLatest(coin as string);
            if (latestRecord) {
                res.json({
                    price: latestRecord.price,
                    marketCap: latestRecord.marketCap,
                    "24hChange": latestRecord.change24h,
                });
            } else {
                res.status(404).json({ error: "No data found for the requested cryptocurrency." });
            }
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }

    /**
     * API to calculate the standard deviation of the last 100 price records of a cryptocurrency.
     * Endpoint: /deviation
     */
    public static async getPriceDeviation(req: Request, res: Response): Promise<void> {
        const { coin } = req.query;
        if (!coin) {
            res.status(400).json({ error: "Coin query parameter is required." });
            return;
        }

        try {
            const lastRecords = await super.findLastNRecords(coin as string, 100);
            if (!lastRecords.length) {
                res.status(404).json({ error: "No sufficient data found for the requested cryptocurrency." });
                return;
            }
            const prices = lastRecords.map(record => record.price);
            const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
            const variance =
            prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
            const standardDeviation = Math.sqrt(variance);

            res.json({ deviation: parseFloat(standardDeviation.toFixed(2)) });
        } catch (error) {
            globalErrorHandler(error, res);
        }
    }
}

export { CryptoController };

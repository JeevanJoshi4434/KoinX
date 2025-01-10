import express from 'express';
import { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import connectDB from './db/mongoDB';
import cron from "node-cron";
import { CryptoController } from "./controllers/crypto";

// Load environment variables
dotenv.config();
class App {
  public app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3000;
    connectDB();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandlers();

    // Schedule the job to run every 2 hours
    cron.schedule("0 */2 * * *", async () => {
      try {
        console.log("Fetching and storing crypto data...");
        await CryptoController.fetchAndStoreCryptoData();
        console.log("Crypto data successfully fetched and stored.");
      } catch (error) {
        console.error("Error occurred while fetching crypto data:", error);
      }
    });

    // Trigger the first execution immediately
    (async () => {
      try {
        console.log("Initial fetch and store of crypto data...");
        await CryptoController.fetchAndStoreCryptoData();
        console.log("Initial crypto data successfully fetched and stored.");
      } catch (error) {
        console.error("Error during initial fetch of crypto data:", error);
      }
    })();
  }

  private initializeMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true, limit: '5mb' }));

    // CORS configuration
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error(`Origin ${origin} is not allowed by CORS`));
          }
        },
      }),
    );
  }

  private initializeRoutes(): void {
    this.app.use('/api', routes);
  }

  private initializeErrorHandlers(): void {
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({ error: 'Route not found', availableRoutes: '/api/stats?coin=$coinname or /api/deviation?coin=$coinname' });
    });

    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    });
  }


  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on PORT ${this.port}`);
    });
  }
}

export default App;

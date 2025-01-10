# KoinX Backend Task

This repository contains the implementation of the tasks assigned by **KoinX** for creating a backend application to fetch and manage cryptocurrency data using the CoinGecko API. The tasks involve building a Node.js backend with MongoDB for data storage and providing APIs to retrieve cryptocurrency statistics and calculate price deviations.

## Features Implemented

### Task 1: Background Job to Fetch Cryptocurrency Data
- A background job is implemented to fetch the following details for 3 cryptocurrencies: **Bitcoin**, **Matic**, and **Ethereum**:
  - **Price in USD**
  - **Market Cap in USD**
  - **24-Hour Change**
- The job runs every **2 hours** to fetch the data from the [CoinGecko API](https://docs.coingecko.com/v3.0.1/reference/introduction).
- Data fetched is stored in a MongoDB database for future use.

### Task 2: API to Fetch Latest Cryptocurrency Stats
- Implemented an API endpoint `/stats` to fetch the latest data for a requested cryptocurrency.
- **Query Parameters:**
  ```json
  {
      "coin": "bitcoin" // Can be one of 'bitcoin', 'matic-network', 'ethereum'
  }
  ```
- **Sample Response:**
  ```json
  {
      "price": 40000,
      "marketCap": 800000000,
      "24hChange": 3.4
  }
  ```

### Task 3: API to Calculate Standard Deviation of Prices
- Implemented an API endpoint `/deviation` to calculate the **standard deviation** of the last 100 price records of the requested cryptocurrency.
- **Query Parameters:**
  ```json
  {
      "coin": "bitcoin" // Can be one of 'bitcoin', 'matic-network', 'ethereum'
  }
  ```
- **Sample Response:**
  ```json
  {
      "deviation": 4082.48
  }
  ```
- Standard deviation is calculated using the formula:
  ```
  variance = \sum_{i=1}^{n} (price[i] - mean)^2 / n
  standardDeviation = \sqrt{variance}
  ```

## Optional Features
- Deployed the MongoDB database using **MongoDB Atlas**.
- Deployed the backend API on a cloud platform, making it publicly accessible. 

## APIs for testing
- /api/stats?coin=bitcoin
- /api/deviation?coin=bitcoin

## Technologies Used
- **Node.js**: Backend runtime environment.
- **Express.js**: Framework for building APIs.
- **MongoDB**: NoSQL database for storing cryptocurrency data.
- **CoinGecko API**: Source of cryptocurrency data.
- **Axios**: HTTP client for API requests.
- **node-cron**: For scheduling the background job.

## Project Structure
```
├── src
│   ├── controllers
│   │   └── crypto.ts  // Contains logic for API endpoints and background jobs
│   ├── db
│   │   └── mongoDB.ts  // Contains database connection logic
│   ├── models
│   │   └── crypto.ts      // Mongoose model for cryptocurrency data
│   ├── routes
│   │   └── crypto.ts      // API route definitions
│   ├── types
│   │   └── crypto.d.ts    // Type definitions
│   ├── app.ts             // Application entry point
│   ├── server.ts          // Entry point of the application
│   
├── package.json          // Dependencies and scripts   
├── README.md             // Project documentation
├── tsconfig.json         // TypeScript configuration

```

## How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file and add the following:
   ```env
   MONGO_URI=mongodb://localhost:27017/crypto_db
   PORT=4000
   ```

4. **Start the application:**
   ```bash
   npm start
   ```

5. **Run the background job:**
   The job runs automatically every 2 hours. You can trigger it manually for testing:
   ```bash
   npm run fetch-data
   ```

## API Endpoints

### `/stats` - Get Latest Cryptocurrency Stats
**Method:** `GET`

**Query Params:**
```json
{
    "coin": "bitcoin" // Required. Can be 'bitcoin', 'matic-network', 'ethereum'
}
```

**Response:**
```json
{
    "price": 40000,
    "marketCap": 800000000,
    "24hChange": 3.4
}
```

### `/deviation` - Get Standard Deviation of Prices
**Method:** `GET`

**Query Params:**
```json
{
    "coin": "bitcoin" // Required. Can be 'bitcoin', 'matic-network', 'ethereum'
}
```

**Response:**
```json
{
    "deviation": 4082.48
}
```

## Future Enhancements
- Add more cryptocurrencies for tracking.
- Implement caching to optimize API responses.
- Add user authentication for accessing APIs.
- Deploy to a production-grade server for high availability.


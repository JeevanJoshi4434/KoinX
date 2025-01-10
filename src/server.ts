import axios from 'axios';
import App from './app';
import Logger from './utils/errorlogger';

const appInstance = new App();
const logger = Logger.getInstance();

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  logger.logError(`Uncaught Exception: ${error}`);
  process.exit(1); 
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  logger.logError(`Unhandled Rejection: ${reason}`);
  process.exit(1);
});

// function for keeping server alive so it doesn't shut down after 50 second (ignore it)
async function serverKeepAlive() {
  try {
    const res = await axios.get('https://koinx-9ptx.onrender.com/api/stats');
    if (res.data) {
      console.log("OK");
    }
  } catch (error) {
    console.error('Error during server keep alive:', error);
    logger.logError(`Server Keep Alive Error: ${error}`);
  }
}

setInterval(() => {
  serverKeepAlive(); 
}, 40000);

appInstance.start();

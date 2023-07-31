import config from "../config.js";
import LoggerService from "../services/loggerService.js";


const logger = new LoggerService(config.app.AROUND)

const attachLogger = (req,res,next) =>{
    req.logger = logger.logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
}


export default attachLogger;
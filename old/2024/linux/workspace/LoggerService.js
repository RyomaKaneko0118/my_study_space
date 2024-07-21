import { createLogger, transports, format } from 'winston'
import 'dotenv/config'

export class LoggerService {
  constructor() {
    const createTransports = () => {
      const consoleTransport = new transports.Console({
        level: 'debug',
        format: format.combine(format.colorize(), format.simple())
      })
      if (process.env.NODE_ENV === 'development') {
        return consoleTransport
      } else {
        return [
          consoleTransport,
          new transports.File({
            level: 'debug',
            format: format.combine(format.timestamp(), format.json()),
            filename: `logs/${process.env.NODE_ENV}.log`
          }),
          new transports.File({
            level: 'error',
            format: format.combine(format.timestamp(), format.json()),
            filename: `logs/${process.env.NODE_ENV}-error.log`
          })
        ]
      }
    }
    this.logger = createLogger({
      transports: createTransports()
    })
  }

  log(message) {
    this.logger.info(message)
  }

  error(message, trace) {
    this.logger.error(message)
    if (trace) this.logger.error(`trace: ${trace}`)
  }

  warn(message) {
    this.logger.warn(message)
  }

  debug(message) {
    this.logger.debug(message)
  }

  verbose(message) {
    this.logger.verbose(message)
  }
}

const loggerService = new LoggerService()
const message = 'Hello, world!'
loggerService.error(message)
loggerService.log(message)
loggerService.warn(message)
loggerService.debug(message)
loggerService.verbose(message)


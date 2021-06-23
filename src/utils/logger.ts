import safeStringify from 'fast-safe-stringify'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const frontendlogger = (window as any).frontendlogger

// Grafana - Metrikk
export const event = (arg: Record<string, unknown>): void => {
    frontendlogger.event(arg)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const msgToString = (msg: string, arg?: any): string => {
    if (arg) {
        if(arg.stack){
            return `${msg} - ${safeStringify(arg.stack)}`
        }
        return `${msg} - ${safeStringify(arg)}`
    }
    return msg
}

// Kibana - Warning
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const warn = (msg: string, arg?: any): void => {
    frontendlogger.warn(msgToString(msg, arg))
}

// Kibana - Info
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const info = (msg: string, arg?: any): void => {
    frontendlogger.info(msgToString(msg, arg))
}

// Kibana - Error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const error = (msg: string, arg?: any): void => {
    frontendlogger.error(msgToString(msg, arg))
}

export const logger = {
    event,
    error,
    warn,
    info,
}

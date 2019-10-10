import { ServiceRequest } from './service-request'
export class Unsubscribe extends ServiceRequest {
    username: string
    symbol: string
    eventType: string

    constructor(username: string, symbol: string) {
        super(username)
        this.symbol = symbol
        this.eventType = 'unsubscribe'
    }
}


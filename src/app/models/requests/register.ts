import { ServiceRequest } from './service-request'

export class Register extends ServiceRequest {
    username: string
    eventType: string

    constructor(username: string) {
        super(username)
        this.eventType = 'register'
    }
}

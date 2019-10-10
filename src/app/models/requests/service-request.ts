export class ServiceRequest {
    username: string
    eventType: string

    constructor(username: string) {
        this.username = username
        this.eventType = 'unknown'
    }
}

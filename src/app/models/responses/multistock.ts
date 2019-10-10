import { Stock } from '../stock';
import { ServiceResponse } from './service-response';

export class Multistock extends ServiceResponse {
    user?: string
    stocks?: Stock[]

    constructor(user: string, stocks: Stock[]) {
        super(user)
        this.stocks = stocks
    }
}

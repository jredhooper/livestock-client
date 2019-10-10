import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { Stock } from '../models/stock';
import { Subscribe } from '../models/requests/subscribe';
import { Register } from '../models/requests/register';
import { ServiceRequest } from '../models/requests/service-request';
import { Unsubscribe } from '../models/requests/unsubscribe';
import { ServiceResponse } from '../models/responses/service-response';
import { HttpClient } from '@angular/common/http';
import { Multistock } from '../models/responses/multistock';

@Injectable({
  providedIn: 'root'
})
export class StocksService {
  stocksMap: Map<string, Stock> = new Map()
  private sock: WebSocketSubject<ServiceRequest> = webSocket("ws://localhost:9000");
  username: string
  private http: HttpClient

  

  constructor(http: HttpClient) {
    this.http = http
  }

  loggedIn() {
    return this.username != null
  }

  handle(response: ServiceResponse) {
    if (response as Multistock != null) this.handleMultistock(response as Multistock)
  }

  handleMultistock(response: Multistock) {
    let func = (stock) => {
      if (stock.username == this.username) {
        this.stocksMap.set(stock.symbol, stock)
        this.emitStocks(this.stocksMap)
      }
    }
    response.stocks.forEach(func)
  }

  register(username: string) {
    this.emitUsername(username)
    this.http.post("http://localhost:9000/actions", new Register(username))
      .subscribe(() =>
        this.sock.subscribe(
          msg => {
            this.handle(msg);
          },
          err => console.log(err),
          () => {
            console.log('complete')
            /* restart */
            this.register(username)
          }
        ))
  }

  subscribe(stockName: string) {
    if (this.loggedIn()) this.http.post("http://localhost:9000/actions", new Subscribe(this.username, stockName))
      .subscribe(() => this.stocksMap.set(stockName, { symbol: stockName }))
    else console.log('need to login to subscribe first')
  }

  unsubscribe(stockName: string) {
    if (this.loggedIn()) this.http.post("http://localhost:9000/actions", new Unsubscribe(this.username, stockName))
      .subscribe(() => this.stocksMap.delete(stockName))
    else console.log('how.. did you get here?')
    // this.sock.next(new Unsubscribe(this.username, stockName))
  }

  containsStock(stock: Stock) {
    return this.stocksMap.get(stock.symbol) === null || this.stocksMap.get(stock.symbol) === undefined
  }

  upsertStock(stock: Stock) {
    this.subscribe(stock.symbol)
  }

  removeStock(stock: Stock) {
    if (!!stock) {
      this.unsubscribe(stock.symbol)
    }
  }

  public stocks = new Rx.Subject<Map<string, Stock>>();

  emitStocks(map: Map<string, Stock>) {
    this.stocksMap = map
    this.stocks.next(map);
  }

  public user = new Rx.Subject<string>();

  emitUsername(name: string) {
    this.username = name
    this.user.next(name);
  }
}

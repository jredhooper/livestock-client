import { Component, OnInit, Input } from '@angular/core';
import { StocksService } from '../services/stocks.service';
import { Stock } from '../models/stock';
import { NgForm } from '@angular/forms';
import { Sort } from '@angular/material';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.sass']
})
export class StockListComponent implements OnInit {
  title = 'Stocks Application'
  stocks: Map<String, Stock>
  sortedData: Array<Stock>
  username: String

  constructor(private stockService: StocksService) {

    this.stocks = stockService.stocksMap
    stockService.stocks.subscribe(value =>
      this.stocks = value
    )

    this.username = stockService.username
    stockService.user.subscribe(value =>
      this.username = value
    )

    this.sortedData = Array.from(this.stocks.values())
  }

  onSubmit(f: NgForm) {
    this.stockService.upsertStock({
      symbol: f.value.symbol
    })
    f.reset();
  }

  delete(item) {
    this.stockService.removeStock({
      symbol: item.value.symbol
    })
  }

  sortData(sort: Sort) {
    const data = Array.from(this.stocks.values()).slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'symbol': return compare(a.symbol, b.symbol, isAsc)
        case 'ask': return compare(a.ask, b.ask, isAsc)
        case 'askSize': return compare(a.askSize, b.askSize, isAsc)
        case 'bid': return compare(a.bid, b.bid, isAsc)
        case 'bidSize': return compare(a.bidSize, b.bidSize, isAsc)
        case 'price': return compare(a.price, b.price, isAsc)
        case 'open': return compare(a.open, b.open, isAsc)
        case 'volume': return compare(a.volume, b.volume, isAsc)
        case 'dayLow': return compare(a.dayLow, b.dayLow, isAsc)
        case 'dayHigh': return compare(a.dayHigh, b.dayHigh, isAsc)
        default: return 0;
      }
    });

    function compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }


  ngOnInit() {
  }

}


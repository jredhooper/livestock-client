import { Component, OnInit, Input } from '@angular/core';
import { Stock } from '../models/stock';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.sass']
})
export class StockComponent implements OnInit {
  @Input() public data: Stock;

  constructor() { }

  ngOnInit() {
  }

}

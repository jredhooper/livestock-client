import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { StocksService } from '../services/stocks.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  private stocks: StocksService

  constructor(private stockService: StocksService) {
    this.stocks = stockService
  }

  ngOnInit() {
  }

  login(f: NgForm) {
    console.log(f.value)
    this.stockService.register(f.value.username)
    f.reset()
  }

}

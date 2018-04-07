import {FormsModule} from '@angular/forms';
import { Component, OnInit} from '@angular/core';
import { ForexService } from './services/forex.service';
import * as _ from 'c3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  latest = {};
  start = {};
  today = '';
  change = {};
  dates = [];
  graphValues = [];
  currencies = [];
  currentCurrency = 'USD';
  currencyValues = [];
  startDate = new Date();
  endDate = new Date();
  message = '';
    id = 'chart1';
    width = '100%';
    height = 400;
    type = 'line';
    dataFormat = 'json';
    dataSource;
    title = 'Angular4 FusionCharts Sample';

  constructor(private forex: ForexService) {
    this.dataSource = {
      'chart': {
          'caption': 'Choose a Currency',
          'theme': 'fint',
          'setAdaptiveYMin': '1'
      },
      'data': [
      ]
  };
  }

  ngOnInit() {
    this.forex.latest()
    .subscribe(
      (latest) => {
        console.log(latest);
        this.latest = this.calculate(latest.rates);
      }
    );
    const today = new Date();
    this.today = this.formatDate(today.setDate(today.getDate() - 1));
    console.log(this.today);
    this.forex.day(this.today)
    .subscribe(
      (start) => {
        this.start = this.calculate(start.rates);
        this.currencies = Object.keys(this.start);
        this.change = this.calculateChange(this.latest, this.start);
      }
    );
    this.getWeek();
  }

  calculate(info) {
    Object.keys(info).forEach(key => {
      if (key !== 'MXN') {
        info[key] = (info['MXN'] / info[key]).toFixed(4);
      } else {
        info[key] = info[key].toFixed(4);
      }
     });
     console.log(info);
   return info;
  }

  formatDate(date) {
      const d = new Date(date);
          let month = '' + (d.getMonth() + 1);
          let day = '' + d.getDate();
          const year = d.getFullYear();
      if (month.length < 2) {
        month = '0' + month;
      }
      if (day.length < 2) {
        day = '0' + day;
      }
      return [year, month, day].join('-');
  }
  calculateChange(first, second) {
    const chan = {};
    Object.keys(first).forEach(key => {
      chan[key] = ((first[key] / second[key] - 1) * 100).toFixed(2);
    });
    return chan;
  }
  getYear() {
    this.message = '';
    this.dates = [];
    const date = new Date();
    date.setDate(1);
    this.dates.push(this.formatDate(date));
    for (let i = 1; i <= 11; i++) {
      date.setMonth(date.getMonth() - 1);
      this.dates.push(this.formatDate(date));
    }
    console.log(this.dates);
    this.getValues();
  }

  getMonth() {
    this.message = '';
    this.dates = [];
    const date = new Date();
    this.dates.push(this.formatDate(date));
    for (let i = 1; i <= 14; i++) {
      date.setDate(date.getDate() - 2);
      this.dates.push(this.formatDate(date));
    }
    console.log(this.dates);
    this.getValues();
  }

  getWeek() {
    this.message = '';
    this.dates = [];
    const date = new Date();
    this.dates.push(this.formatDate(date));
    for (let i = 1; i <= 6 ; i++) {
      date.setDate(date.getDate() - 1);
      this.dates.push(this.formatDate(date));
    }
    console.log(this.dates);
    this.getValues();
  }

  getValues() {
    this.graphValues = [];
    for (let i = 0; i < this.dates.length; i++) {
      this.forex.day(this.dates[i])
    .subscribe(
      (value) => {
        this.graphValues.push(value.rates);
      }
    );
    }
    setTimeout(() => {
      this.getCurrencyValues(this.currentCurrency);
    }, 1000);
  }

  getCurrencyValues(currency) {
    this.message = '';
    this.currentCurrency = currency;
    this.currencyValues = [];
    this.dataSource.data = [];
    this.dataSource.chart.caption = currency + 'MXN';
    this.graphValues.forEach((value, index) => {
      if (currency !== 'MXN') {
        this.currencyValues.push(value['MXN'] / value[currency]);
      } else {
        this.currencyValues.push(value[currency]);
      }
      this.dataSource.data.unshift({'label': this.dates[index], 'value': this.currencyValues[index].toFixed(5)});
    });
  }

  getInterval() {
    this.message = '';
    this.dates = [];
    const today = new Date();
    const start = new Date(this.startDate);
    console.log(start);
    const end = new Date(this.endDate);
    if (end < start || today < start || today < end) {
      this.message = 'Dates are wrong!';
    } else {
    console.log(end);
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.dates = [];
    const date = new Date(this.endDate);
    console.log(date);
    if (diffDays < 15) {
      this.dates.push(this.formatDate(date));
      for (let i = 1; i < diffDays ; i++) {
        date.setDate(date.getDate() - 1);
        this.dates.push(this.formatDate(date));
      }
    } else if (diffDays < 30) {
      this.dates.push(this.formatDate(date));
      for (let i = 1; i < diffDays ; i += 2) {
        date.setDate(date.getDate() - 2);
        this.dates.push(this.formatDate(date));
      }
    } else if (diffDays < 60) {
      this.dates.push(this.formatDate(date));
      for (let i = 1; i < diffDays ; i += 4) {
        date.setDate(date.getDate() - 4);
        this.dates.push(this.formatDate(date));
      }
    } else if (diffDays < 120) {
      this.dates.push(this.formatDate(date));
      for (let i = 1; i < diffDays ; i += 8) {
        date.setDate(date.getDate() - 8);
        this.dates.push(this.formatDate(date));
      }
    } else if (diffDays < 240) {
      this.dates.push(this.formatDate(date));
      for (let i = 1; i < diffDays ; i += 16) {
        date.setDate(date.getDate() - 16);
        this.dates.push(this.formatDate(date));
      }
    } else if (diffDays < 366) {
      this.dates.push(this.formatDate(date));
      for (let i = 1; i < diffDays ; i += 24) {
        date.setDate(date.getDate() - 24);
        this.dates.push(this.formatDate(date));
      }
    } else {
      this.message = 'Max range is a year';
    }

    console.log(this.dates);
    this.getValues();
  }
}
}

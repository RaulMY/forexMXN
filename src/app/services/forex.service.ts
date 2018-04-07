import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';


@Injectable()
export class ForexService {
  key = '4be23f3944f1fd7a0993ed2e95df0d0b';
  constructor(private http: Http) { }

  handleError(e) {
    return Observable.throw(e.json().message);
  }

  latest() {
    return this.http.get(`//data.fixer.io/api/latest?access_key=${this.key}`)
      .map(res => res.json())
      .catch(this.handleError);
  }

  day(date) {
    return this.http.get(`//data.fixer.io/api/${date}?access_key=${this.key}`)
      .map(res => res.json())
      .catch(this.handleError);
  }


}

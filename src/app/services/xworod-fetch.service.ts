import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class XwordFetchService {

  constructor(private http: HttpClient) { }

  getXword(date:string){
    const url = `https://www.xwordinfo.com/JSON/Data.aspx?date=${date}`;
    return this.http.jsonp(url, 'callback');
  }
}
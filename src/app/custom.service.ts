import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomService {



  constructor(private _obj:HttpClient) {}
  

  getCustomerData(url: string) {
    let array: {key: any, value: {}}[] = [];
    let header = new HttpHeaders().set('Type-content','application/json');
    return this._obj.post(url,{"from":0,"query":"figurita","size":40}, {headers: header}).pipe(map(res => Object.entries(res).map(([key, value]) => ({key, value: value}))));
  }

}
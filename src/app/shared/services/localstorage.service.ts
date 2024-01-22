import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  public setItem(key:string,value:any){
    localStorage.setItem(key,JSON.stringify(value));
  }

  public getItem(key:string){
    const value = JSON.parse(localStorage.getItem(key) || '');
    return value;
  }
}

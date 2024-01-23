import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  constructor() {}

  public setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getItem(key: string) {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
  }
}

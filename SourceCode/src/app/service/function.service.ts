import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
// import CryptoJS from "crypto-js";

@Injectable()
export class FunctionService {

  constructor(private router: Router) { }

  // public encrypt(string, passphrase) {
  //   return CryptoJS.AES.encrypt(string, passphrase);
  // }

  // public decrypt(string, passphrase) {
  //   return CryptoJS.AES.decrypt(string, passphrase);
  // }

  public checkAndRedirect(condition: string, to: string) {
    if(!localStorage[condition]) {
      this.router.navigate([to]);
    }
  }

  public getFromLocal(item: string) {
    return JSON.parse(localStorage.getItem(item));
  }

  public setToLocal(item: string, data: any) {
    localStorage.setItem(item, JSON.stringify(data));
  }
  public tryParseJSON(jsonString) {
      try {
          var o = JSON.parse(jsonString);
          if (o && typeof o === "object") {
              return o;
          }
      }
      catch (e) { }

      return false;
  }
  // public tryCryptoENCUtf8(str){
  //   try {
  //       var strOutput = str.toString(CryptoJS.enc.Utf8);
  //       if (strOutput) {
  //           return strOutput;
  //       }
  //   }
  //   catch (e) { }

  //   return false;
  // }
}

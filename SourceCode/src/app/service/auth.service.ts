import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

import { BaseService } from "./base.service";
import { Constants } from './constant';

@Injectable()
export class AuthService {
  public token;
  public profile;

  constructor(private baseService: BaseService) { }

  login(username, password) {
    return new Promise((resolve, reject) => {
      let body = { username, password };
      let url = `${Constants.baseUrl}/Accounts/login`
      return this.baseService.postSth(url, body, Constants.commonHeader)
      .subscribe(
        value => {
          if (value.success === true) {
            this.token = value.token;
            this.profile = value.profile;
            resolve()
          }
          else {
            reject(value.error)
          }
        },
        error => { reject(error) }
      )
    });
  }
}

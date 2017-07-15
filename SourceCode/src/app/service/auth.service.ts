import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Router } from '@angular/router';

import { BaseService } from "./base.service";
import { Constants } from './constant';

@Injectable()
export class AuthService {
  public currentUser;

  constructor(
    private baseService: BaseService,
    private router: Router,
  ) {
    if (localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
  }

  login(username, password) {
    return new Promise((resolve, reject) => {
      let body = { username, password };
      let url = `${Constants.baseUrl}/Accounts/login`
      return this.baseService.postSth(url, body, Constants.commonHeader)
        .subscribe(
        value => {
          if (value.success === true) {
            resolve();
            this.updateLocalToken(value.token);
            delete value.token;
            this.currentUser = value.profile;
            this.updateLocalUser();
          }
          else {
            reject(value.error)
          }
        },
        error => { reject(error) }
        )
    });
  }

  resetUser() {
    this.currentUser = undefined;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentToken');
  }

  updateLocalToken(token) {
    localStorage.setItem('currentToken', (token));
  }

  updateLocalUser() {
    // var encryptedAES = this.functionService.encrypt(JSON.stringify(this.currentUser), Constants.secretPassphrase);
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    // localStorage.setItem('currentUserMabArtisan', JSON.stringify(this.currentUser));
  }

  getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    } else {
      return null;
    }
  }

  getLocalToken() {
    var result = localStorage.getItem('currentToken');
    return (result !== null && typeof result !== 'undefined') ? result : null;
  }

  isLoggedIn() {
    var result = this.currentUser;
    result = (result !== null && typeof result !== 'undefined') ? result : null;
    return (result === null ? false : true);
  }

}

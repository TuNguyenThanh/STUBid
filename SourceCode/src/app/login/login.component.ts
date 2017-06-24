import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';

import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [
    FormBuilder,
    AuthService
  ]
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  loading = false;
  radius = false;

  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public router: Router
  ) {
    let token = this.authService.token;
    if (token) {
      this.router.navigate(['/dashboard']);
    }
    else {
      this.formLogin = this.formBuilder.group({
        username: ['testadmin', Validators.minLength(8)],
        password: ['123456', Validators.minLength(8)]
      });
    }
  }

  ngOnInit() {
  }

  submit() {
    let md5 = new Md5();
    let { username, password } = this.formLogin.value;
    this.loading = !this.loading;
    this.authService.login(username, md5.appendStr(password).end())
    .then(() => {
      let that = this;
      that.loading = !that.loading;
      this.router.navigate(['/dashboard']);
    })
    .catch(error => {
      this.loading = !this.loading;
      console.log(error);
    })
  }
}

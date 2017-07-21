import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  returnUrl: string;
  formLogin: FormGroup;
  loading = false;
  radius = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    try {
      localStorage.setItem('test', '1');
      localStorage.getItem('test');
    } catch (e) {
      alert('Đăng nhập không được hỗ trợ trên trình duyệt hiện tại!');
      this.router.navigate(['']);
    }
    if (authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    this.formLogin = this.formBuilder.group({
      username: ['testadmin', Validators.minLength(8)],
      password: ['123456', Validators.minLength(8)]
    });
    route.queryParams.subscribe((params: any) => {
      this.returnUrl = params.returnUrl
    })
  }

  ngOnInit() {
  }

  submit() {
    let md5 = new Md5();
    let { username, password } = this.formLogin.value;
    this.radius = true;
    setTimeout(() => {
      this.loading = true;
    }, 400);
    this.authService.login(username, md5.appendStr(password).end())
    .then(() => {
      let that = this;
      that.loading = !that.loading;
      this.router.navigate([this.returnUrl || '/dashboard']);
    })
    .catch(error => {
      this.loading = !this.loading;
      console.log(error);
    })
  }
}

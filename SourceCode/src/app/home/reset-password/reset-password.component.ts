import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../service/auth.service';

declare const componentHandler: any;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, AfterViewChecked {
  newPassword: string;
  username: string;
  isError: boolean;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.authService.resetPassword(params.token).subscribe(
        (res: any) => {
          if (res.success) {
            this.username = res.username;
            this.newPassword = res.newPassword;
          } else {
            this.isError = true;
            console.log(res.error);
          }
        },
        (err: any) => {
          this.isError = true;
          console.log(err);
        }
      );
    });
  }

  ngAfterViewChecked() {
    componentHandler.upgradeAllRegistered();
  }

}

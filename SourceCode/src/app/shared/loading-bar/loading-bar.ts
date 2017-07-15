import { Injectable } from '@angular/core';

@Injectable()
export class LoadingBar {
  loading = false;

  show() { this.loading = true }
  hide() { this.loading = false }
}
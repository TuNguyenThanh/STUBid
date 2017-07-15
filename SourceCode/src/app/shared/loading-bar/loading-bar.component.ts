import { Component, OnInit } from '@angular/core';

import { LoadingBar } from './loading-bar';

@Component({
  selector: 'app-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss']
})
export class LoadingBarComponent implements OnInit {

  constructor(
    public loadingBar: LoadingBar
  ) { }

  ngOnInit() {
  }

}

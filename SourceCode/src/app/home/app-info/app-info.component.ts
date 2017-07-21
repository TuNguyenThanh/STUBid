import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-app-info',
  templateUrl: './app-info.component.html',
  styleUrls: ['./app-info.component.scss']
})
export class AppInfoComponent implements OnInit {
  @HostBinding('class') hostClass = 'row';
  imagesCount = 8;
  images: string[];
  active: number;

  constructor() {
    this.images = Array(this.imagesCount);
    this.active = 0;
  }

  ngOnInit() {
  }

}

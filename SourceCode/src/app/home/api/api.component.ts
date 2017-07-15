import { Component, OnInit } from '@angular/core';

declare var routes: any;
declare var socketEvents: any;
declare var errors: any;

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
})
export class ApiComponent implements OnInit {
  routes: any;
  socketEvents: any;
  errors: any;
  view: number = 0;

  constructor( ) { }

  ngOnInit() {
    this.routes = routes;
    this.socketEvents = socketEvents;
    this.errors = errors;
  }

  jsonFormat(obj) {
    let preJSON = JSON.stringify(obj, undefined, 2);
    return preJSON;
  }

  goToTop() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

}

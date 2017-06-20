import { Component, OnInit } from '@angular/core';
import { trigger, state, transition, animate, style } from '@angular/core';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss'],
  animations: [trigger('slideOut', [
        state('true', style({ height: '*' })),
        state('false', style({ height: '10px' })),
        transition('1 => 0', animate('400ms ease')),
        transition('0 => 1', animate('400ms ease'))
    ])]
})
export class GuideComponent implements OnInit {
  openingGuide: string;
  collapsed: boolean;

  constructor() { }

  ngOnInit() {
  }

  toggle(key: string) {
    this.collapsed = !this.collapsed;
    this.openingGuide = (this.openingGuide === key) ? '' : key;
  }
}

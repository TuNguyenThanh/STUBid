import { Component, OnInit } from '@angular/core';

import { DocumentService } from '../../service/document.service';

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
  providers: [DocumentService]
})
export class ApiComponent implements OnInit {
  documents: Map<string, any>;
  loaded: number;
  view: number = 0;

  constructor(
    private documentService: DocumentService,
  ) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.documents = new Map<string, any>();
    this.loaded = 0;
    [
      'routes',
      'socketEvents',
      'errors',
    ].forEach((e: string, i: number) => {
      this.documentService.get(`doc.${e}.json`).subscribe(
        (value: any) => {
          console.log(value);
          this.documents[e] = JSON.parse(value._body);
          if (i === 2) console.log(this.documents[e]);
          this.loaded++;
        },
        (error: any) => {
          console.log(error);
        }
      );
    })
  }

  jsonFormat(obj) {
    let preJSON = JSON.stringify(obj, undefined, 2);
    return preJSON;
  }

  goToTop() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

}

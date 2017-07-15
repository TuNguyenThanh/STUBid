import { Injectable } from '@angular/core';
import { BaseService } from "./base.service";
import { Constants } from "./constant";

@Injectable()
export class DocumentService {

  constructor(
    public baseService: BaseService
  ) { }

  get(fileName: string) {
    let reqURL = `${Constants.baseUrl}/files/${fileName}`;
    return this.baseService.getRaw(reqURL);
  }
}

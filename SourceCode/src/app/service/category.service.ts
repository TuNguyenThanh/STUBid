import { Injectable } from '@angular/core';
import { BaseService } from "./base.service";
import { Constants } from "./constant";

@Injectable()
export class CategoryService {
  constructor(
    public baseService: BaseService
  ) { }

  getAll() {
    let url = `${Constants.baseUrl}/Categorys`;
    return this.baseService.getSth(url, Constants.commonHeader);
  }
}

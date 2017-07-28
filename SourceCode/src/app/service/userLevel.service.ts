import { Injectable } from '@angular/core';
import { BaseService } from "./base.service";
import { Constants } from "./constant";

@Injectable()
export class UserLevelService {
  constructor(
    public baseService: BaseService
  ) { }

  getAll() {
    let url = `${Constants.baseUrl}/UserLevels`;
    return this.baseService.getSth(url, Constants.commonHeader);
  }
}

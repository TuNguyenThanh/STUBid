import { Injectable } from '@angular/core';
import { BaseService } from "./base.service";
import { Constants } from "./constant";

@Injectable()
export class ProductService {
  constructor(
    public baseService: BaseService
  ) { }

  update(productId: string, product: any, token: string) {
    let url = `${Constants.baseUrl}/Products/${productId}`;
    let body = { token, product };
    return this.baseService.patchSth(url, body, Constants.commonHeader);
  }
}

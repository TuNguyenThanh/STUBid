import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'


@Injectable()
export class BaseService {
  constructor(
    public http: Http
  ) { }

  getSth(url: string, optionsHeader?: any): Observable<any> {
    let headers = new Headers(optionsHeader);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  postSth(url: string, bodyReq, optionsHeader?: any): Observable<any> {
    let body = JSON.stringify(bodyReq);
    let headers = new Headers(optionsHeader);
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, body, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  putSth(url: string, bodyReq, optionsHeader?: any): Observable<any> {
    let body = JSON.stringify(bodyReq);
    let headers = new Headers(optionsHeader);
    let options = new RequestOptions({ headers: headers });
    return this.http.put(url, body, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  patchSth(url: string, bodyReq, optionsHeader?: any): Observable<any> {
    let body = JSON.stringify(bodyReq);
    let headers = new Headers(optionsHeader);
    let options = new RequestOptions({ headers: headers });
    return this.http.patch(url, body, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  deleteSth(url: string, optionsHeader?: any): Observable<any> {
    let headers = new Headers(optionsHeader);
    let options = new RequestOptions({ headers: headers });
    return this.http.delete(url, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  getRaw(url: string, optionsHeader?: any) {
    let headers = new Headers(optionsHeader);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options)
      .catch(this.handleError);
  }

  handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}

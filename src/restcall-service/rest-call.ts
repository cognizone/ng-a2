import {HttpHeaders, HttpParams} from '@angular/common/http';

export class RestCall {
  private _url: string;
  private _parameters = new HttpParams();
  private _headers = new HttpHeaders();
  private _body: any;
  private _options = new Map<'reportProgress' | 'responseType' | 'withCredentials' | 'observe', any>();


  constructor(
    url: string,
    parameters: HttpParams,
    headers: HttpHeaders,
    body: any,
    options: Map<'reportProgress' | 'responseType' | 'withCredentials' | 'observe', any>) {
    this._url = url;
    this._parameters = parameters;
    this._headers = headers;
    this._body = body;
    this._options = options;
  }

  get url(): string {
    return this._url;
  }

  get parameters(): HttpParams {
    return this._parameters;
  }

  get headers(): HttpHeaders {
    return this._headers;
  }

  get body(): any {
    return this._body;
  }

  get options() {
    return this._options;
  }
}

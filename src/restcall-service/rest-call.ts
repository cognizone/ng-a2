import {HttpHeaders, HttpParams} from '@angular/common/http';
import {RestCallService} from './rest-call.service';
import {Observable} from 'rxjs';
import {HttpResponse} from "@angular/common/http/src/response";
import {map} from 'rxjs/operators';
import {Preconditions} from "../precondition/preconditions";

export class RestCall {
  private _url: string;
  private _parameters = new HttpParams();
  private _headers =  new HttpHeaders();
  private _body: any;
  private _options = new Map<'reportProgress' | 'responseType' | 'withCredentials' | 'observe', any>();

  constructor(url: string, parameters: HttpParams, headers: HttpHeaders, body: any, options: Map<'reportProgress' | 'responseType' | 'withCredentials' | 'observe', any>) {
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

export class RestCallBuilder {
  private _host: string;
  private _path: string;
  private _parameters = new Map<string, any>();
  private _headers = new Map<string, string>();
  private _body: any;
  private _responseMapFunctions: ((response: any) => any)[] = [];
  private _options = new Map<'reportProgress' | 'responseType' | 'withCredentials' | 'observe', any>();

  private service: RestCallService;

  constructor(service: RestCallService) {
    this.service = service;
  }

  public addHeaders (name: string, value: string): RestCallBuilder {
    this._headers.set(name, value);
    return this;
  }

  public addParams (name: string, value: any): RestCallBuilder {

    const prev = this._parameters.get(name);
    if (!prev) this._parameters.set(name, value);
    else if (prev instanceof Array) prev.push(value);
    else this._parameters.set(name, [prev, value]);
    return this;
  }

  public withPath (path: string): RestCallBuilder {
    Preconditions.checkState(path.startsWith('/'), () => 'Path must start with \'/\'');
    this._path = path;
    return this;
  }

  public withHost (host: string): RestCallBuilder {
    this._host = host;
    return this;
  }

  public withBody (body: any): RestCallBuilder {
    this._body = body;
    return this;
  }

  public withObserveFullResponse(): RestCallBuilder {
    this._options.set('observe', 'response');
    return this;
  }

  public addOption(key: 'reportProgress' | 'responseType' | 'withCredentials' | 'observe', value: any): RestCallBuilder {
    this._options.set(key, value);
    return this;
  }

  public addResponseMapFunction(map: (response: any) => any): RestCallBuilder {
    this._responseMapFunctions.push(map);
    return this;
  }

  private build(): RestCall {
    Preconditions.checkNotNull(this._host, () => 'host was null');

    let h = new HttpHeaders();
    this._headers.forEach((v, k) => h = h.set(k, v));
    let p = new HttpParams();
    this._parameters.forEach((v, k) => p = p.set(k, v));

    return new RestCall(this._host + this._path, p, h, this._body, this._options);
  }

  private applyResponseMapFunctions(call: any): any {
    this._responseMapFunctions.forEach(map => call = map(call));
    return call;
  }

  public GET(): Observable<any> {
    return this.service.get(this.build())
      .pipe(map(call => this.applyResponseMapFunctions(call)))
  }

  public POST(): Observable<any> {
    return this.service.post(this.build())
      .pipe(map(call => this.applyResponseMapFunctions(call)))
  }

  public PUT(): Observable<any> {
    return this.service.put(this.build())
      .pipe(map(call => this.applyResponseMapFunctions(call)))
  }

  public DELETE(): Observable<any> {
    return this.service.delete(this.build())
      .pipe(map(call => this.applyResponseMapFunctions(call)))
  }
  public GET_fullResponse(): Observable<HttpResponse<any>> {
    this.withObserveFullResponse();
    return this.service.get(this.build())
      .pipe(map(call => this.applyResponseMapFunctions(call)))
  }

  public POST_fullResponse(): Observable<HttpResponse<any>> {
    this.withObserveFullResponse();
    return this.service.post(this.build())
      .pipe(map(call => this.applyResponseMapFunctions(call)))
  }

  public PUT_fullResponse(): Observable<HttpResponse<any>> {
    this.withObserveFullResponse();
    return this.service.put(this.build())
      .pipe(map(call => this.applyResponseMapFunctions(call)))
  }

  public DELETE_fullResponse(): Observable<HttpResponse<any>> {
    this.withObserveFullResponse();
    return this.service.delete(this.build())
      .pipe(map(call => this.applyResponseMapFunctions(call)))
  }

}

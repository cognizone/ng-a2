import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RestCall, RestCallBuilder} from "./rest-call";
import {Observable} from "rxjs";
import {Preconditions} from "../precondition/preconditions";

@Injectable()
export class RestCallService {

  constructor(private http: HttpClient) {}

  public get(call: RestCall): Observable<any> {
    Preconditions.checkNotNull(call);
    return this.http.get(call.url, this.getOptions(call));
  }

  public post(call: RestCall): Observable<any> {
    Preconditions.checkNotNull(call);
    return this.http.post(call.url,  call.body, this.getOptions(call));
  }

  public put(call: RestCall): Observable<any> {
    Preconditions.checkNotNull(call);
    return this.http.put(call.url,  call.body, this.getOptions(call));
  }

  public delete(call: RestCall): Observable<any> {
    Preconditions.checkNotNull(call);
    return this.http.delete(call.url, this.getOptions(call));
  }

  public builder(): RestCallBuilder {
    return new RestCallBuilder(this);
  }

  private getOptions (call: RestCall): any {
    const options = {headers: call.headers, params: call.parameters};
    call.options.forEach((v, k) => options[k] = v);
    return options;
  }
}

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { RestCall } from './rest-call';

describe('RestCall', () => {
  it('should create RestCall with properties', () => {
    const url = 'http://example.org/api';
    const params = new HttpParams().set('key', 'value');
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { data: 'test' };
    const options = new Map<'reportProgress' | 'responseType' | 'withCredentials' | 'observe', any>();

    const restCall = new RestCall(url, params, headers, body, options);

    expect(restCall.url).toBe(url);
    expect(restCall.parameters).toBe(params);
    expect(restCall.headers).toBe(headers);
    expect(restCall.body).toBe(body);
    expect(restCall.options).toBe(options);
  });
});

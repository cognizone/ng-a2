import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RestCallService, RestCallBuilder } from './rest-call.service';
import { RestCall } from './rest-call';
import { HttpHeaders, HttpParams } from '@angular/common/http';

describe('RestCallService', () => {
  let service: RestCallService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RestCallService],
    });
    service = TestBed.inject(RestCallService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('HTTP Methods', () => {
    it('should make GET request', () => {
      const restCall = new RestCall('http://example.org/api', new HttpParams(), new HttpHeaders(), null, new Map());
      const mockResponse = { data: 'test' };

      service.get(restCall).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://example.org/api');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should make POST request with body', () => {
      const restCall = new RestCall('http://example.org/api', new HttpParams(), new HttpHeaders(), { data: 'test' }, new Map());
      const mockResponse = { id: 1 };

      service.post(restCall).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://example.org/api');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ data: 'test' });
      req.flush(mockResponse);
    });

    it('should make PUT request with body', () => {
      const restCall = new RestCall('http://example.org/api', new HttpParams(), new HttpHeaders(), { data: 'updated' }, new Map());
      const mockResponse = { id: 1, data: 'updated' };

      service.put(restCall).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://example.org/api');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ data: 'updated' });
      req.flush(mockResponse);
    });

    it('should make DELETE request', () => {
      const restCall = new RestCall('http://example.org/api/1', new HttpParams(), new HttpHeaders(), null, new Map());

      service.delete(restCall).subscribe();

      const req = httpMock.expectOne('http://example.org/api/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should throw error when call is null', () => {
      expect(() => service.get(null as any)).toThrow();
      expect(() => service.post(null as any)).toThrow();
      expect(() => service.put(null as any)).toThrow();
      expect(() => service.delete(null as any)).toThrow();
    });
  });

  describe('RestCallBuilder', () => {
    it('should create builder instance', () => {
      const builder = service.builder();
      expect(builder).toBeInstanceOf(RestCallBuilder);
    });

    it('should build GET request with host and path', () => {
      const mockResponse = { data: 'test' };

      service
        .builder()
        .withHost('http://example.org')
        .withPath('/api')
        .GET()
        .subscribe(response => {
          expect(response).toEqual(mockResponse);
        });

      const req = httpMock.expectOne('http://example.org/api');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should build POST request with body', () => {
      const mockResponse = { id: 1 };

      service
        .builder()
        .withHost('http://example.org')
        .withPath('/api')
        .withBody({ name: 'test' })
        .POST()
        .subscribe(response => {
          expect(response).toEqual(mockResponse);
        });

      const req = httpMock.expectOne('http://example.org/api');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ name: 'test' });
      req.flush(mockResponse);
    });

    it('should add headers to request', () => {
      service
        .builder()
        .withHost('http://example.org')
        .withPath('/api')
        .addHeaders('Authorization', 'Bearer token123')
        .addHeaders('Content-Type', 'application/json')
        .GET()
        .subscribe();

      const req = httpMock.expectOne('http://example.org/api');
      expect(req.request.headers.get('Authorization')).toBe('Bearer token123');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush({});
    });

    it('should add parameters to request', () => {
      service.builder().withHost('http://example.org').withPath('/api').addParams('page', '1').addParams('limit', '10').GET().subscribe();

      const req = httpMock.expectOne('http://example.org/api?page=1&limit=10');
      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.get('limit')).toBe('10');
      req.flush({});
    });

    it('should handle multiple values for same parameter', () => {
      service.builder().withHost('http://example.org').withPath('/api').addParams('tag', 'tag1').addParams('tag', 'tag2').GET().subscribe();

      const req = httpMock.match(req => req.url.includes('http://example.org/api'))[0];
      const tagParam = req.request.params.get('tag');
      expect(tagParam).toBeDefined();
      expect(tagParam).toContain('tag1');
      expect(tagParam).toContain('tag2');
      req.flush({});
    });

    it('should set parameters (overwrite existing)', () => {
      service.builder().withHost('http://example.org').withPath('/api').addParams('page', '1').setParams('page', '2').GET().subscribe();

      const req = httpMock.expectOne('http://example.org/api?page=2');
      expect(req.request.params.get('page')).toBe('2');
      req.flush({});
    });

    it('should throw error when path does not start with /', () => {
      expect(() => {
        service.builder().withHost('http://example.org').withPath('api');
      }).toThrow("Path must start with '/'");
    });

    it('should throw error when host is null', () => {
      expect(() => {
        service.builder().withPath('/api').GET();
      }).toThrow('host was null');
    });

    it('should return full response when using _fullResponse methods', () => {
      const mockResponse = { data: 'test' };

      service
        .builder()
        .withHost('http://example.org')
        .withPath('/api')
        .GET_fullResponse()
        .subscribe(response => {
          expect(response.body).toEqual(mockResponse);
          expect(response.status).toBe(200);
        });

      const req = httpMock.expectOne('http://example.org/api');
      req.flush(mockResponse, { status: 200, statusText: 'OK' });
    });
  });
});

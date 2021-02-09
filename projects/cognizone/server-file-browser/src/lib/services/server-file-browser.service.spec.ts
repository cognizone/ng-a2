import { TestBed } from '@angular/core/testing';

import { SERVER_FILE_BROWSER_TOKEN } from '../models/server-file-browser.token';
import { SPECIFIC_HOST_ACCESS_SERVICE_TOKEN } from '../models/specific-host-access-service.token';

import { ServerFileBrowserService } from './server-file-browser.service';

describe('ServerFileBrowserService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ServerFileBrowserService,
      { provide: SPECIFIC_HOST_ACCESS_SERVICE_TOKEN, useValue: {} },
      { provide: SERVER_FILE_BROWSER_TOKEN, useValue: {} },
    ]
  }));

  it('should be created', () => {
    const service: ServerFileBrowserService = TestBed.inject(ServerFileBrowserService);
    expect(service).toBeTruthy();
  });
});

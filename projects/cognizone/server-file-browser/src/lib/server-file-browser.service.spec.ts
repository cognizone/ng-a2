import { TestBed } from '@angular/core/testing';

import { ServerFileBrowserService } from './services/server-file-browser.service';

describe('ServerFileBrowserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerFileBrowserService = TestBed.get(ServerFileBrowserService);
    expect(service).toBeTruthy();
  });
});

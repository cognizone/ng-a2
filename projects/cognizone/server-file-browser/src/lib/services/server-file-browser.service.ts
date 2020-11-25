import { Inject, Injectable } from '@angular/core';
import { RestCallBuilder, RestCallInterceptor, SpecificHostAccessService } from "@cognizone/a2";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

import { ServerFileBrowserConfig } from "../models/config";
import { Directory } from "../models/directory";
import { SERVER_FILE_BROWSER_INJECTION_TOKEN } from "../models/server-file-browser.token";

@Injectable({
  providedIn: 'root'
})
export class ServerFileBrowserService {
  storagePath: string = window.location.hostname;
  apiPath: string = '/api/admin/file-browser';

  constructor(
    private readonly accessService: SpecificHostAccessService,
    @Inject(SERVER_FILE_BROWSER_INJECTION_TOKEN) private config: ServerFileBrowserConfig
  ) {
    const calculatedStoragePathSuffix = (
      this.config &&
      this.config.storagePath
    ) || '-file-browser-path';

    this.storagePath = window.location.hostname + calculatedStoragePathSuffix;
    if (config.listFilesApiEndpoint) {
      this.apiPath = config.listFilesApiEndpoint;
    }
  }

  listFiles(path: string, interceptors: RestCallInterceptor[] = []): Observable<Directory> {
    return this.getBuilder(interceptors)
      .withPath(this.apiPath)
      .addParams('path', path)
      .GET()
      .pipe(catchError(err => {
        // todo: display application specific error prompt
        return of({path: 'FAIL', dirs: [], files: []})
      }));
  }

  getLink(filePath: string, lines: number): string {
    const encoded = encodeURIComponent(filePath);
    return `${this.accessService.getHost()}/api/admin/file-browser/file?filePath=${encoded}&lines=${lines}`;
  }

  private getBuilder(interceptors: RestCallInterceptor[]): RestCallBuilder {
    const builder = this.accessService.builder();
    interceptors.forEach(i => builder.addInterceptor(i));
    return builder;
  }
}

import { Inject, Injectable } from '@angular/core';
import { RestCallBuilder, RestCallInterceptor, SpecificHostAccessService } from "@cognizone/a2";
import { Observable, of, Subject } from "rxjs";
import { catchError } from "rxjs/operators";

import { Directory } from "../models/directory";
import { ServerFileBrowserConfig } from "../models/server-file-browser-config";
import { SERVER_FILE_BROWSER_TOKEN } from "../models/server-file-browser.token";
import { SPECIFIC_HOST_ACCESS_SERVICE_TOKEN } from "../models/specific-host-access-service.token";

@Injectable({
  providedIn: 'root'
})
export class ServerFileBrowserService {
  storagePath: string = window.location.hostname;
  apiPath: string = '/api/admin/file-browser';

  private readonly listingFailed: Subject<string> = new Subject<string>();
  // tslint:disable-next-line:member-ordering
  public readonly listingFailed$: Observable<string> = this.listingFailed.asObservable();

  constructor(
    @Inject(SPECIFIC_HOST_ACCESS_SERVICE_TOKEN) private accessService: SpecificHostAccessService,
    @Inject(SERVER_FILE_BROWSER_TOKEN) private config: ServerFileBrowserConfig
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
      .pipe(
        catchError(
          err => {
            this.listingFailed.next(path);
            return of({ path, dirs: [], files: [] })
          }
        )
      );
  }

  getLink(filePath: string, lines: number): string {
    const encoded = encodeURIComponent(filePath);
    return `${ this.accessService.getHost() }/api/admin/file-browser/file?filePath=${ encoded }&lines=${ lines }`;
  }

  private getBuilder(interceptors: RestCallInterceptor[]): RestCallBuilder {
    const builder = this.accessService.builder();
    interceptors.forEach(i => builder.addInterceptor(i));
    return builder;
  }
}

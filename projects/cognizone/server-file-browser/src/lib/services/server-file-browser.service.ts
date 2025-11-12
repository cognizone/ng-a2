import { inject, Injectable } from '@angular/core';
import { RestCallBuilder, RestCallInterceptor, SpecificHostAccessService } from '@cognizone/a2';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { CliInteraction } from '../models/cli-interaction';
import { Directory } from '../models/directory';
import { RemoteData, RemoteDataError, RemoteDataSuccess } from '../models/remote-data';
import { ServerFileBrowserConfig } from '../models/server-file-browser-config';
import { SERVER_FILE_BROWSER_TOKEN } from '../models/server-file-browser.token';
import { SPECIFIC_HOST_ACCESS_SERVICE_TOKEN } from '../models/specific-host-access-service.token';

@Injectable({
  providedIn: 'root',
})
export class ServerFileBrowserService {
  private accessService = inject<SpecificHostAccessService>(SPECIFIC_HOST_ACCESS_SERVICE_TOKEN);
  private config = inject<ServerFileBrowserConfig>(SERVER_FILE_BROWSER_TOKEN);
  storagePath: string = window.location.hostname;
  fileBrowserApiPath: string;
  commandRunningApiPath: string;
  readonly cliHistory$: Observable<CliInteraction[]>;

  private readonly _cliHistory$: BehaviorSubject<CliInteraction[]>;

  constructor() {
    this._cliHistory$ = new BehaviorSubject<CliInteraction[]>([]);
    this.cliHistory$ = this._cliHistory$.asObservable();

    const calculatedStoragePathSuffix = (this.config && this.config.storagePath) || '-file-browser-path';

    this.storagePath = window.location.hostname + calculatedStoragePathSuffix;
    this.fileBrowserApiPath = config.listFilesApiEndpoint;
    if (config.commandRunningApiEndpoint) {
      this.commandRunningApiPath = config.commandRunningApiEndpoint;
    }
  }

  listFiles(path: string, interceptors: RestCallInterceptor[] = []): Observable<RemoteData<Directory, string>> {
    return this.getBuilder(interceptors)
      .withPath(this.fileBrowserApiPath)
      .addParams('path', path)
      .GET()
      .pipe(
        map((res: Directory) => {
          return { data: res } as RemoteDataSuccess<Directory>;
        }),
        catchError(err => {
          const fallbackDirectory: Directory = {
            path,
            dirs: [],
            files: [],
          };

          const errorObject: RemoteDataError<Directory, string> = {
            error: path,
            fallbackData: fallbackDirectory,
          };

          return of(errorObject);
        })
      );
  }

  runCommand(command: string, interceptors: RestCallInterceptor[] = []): Observable<CliInteraction> {
    const body = command;

    const sentCommandCliInteraction: CliInteraction = {
      isCommand: true,
      value: command,
    };

    if (command == null || command.toString().trim().length === 0) {
      this._cliHistory$.next([...this._cliHistory$.value, sentCommandCliInteraction]);
      return of(this.getDefaultNeutralObject());
    }

    return this.getBuilder(interceptors)
      .withPath(this.commandRunningApiPath)
      .withBody(body)
      .addOption('responseType', 'text')
      .POST()
      .pipe(
        map(res => {
          return {
            isCommand: false,
            value: res,
          } as CliInteraction;
        }),
        tap(commandResponse => {
          this._cliHistory$.next([...this._cliHistory$.value, sentCommandCliInteraction, commandResponse]);
        }),
        catchError(err => {
          const errorObject: CliInteraction = this.getDefaultErrorObject();
          this._cliHistory$.next([...this._cliHistory$.value, sentCommandCliInteraction, errorObject]);

          return of(err);
        })
      );
  }

  getLink(filePath: string, lines: number): string {
    const encoded = encodeURIComponent(filePath);
    return `${this.accessService.getHost()}${this.fileBrowserApiPath}/file?filePath=${encoded}&lines=${lines}`;
  }

  private getBuilder(interceptors: RestCallInterceptor[]): RestCallBuilder {
    const builder = this.accessService.builder();
    interceptors.forEach(i => builder.addInterceptor(i));
    return builder;
  }

  private getDefaultErrorObject(): CliInteraction {
    return {
      isCommand: false,
      value: 'Something went wrong.',
    };
  }

  private getDefaultNeutralObject(): CliInteraction {
    return {
      isCommand: false,
      value: '',
    };
  }
}

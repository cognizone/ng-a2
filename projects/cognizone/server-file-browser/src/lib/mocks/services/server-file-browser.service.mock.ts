import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

import { Directory } from "../../models/directory";
import { mockDirectory } from "../data/mock-directories";

export class ServerFileBrowserServiceMock {
  listingFailed$: Observable<string> = of('path');

  getLink(filePath: string, lines: number): string {
    return `${filePath} - ${lines}`;
  }

  listFiles(path: string): Observable<Directory> {
    return of(mockDirectory).pipe(delay(500));
  }
}

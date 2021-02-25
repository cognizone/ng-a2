import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subscription } from "rxjs";
import { tap } from "rxjs/operators";

import { isCliInteraction } from "../../models/cli-interaction";
import { Directory } from "../../models/directory";
import { isRemoteDataSuccess, RemoteData } from "../../models/remote-data";
import { ServerFileBrowserService } from "../../services/server-file-browser.service";

@Component({
  selector: 'esco-server-file-browser',
  templateUrl: './server-file-browser.component.html',
  styleUrls: ['./server-file-browser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerFileBrowserComponent implements OnInit, OnDestroy {
  @Output() listingFailed: EventEmitter<string> = new EventEmitter<string>();
  @Output() commandExecutionFailed: EventEmitter<string> = new EventEmitter<string>();

  currentPath: string = undefined;
  dir: Directory;
  previousPaths: string[] = [];
  tailLines: number = 1000;
  tailEnabled: boolean = false;

  private readonly subSink: Subscription = new Subscription();

  constructor(
    public readonly fileBrowseService: ServerFileBrowserService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const startingPath = localStorage.getItem(this.fileBrowseService.storagePath) || '/';
    this.addToPreviousPaths(startingPath);
    this.get(startingPath);
  }

  get(path: string): void {
    this.currentPath = path;
    localStorage.setItem(this.fileBrowseService.storagePath, path);

    const listFilesSub = this.fileBrowseService.listFiles(path)
      .subscribe((res: RemoteData<Directory, string>) => this.handleListFilesResponse(res));

    this.subSink.add(listFilesSub);
  }

  expand(dir: string): void {
    const pre = this.currentPath.endsWith('/') ? '' : '/';
    const path = `${ this.currentPath }${ pre }${ dir }/`;
    this.addToPreviousPaths(path);
    this.get(path);
  }

  back(): void {
    this.currentPath = this.previousPaths.pop();

    const listFilesSub = this.fileBrowseService.listFiles(this.currentPath)
      .subscribe(res => this.handleListFilesResponse(res));

    this.subSink.add(listFilesSub);
  }

  getLink(file: string): string {
    const slash = this.currentPath.endsWith('/') ? '' : '/';
    const path = this.currentPath + slash + file;
    const lines = this.tailEnabled ? this.tailLines : -1;

    return this.fileBrowseService.getLink(path, lines);
  }

  submitCommand(command: string): void {
    const cmdSub = this.fileBrowseService.runCommand(command)
      .pipe(
        tap(res => {
          if (!isCliInteraction(res)) this.commandExecutionFailed.emit(res);
        })
      )
      .subscribe();

    this.subSink.add(cmdSub);
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private handleListFilesResponse(res: RemoteData<Directory, string>): void {
    if (isRemoteDataSuccess(res)) {
      const { data } = res;
      this.dir = data;
    }
    else {
      const { error, fallbackData } = res;
      this.dir = fallbackData;
      this.listingFailed.emit(error);
    }

    this.cdr.markForCheck();
  }

  private addToPreviousPaths(path: string): void {
    const prev = this.currentPath;
    if (!!prev && path.startsWith(prev)) {
      this.previousPaths = [...this.previousPaths, this.currentPath];
    }
    else {
      this.previousPaths = [];
    }

    this.cdr.markForCheck();
  }
}

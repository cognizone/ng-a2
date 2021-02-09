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

import { Directory } from "../../models/directory";
import { ServerFileBrowserService } from "../../services/server-file-browser.service";

@Component({
  selector: 'esco-server-file-browser',
  templateUrl: './server-file-browser.component.html',
  styleUrls: ['./server-file-browser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerFileBrowserComponent implements OnInit, OnDestroy {
  @Output() failed: EventEmitter<string> = new EventEmitter<string>();

  currentPath: string = undefined;
  dir: Directory;
  previousPaths: string[] = [];
  tailLines: number = 1000;
  tailEnabled: boolean = false;

  private readonly subSink: Subscription = new Subscription();

  constructor(
    private readonly fileBrowseService: ServerFileBrowserService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const listingFailedSub = this.fileBrowseService.listingFailed$
      .pipe(
        tap((failedPath: string) => this.failed.emit(failedPath))
      )
      .subscribe();

    this.subSink.add(listingFailedSub);

    const startingPath = localStorage.getItem(this.fileBrowseService.storagePath) || '/';
    this.addToPreviousPaths(startingPath);
    this.get(startingPath);
  }

  get(path: string): void {
    this.currentPath = path;
    localStorage.setItem(this.fileBrowseService.storagePath, path);

    const listFilesSub = this.fileBrowseService.listFiles(path)
      .subscribe(res => {
        this.dir = res;
        this.cdr.markForCheck();
      });

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
      .subscribe(res => {
        this.dir = res;
        this.cdr.markForCheck();
      });

    this.subSink.add(listFilesSub);
  }

  getLink(file: string): string {
    const slash = this.currentPath.endsWith('/') ? '' : '/';
    const path = this.currentPath + slash + file;
    const lines = this.tailEnabled ? this.tailLines : -1;

    return this.fileBrowseService.getLink(path, lines);
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
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

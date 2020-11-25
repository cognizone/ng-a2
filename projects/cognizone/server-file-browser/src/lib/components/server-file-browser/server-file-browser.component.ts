import { Component, OnInit } from '@angular/core';

import { Directory } from "../../models/directory";
import { ServerFileBrowserService } from "../../services/server-file-browser.service";

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'esco-server-file-browser',
	templateUrl: './server-file-browser.component.html',
	styleUrls: ['./server-file-browser.component.scss']
})
export class ServerFileBrowserComponent implements OnInit {
	currentPath: string = undefined;
	dir: Directory;
	previousPaths: string[] = [];
	tailLines: number = 1000;
	tailEnabled: boolean = false;

	constructor(private readonly fileBrowseService: ServerFileBrowserService) {}

	ngOnInit(): void {
		this.get(localStorage.getItem(this.fileBrowseService.storagePath) || '/');
	}

	get(path: string): void {
		const prev = this.currentPath;
		if (!!prev && path.startsWith(prev)) {
			this.previousPaths.push(this.currentPath);
		}
		else {
			this.previousPaths = []
		}

		this.currentPath = path;
		localStorage.setItem(this.fileBrowseService.storagePath, path);

		// todo: use OnDestroy$ mixin
		this.fileBrowseService.listFiles(path)
				.subscribe(res => this.dir = res);
	}

	expand(dir: string): void {
		const pre = this.currentPath.endsWith('/') ? '' : '/';
		this.get(`${ this.currentPath }${ pre }${ dir }/`);
	}

	back(): void {
		this.currentPath = this.previousPaths.pop();

		// todo: use OnDestroy$ mixin
		this.fileBrowseService.listFiles(this.currentPath)
				.subscribe(res => this.dir = res);
	}

	getLink(file: string): string {
		const slash = this.currentPath.endsWith('/') ? '' : '/';
		const path = this.currentPath + slash + file;
		const lines = this.tailEnabled ? this.tailLines : -1;

		return this.fileBrowseService.getLink(path, lines);
	}
}

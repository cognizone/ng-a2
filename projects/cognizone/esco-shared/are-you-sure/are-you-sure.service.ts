import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { AreYouSureComponent } from './are-you-sure.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreYouSureService {

  constructor(private readonly dialog: MatDialog) {}

  ask(text = 'Please confirm this action: ', execute = 'Execute', cancel = 'Cancel'): Observable<boolean> {
    return this.dialog
      .open(AreYouSureComponent, { data: { text: text, cancel: cancel, execute: execute } })
      .afterClosed()
      .pipe(first());
  }
}

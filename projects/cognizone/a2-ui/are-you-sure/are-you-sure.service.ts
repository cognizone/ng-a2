import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';
import { AreYouSureComponent } from './are-you-sure.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AreYouSureService {
  constructor(private readonly dialog: MatDialog) {}

  ask(text = 'Please confirm this action: ', execute = 'Execute', cancel = 'Cancel'): Observable<boolean> {
    return this.dialog.open(AreYouSureComponent, { data: { text, cancel, execute } }).afterClosed().pipe(first());
  }

  confirmDecision(
    header = 'Are you sure you want to continue?',
    text?: string,
    execute = 'Confirm',
    cancel = 'Cancel'
  ): Observable<boolean> {
    return this.dialog
      .open(AreYouSureComponent, {
        data: {
          header,
          text,
          execute,
          cancel,
        },
      })
      .afterClosed()
      .pipe(first());
  }
}

import { Injectable } from '@angular/core';
import { ALERTS } from '../models/alerts';
import { AlertSnackComponent } from '../components/alert-snack/alert-snack.component';
import { ObservedValueOf, of, OperatorFunction } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

@Injectable()
export class GlobalAlertService {
  isCurrentlyOpen = false;
  isCurrentlyDominating = false;

  constructor(private readonly snackBar: MatSnackBar) {}

  error(message: string, dominating = false, dismissible = true) {
    this.openSnackBar(
      message,
      ['alert-danger-color'],
      dominating,
      dismissible,
      dismissible ? -1 : 1800
    );
  }

  warn(message: string, dominating = false) {
    this.openSnackBar(message, ['alert-warning-color'], dominating, false, 2000);
  }

  info(message: string, dominating = false) {
    this.openSnackBar(message, ['alert-info-color'], dominating, false, -1);
  }

  success(message: string, dominating = false, mustDismiss = false) {
    this.openSnackBar(
      message,
      ['alert-success-color'],
      dominating,
      mustDismiss,
      mustDismiss ? -1 : 1800
    );
  }

  debug(message: string, dominating = false) {
    this.openSnackBar(message, ['alert-debug-color'], dominating);
  }

  openSnackBar(
    message: string,
    panelClass: string[],
    dominating = false,
    dismissible = true,
    duration = -1
  ) {
    if (this.isCurrentlyOpen && this.isCurrentlyDominating && !dominating) {
      return;
    }

    this.isCurrentlyOpen = true;
    this.isCurrentlyDominating = dominating;

    this.snackBar.openFromComponent(AlertSnackComponent, {
      data: { message: message, dismissible: dismissible },
      panelClass: panelClass,
      duration: duration
    })
    .afterDismissed()
    .subscribe(() => {
      this.isCurrentlyOpen = false;
      this.isCurrentlyDominating = false;
    });
  }

  handleError(err: any, message?: string, includeDetails = true) {
    const simple = `${message ? message : ALERTS.fail_general}`;

    const detailed = simple + `${this.getDetailedError(err)}`;

    this.error(includeDetails ? detailed : simple + this.getStatus(err));
  }

  catchError<O>(defaultValue: O, message?: string, includeDetails = true): OperatorFunction<any, ObservedValueOf<O>> {
    return catchError(err => {
      this.handleError(err);
      return of(defaultValue, message, includeDetails);
    });
  }

  private getDetailedError(err: any): string {
    if (!err) {
      return ': Unknown error';
    } else if (err instanceof Error) {
      return `: Javascript error (${err.message})`;
    } else if (err.error instanceof Error) {
      return `: Javascript error (${err.error.message})`;
    }

    switch (err.status) {
      case 0:
        return ` (${ALERTS.no_response_status})`;
      case undefined:
        return ` (${ALERTS.no_response_status_unknown})`;
      case 401:
        return `: ${ALERTS.not_authenticated} (${err.status})`;
      case 403:
        return `: ${ALERTS.not_authorized} (${err.status})`;
    }

    const backendMessage = this.getBackendMessage(err);
    return `: ${backendMessage} (${err.status})`;
  }

  private getStatus(err: any): string {
    if (err.status === 0) {
      return ` (${ALERTS.no_response_status})`;
    }
    return err.status ? ` (${err.status})` : '';
  }

  /* this depends on the backend */
  private getBackendMessage(err: any): string {

    if (err.error && err.error.message) {
      return err.error.message;
    } else if (err.error) {
      return err.error;
    }
    return 'No message';
  }
}

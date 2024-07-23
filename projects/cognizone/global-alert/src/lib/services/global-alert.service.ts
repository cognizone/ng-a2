import { Injectable } from '@angular/core';
import { CommonAlerts } from '../models/common-alerts';
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
    this.openSnackBar(message, ['alert-danger-color'], dominating, dismissible, dismissible ? -1 : 1800);
  }

  warn(message: string, dominating = false) {
    this.openSnackBar(message, ['alert-warning-color'], dominating, false, 2000);
  }

  info(message: string, dominating = false) {
    this.openSnackBar(message, ['alert-info-color'], dominating, false, -1);
  }

  success(message: string, dominating = false, mustDismiss = false) {
    this.openSnackBar(message, ['alert-success-color'], dominating, mustDismiss, mustDismiss ? -1 : 1800);
  }

  debug(message: string, dominating = false) {
    this.openSnackBar(message, ['alert-debug-color'], dominating);
  }

  openSnackBar(message: string, panelClass: string[], dominating = false, dismissible = true, duration = -1) {
    if (this.isCurrentlyOpen && this.isCurrentlyDominating && !dominating) {
      return;
    }

    this.isCurrentlyOpen = true;
    this.isCurrentlyDominating = dominating;

    this.snackBar
      .openFromComponent(AlertSnackComponent, {
        data: { message: message, dismissible: dismissible },
        panelClass: panelClass,
        duration: duration,
      })
      .afterDismissed()
      .subscribe(() => {
        this.isCurrentlyOpen = false;
        this.isCurrentlyDominating = false;
      });
  }

  handleError(err: unknown, message?: string, includeDetails = true) {
    const simple = `${message ? message : CommonAlerts.fail_general}`;

    const detailed = simple + `${this.getDetailedError(err)}`;

    this.error(includeDetails ? detailed : simple + this.getStatus(err));
  }

  catchError<O>(defaultValue: O, message?: string, includeDetails = true): OperatorFunction<any, ObservedValueOf<O>> {
    return catchError(err => {
      this.handleError(err);
      return of(defaultValue, message, includeDetails);
    });
  }

  private getDetailedError(err: unknown): string {
    if (!err) {
      return ': Unknown error';
    } else if (err instanceof Error) {
      return `: Javascript error (${err.message})`;
    } else if (isErrorWrapper(err)) {
      return `: Javascript error (${err.error.message})`;
    }

    const status = hasStatus(err) ? err.status : undefined;

    switch (status) {
      case 0:
        return ` (${CommonAlerts.no_response})`;
      case undefined:
        return ` (${CommonAlerts.no_response_status_unknown})`;
      case 401:
        return `: ${CommonAlerts.not_authenticated} (${status})`;
      case 403:
        return `: ${CommonAlerts.not_authorized} (${status})`;
    }

    const backendMessage = this.getBackendMessage(err);
    return `: ${backendMessage} (${status})`;
  }

  private getStatus(err: unknown): string {
    const status = hasStatus(err) ? err.status : undefined;
    if (status === 0) {
      return ` (${CommonAlerts.no_response})`;
    }
    return status ? ` (${status})` : '';
  }

  private getBackendMessage(err: unknown): string {
    if (hasError(err) && hasErrorMessage(err.error)) {
      return err.error.message;
    } else if (hasError(err)) {
      return err.error as string;
    }
    return 'No message';
  }
}

function isErrorWrapper(err: unknown): err is { error: Error } {
  return typeof err === 'object' && err != null && 'error' in err && (err as { error: unknown }).error instanceof Error;
}

function hasError(err: unknown): err is { error: unknown } {
  return typeof err === 'object' && err != null && 'error' in err;
}

function hasErrorMessage(err: unknown): err is { message: string } {
  return typeof err === 'object' && err != null && 'message' in err;
}

function hasStatus(err: unknown): err is { status: unknown } {
  return typeof err === 'object' && err != null && 'status' in err;
}

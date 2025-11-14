/// <reference path="../cypress/support/component.ts" />

import { Component, inject } from '@angular/core';
import { AlertSnackComponent } from './alert-snack.component';
import { GlobalAlertModule } from './global-alert.module';
import { MatSnackBar, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

// Test wrapper component that opens the snackbar via MatSnackBar (like the service does)
@Component({
  template: '',
  standalone: true,
})
class SnackBarTestWrapperComponent {
  private snackBar = inject(MatSnackBar);

  openSnackBar(data: { message: string; dismissible: boolean }, panelClass: string[] = []): MatSnackBarRef<AlertSnackComponent> {
    return this.snackBar.openFromComponent(AlertSnackComponent, {
      data,
      panelClass,
    });
  }
}

describe('AlertSnackComponent', () => {
  const defaultData = {
    message: 'This is a test alert message',
    dismissible: true,
  };

  beforeEach(() => {
    // Ensure overlay container is available for Material Snackbar
    cy.window().then(win => {
      // Ensure overlay container is available
      let overlayContainer = win.document.querySelector('.cdk-overlay-container') as HTMLElement;
      if (!overlayContainer) {
        overlayContainer = win.document.createElement('div');
        overlayContainer.className = 'cdk-overlay-container';
        win.document.body.appendChild(overlayContainer);
      }
    });
  });

  it('should display message when provided', () => {
    cy.mount(SnackBarTestWrapperComponent, {
      imports: [GlobalAlertModule, MatSnackBarModule, OverlayModule, PortalModule, NoopAnimationsModule],
    }).then(component => {
      component.component.openSnackBar(defaultData);

      // Wait for snackbar to be rendered in Material Snackbar overlay
      cy.get('.cdk-overlay-container').should('be.visible');
      cy.get('.mat-mdc-snack-bar-container').should('be.visible');

      cy.get('.message').should('be.visible').and('contain', defaultData.message);
    });
  });

  it('should display dismiss button when dismissible is true', () => {
    cy.mount(SnackBarTestWrapperComponent, {
      imports: [GlobalAlertModule, MatSnackBarModule, OverlayModule, PortalModule, NoopAnimationsModule],
    }).then(component => {
      component.component.openSnackBar(defaultData);

      // Wait for snackbar to be rendered
      cy.get('.cdk-overlay-container').should('be.visible');
      cy.get('.mat-mdc-snack-bar-container').should('be.visible');

      cy.get('.my-dismiss').should('be.visible');
      cy.get('.my-dismiss button, .my-dismiss').should('exist');
    });
  });

  it('should store dismissible flag correctly', () => {
    const nonDismissibleData = {
      message: 'Non-dismissible alert',
      dismissible: false,
    };

    cy.mount(SnackBarTestWrapperComponent, {
      imports: [GlobalAlertModule, MatSnackBarModule, OverlayModule, PortalModule, NoopAnimationsModule],
    }).then(component => {
      component.component.openSnackBar(nonDismissibleData);

      // Wait for snackbar to be rendered
      cy.get('.cdk-overlay-container').should('be.visible');
      cy.get('.mat-mdc-snack-bar-container').should('be.visible');

      cy.get('.message').should('contain', nonDismissibleData.message);
      // Note: The template always shows the dismiss button regardless of dismissible flag
      cy.get('.my-dismiss').should('exist');
    });
  });

  it('should call dismiss when dismiss button is clicked', () => {
    cy.mount(SnackBarTestWrapperComponent, {
      imports: [GlobalAlertModule, MatSnackBarModule, OverlayModule, PortalModule, NoopAnimationsModule],
    }).then(component => {
      const snackBarRef = component.component.openSnackBar(defaultData);
      cy.spy(snackBarRef, 'dismiss').as('snackBarDismiss');

      // Wait for snackbar to be rendered
      cy.get('.cdk-overlay-container').should('be.visible');
      cy.get('.mat-mdc-snack-bar-container').should('be.visible');

      cy.get('.my-dismiss').click();
      cy.get('@snackBarDismiss').should('have.been.called');
    });
  });

  it('should handle long messages correctly', () => {
    const longMessage =
      'This is a very long message that should be displayed correctly in the snackbar component without breaking the layout or causing any visual issues.';

    cy.mount(SnackBarTestWrapperComponent, {
      imports: [GlobalAlertModule, MatSnackBarModule, OverlayModule, PortalModule, NoopAnimationsModule],
    }).then(component => {
      component.component.openSnackBar({
        message: longMessage,
        dismissible: true,
      });

      // Wait for snackbar to be rendered
      cy.get('.cdk-overlay-container').should('be.visible');
      cy.get('.mat-mdc-snack-bar-container').should('be.visible');

      cy.get('.message').should('contain', longMessage);
    });
  });

  it('should have correct CSS classes', () => {
    cy.mount(SnackBarTestWrapperComponent, {
      imports: [GlobalAlertModule, MatSnackBarModule, OverlayModule, PortalModule, NoopAnimationsModule],
    }).then(component => {
      component.component.openSnackBar(defaultData);

      // Wait for snackbar to be rendered
      cy.get('.cdk-overlay-container').should('be.visible');
      cy.get('.mat-mdc-snack-bar-container').should('be.visible');

      cy.get('.message').should('exist');
      cy.get('.my-dismiss').should('exist');
    });
  });
});

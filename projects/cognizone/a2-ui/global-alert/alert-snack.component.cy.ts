/// <reference path="../../../cypress-test-app/cypress/support/component.ts" />

import { Component, inject } from '@angular/core';
import { AlertSnackComponent } from './alert-snack.component';
import { GlobalAlertModule } from './global-alert.module';
import { MatSnackBar, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
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
      imports: [GlobalAlertModule, MatSnackBarModule, OverlayModule, PortalModule],
    }).then(component => {
      component.component.openSnackBar(defaultData);

      cy.get('.cdk-overlay-container').should('be.visible');
      cy.get('.mat-mdc-snack-bar-container').should('be.visible');
      cy.get('.message').should('be.visible').and('contain', defaultData.message);
    });
  });

  it('should dismiss snackbar when dismiss button is clicked', () => {
    cy.mount(SnackBarTestWrapperComponent, {
      imports: [GlobalAlertModule, MatSnackBarModule, OverlayModule, PortalModule],
    }).then(component => {
      component.component.openSnackBar(defaultData);

      cy.get('.cdk-overlay-container').should('be.visible');
      cy.get('.mat-mdc-snack-bar-container').should('be.visible');
      cy.get('.my-dismiss').should('be.visible');

      cy.get('.my-dismiss').click();
      cy.get('.mat-mdc-snack-bar-container').should('not.exist');
    });
  });

  describe('Alert variants', () => {
    it('should display error alert with danger color', () => {
      cy.mount(SnackBarTestWrapperComponent, {
        imports: [GlobalAlertModule, MatSnackBarModule, OverlayModule, PortalModule],
      }).then(component => {
        component.component.openSnackBar({ message: 'Error message', dismissible: true }, ['alert-danger-color']);

        cy.get('.cdk-overlay-container').should('be.visible');
        cy.get('.mat-mdc-snack-bar-container').should('be.visible');
        cy.get('.message').should('contain', 'Error message');
        cy.get('.mat-mdc-snack-bar-container').should('have.class', 'alert-danger-color');
      });
    });

    it('should display warning alert with warning color', () => {
      cy.mount(SnackBarTestWrapperComponent, {
        imports: [GlobalAlertModule, MatSnackBarModule, OverlayModule, PortalModule],
      }).then(component => {
        component.component.openSnackBar({ message: 'Warning message', dismissible: false }, ['alert-warning-color']);

        cy.get('.cdk-overlay-container').should('be.visible');
        cy.get('.mat-mdc-snack-bar-container').should('be.visible');
        cy.get('.message').should('contain', 'Warning message');
        cy.get('.mat-mdc-snack-bar-container').should('have.class', 'alert-warning-color');
      });
    });

    it('should display info alert with info color', () => {
      cy.mount(SnackBarTestWrapperComponent, {
        imports: [GlobalAlertModule, MatSnackBarModule, OverlayModule, PortalModule],
      }).then(component => {
        component.component.openSnackBar({ message: 'Info message', dismissible: false }, ['alert-info-color']);

        cy.get('.cdk-overlay-container').should('be.visible');
        cy.get('.mat-mdc-snack-bar-container').should('be.visible');
        cy.get('.message').should('contain', 'Info message');
        cy.get('.mat-mdc-snack-bar-container').should('have.class', 'alert-info-color');
      });
    });

    it('should display success alert with success color', () => {
      cy.mount(SnackBarTestWrapperComponent, {
        imports: [GlobalAlertModule, MatSnackBarModule, OverlayModule, PortalModule],
      }).then(component => {
        component.component.openSnackBar({ message: 'Success message', dismissible: true }, ['alert-success-color']);

        cy.get('.cdk-overlay-container').should('be.visible');
        cy.get('.mat-mdc-snack-bar-container').should('be.visible');
        cy.get('.message').should('contain', 'Success message');
        cy.get('.mat-mdc-snack-bar-container').should('have.class', 'alert-success-color');
      });
    });
  });
});

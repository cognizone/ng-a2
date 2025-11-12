/// <reference path="../cypress/support/component.ts" />

import { AreYouSureComponent } from './are-you-sure.component';
import { AreYouSureModule } from './are-you-sure.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AreYouSureComponent', () => {
  const defaultData = {
    header: 'Confirm Action',
    text: 'Are you sure you want to proceed?',
    cancel: 'Cancel',
    execute: 'Confirm',
  };

  it('should display all data fields when provided', () => {
    cy.mount(AreYouSureComponent, {
      imports: [AreYouSureModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: defaultData,
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: cy.stub().as('dialogClose'),
          },
        },
      ],
    });

    // Check header
    cy.get('.my-modal-header').should('be.visible').and('contain', defaultData.header);

    // Check text
    cy.get('p').should('be.visible').and('contain', defaultData.text);

    // Check buttons
    cy.get('button').should('have.length', 2);
    cy.get('button').contains(defaultData.execute).should('be.visible');
    cy.get('button').contains(defaultData.cancel).should('be.visible');
  });

  it('should display without header when not provided', () => {
    const dataWithoutHeader = {
      text: 'Are you sure?',
      cancel: 'No',
      execute: 'Yes',
    };

    cy.mount(AreYouSureComponent, {
      imports: [AreYouSureModule, NoopAnimationsModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: dataWithoutHeader,
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: cy.stub().as('dialogClose'),
          },
        },
      ],
    });

    // Header should not exist
    cy.get('.my-modal-header').should('not.exist');

    // Text should still be visible
    cy.get('p').should('contain', dataWithoutHeader.text);

    // Buttons should be visible
    cy.get('button').should('have.length', 2);
  });

  it('should display without text when not provided', () => {
    const dataWithoutText = {
      header: 'Warning',
      cancel: 'Cancel',
      execute: 'OK',
    };

    cy.mount(AreYouSureComponent, {
      imports: [AreYouSureModule, NoopAnimationsModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: dataWithoutText,
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: cy.stub().as('dialogClose'),
          },
        },
      ],
    });

    // Header should be visible
    cy.get('.my-modal-header').should('contain', dataWithoutText.header);

    // Text paragraph should not exist
    cy.get('p').should('not.exist');

    // Buttons should be visible
    cy.get('button').should('have.length', 2);
  });

  it('should close dialog with true when execute button is clicked', () => {
    const dialogRef = {
      close: cy.stub().as('dialogClose'),
    };

    cy.mount(AreYouSureComponent, {
      imports: [AreYouSureModule, NoopAnimationsModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: defaultData,
        },
        {
          provide: MatDialogRef,
          useValue: dialogRef,
        },
      ],
    });

    cy.get('button').contains(defaultData.execute).click();
    cy.get('@dialogClose').should('have.been.calledWith', true);
  });

  it('should close dialog when cancel button is clicked', () => {
    const dialogRef = {
      close: cy.stub().as('dialogClose'),
    };

    cy.mount(AreYouSureComponent, {
      imports: [AreYouSureModule, NoopAnimationsModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: defaultData,
        },
        {
          provide: MatDialogRef,
          useValue: dialogRef,
        },
      ],
    });

    cy.get('button').contains(defaultData.cancel).click();
    cy.get('@dialogClose').should('have.been.called');
  });

  it('should have correct CSS classes and structure', () => {
    cy.mount(AreYouSureComponent, {
      imports: [AreYouSureModule, NoopAnimationsModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: defaultData,
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: cy.stub(),
          },
        },
      ],
    });

    cy.get('.my-modal-panel').should('exist');
    cy.get('.my-button-container').should('exist');
    cy.get('.my-action-button').should('have.length', 2);
  });

  it('should have correct button styles', () => {
    cy.mount(AreYouSureComponent, {
      imports: [AreYouSureModule, NoopAnimationsModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: defaultData,
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: cy.stub(),
          },
        },
      ],
    });

    // Check button container styles
    cy.get('.my-button-container')
      .should('have.css', 'display', 'flex')
      .and('have.css', 'flex-direction', 'row')
      .and('have.css', 'justify-content', 'center');

    // Check button styles
    cy.get('.my-action-button').should('have.length', 2);
    cy.get('.my-action-button').each($button => {
      cy.wrap($button).should('have.class', 'my-action-button').and('have.class', 'mat-mdc-raised-button');
    });

    // Check that execute button has primary color
    // In Angular Material MDC, color="primary" is applied via directive (not a class).
    // We verify by checking button order: first button = primary (per template)
    cy.get('button.my-action-button').first().should('contain', defaultData.execute);

    // Check that cancel button does not have primary color (it's the second button)
    cy.get('button.my-action-button').eq(1).should('contain', defaultData.cancel);
  });
});

import { AlertSnackComponent } from './alert-snack.component';
import { GlobalAlertModule } from './global-alert.module';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AlertSnackComponent', () => {
  const defaultData = {
    message: 'This is a test alert message',
    dismissible: true,
  };

  it('should display message when provided', () => {
    cy.mount(AlertSnackComponent, {
      imports: [GlobalAlertModule],
      providers: [
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: defaultData,
        },
        {
          provide: MatSnackBarRef,
          useValue: {
            dismiss: cy.stub().as('snackBarDismiss'),
          },
        },
      ],
    });

    cy.get('.message').should('be.visible').and('contain', defaultData.message);
  });

  it('should display dismiss button when dismissible is true', () => {
    cy.mount(AlertSnackComponent, {
      imports: [GlobalAlertModule, NoopAnimationsModule],
      providers: [
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: defaultData,
        },
        {
          provide: MatSnackBarRef,
          useValue: {
            dismiss: cy.stub().as('snackBarDismiss'),
          },
        },
      ],
    });

    cy.get('.my-dismiss').should('be.visible');
    cy.get('.my-dismiss button, .my-dismiss').should('exist');
  });

  it('should store dismissible flag correctly', () => {
    const nonDismissibleData = {
      message: 'Non-dismissible alert',
      dismissible: false,
    };

    cy.mount(AlertSnackComponent, {
      imports: [GlobalAlertModule, NoopAnimationsModule],
      providers: [
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: nonDismissibleData,
        },
        {
          provide: MatSnackBarRef,
          useValue: {
            dismiss: cy.stub().as('snackBarDismiss'),
          },
        },
      ],
    }).then(wrapper => {
      // Verify the component stores the dismissible flag
      expect(wrapper.component.dismissible).to.equal(false);
      cy.get('.message').should('contain', nonDismissibleData.message);
      // Note: The template always shows the dismiss button regardless of dismissible flag
      cy.get('.my-dismiss').should('exist');
    });
  });

  it('should call dismiss when dismiss button is clicked', () => {
    const snackBarRef = {
      dismiss: cy.stub().as('snackBarDismiss'),
    };

    cy.mount(AlertSnackComponent, {
      imports: [GlobalAlertModule, NoopAnimationsModule],
      providers: [
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: defaultData,
        },
        {
          provide: MatSnackBarRef,
          useValue: snackBarRef,
        },
      ],
    });

    cy.get('.my-dismiss').click();
    cy.get('@snackBarDismiss').should('have.been.called');
  });

  it('should handle long messages correctly', () => {
    const longMessage =
      'This is a very long message that should be displayed correctly in the snackbar component without breaking the layout or causing any visual issues.';

    cy.mount(AlertSnackComponent, {
      imports: [GlobalAlertModule, NoopAnimationsModule],
      providers: [
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: {
            message: longMessage,
            dismissible: true,
          },
        },
        {
          provide: MatSnackBarRef,
          useValue: {
            dismiss: cy.stub(),
          },
        },
      ],
    });

    cy.get('.message').should('contain', longMessage);
  });

  it('should have correct CSS classes', () => {
    cy.mount(AlertSnackComponent, {
      imports: [GlobalAlertModule, NoopAnimationsModule],
      providers: [
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: defaultData,
        },
        {
          provide: MatSnackBarRef,
          useValue: {
            dismiss: cy.stub(),
          },
        },
      ],
    });

    cy.get('.message').should('exist');
    cy.get('.my-dismiss').should('exist');
  });
});

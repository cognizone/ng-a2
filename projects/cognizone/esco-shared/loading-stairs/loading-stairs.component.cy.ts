import { LoadingStairsComponent } from './loading-stairs.component';
import { LoadingStairsModule } from './loading-stairs.module';

describe('LoadingStairsComponent', () => {
  it('should display loading animation without message', () => {
    cy.mount(LoadingStairsComponent, {
      imports: [LoadingStairsModule],
    });

    // Check that loader elements are present
    cy.get('.loader-wrapper').should('be.visible');
    cy.get('.loader').should('be.visible');
    cy.get('.loader__bar').should('have.length', 5);
    cy.get('.loader__ball').should('be.visible');

    // Check that message is not displayed when not provided
    cy.get('.loader-label').should('not.exist');
  });

  it('should display message when provided', () => {
    const testMessage = 'Loading data...';

    cy.mount(LoadingStairsComponent, {
      imports: [LoadingStairsModule],
      componentProperties: {
        message: testMessage,
      },
    });

    // Check that message is displayed
    cy.get('.loader-label').should('be.visible').and('contain', testMessage);

    // Check that loader is still present
    cy.get('.loader').should('be.visible');
  });

  it('should update message dynamically', () => {
    cy.mount(LoadingStairsComponent, {
      imports: [LoadingStairsModule],
      componentProperties: {
        message: 'Initial message',
      },
    }).then(wrapper => {
      cy.get('.loader-label').should('contain', 'Initial message');

      // Update the message
      wrapper.component.setInput('message', 'Updated message');
      cy.get('.loader-label').should('contain', 'Updated message');
    });
  });

  it('should have correct CSS classes for styling', () => {
    cy.mount(LoadingStairsComponent, {
      imports: [LoadingStairsModule],
      componentProperties: {
        message: 'Test message',
      },
    });

    // Verify structure
    cy.get('.loader-wrapper').should('exist');
    cy.get('.loader').should('exist');
    cy.get('.loader__bar').should('have.length', 5);
    cy.get('.loader__ball').should('exist');
    cy.get('.loader-label').should('exist');
  });
});

/// <reference path="../../../cypress-test-app/cypress/support/component.ts" />

import { LoadingStairsComponent } from './loading-stairs.component';
import { LoadingStairsModule } from './loading-stairs.module';

describe('LoadingStairsComponent', () => {
  it('should display loading animation without message', () => {
    cy.mount<LoadingStairsComponent>(LoadingStairsComponent, {
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
    });
    cy.get('.loader-label').should('contain', 'Initial message');

    // Update the message by remounting with new properties
    cy.mount(LoadingStairsComponent, {
      imports: [LoadingStairsModule],
      componentProperties: {
        message: 'Updated message',
      },
    });
    cy.get('.loader-label').should('contain', 'Updated message');
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

  it('should have correct layout and centering', () => {
    cy.mount(LoadingStairsComponent, {
      imports: [LoadingStairsModule],
      componentProperties: {
        message: 'Loading...',
      },
    });

    // Verify flexbox layout
    cy.get('.loader-wrapper')
      .should('have.css', 'display', 'flex')
      .and('have.css', 'flex-direction', 'column')
      .and('have.css', 'align-items', 'center')
      .and('have.css', 'justify-content', 'center');
  });

  it('should have correct loader dimensions', () => {
    cy.mount(LoadingStairsComponent, {
      imports: [LoadingStairsModule],
    });

    // Verify loader dimensions
    cy.get('.loader').should('have.css', 'width', '75px').and('have.css', 'height', '100px');
  });

  it('should have correct colors for message and loader elements', () => {
    cy.mount(LoadingStairsComponent, {
      imports: [LoadingStairsModule],
      componentProperties: {
        message: 'Loading data...',
      },
    });

    // Verify message color (#048cc8)
    cy.get('.loader-label').then($label => {
      const color = window.getComputedStyle($label[0]).color;
      expect(color).to.include('rgb(4, 140, 200)');
    });

    // Verify bar color (#0492d0)
    cy.get('.loader__bar')
      .first()
      .then($bar => {
        const bgColor = window.getComputedStyle($bar[0]).backgroundColor;
        expect(bgColor).to.include('rgb(4, 146, 208)');
      });

    // Verify ball color (#0492d0)
    cy.get('.loader__ball').then($ball => {
      const bgColor = window.getComputedStyle($ball[0]).backgroundColor;
      expect(bgColor).to.include('rgb(4, 146, 208)');
    });
  });
});

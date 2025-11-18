/// <reference path="../../../../../cypress-test-app/cypress/support/component.ts" />

import { DefaultLimitIncreaseComponent } from './default-node-template.component';
import { A2TreeBrowserModule } from '../a2-tree-browser.module';

/**
 * Note: DefaultNodeTemplateComponent is tested indirectly through TreeBrowserComponent tests
 * since it's used internally. These tests focus on the simpler, isolated DefaultLimitIncreaseComponent.
 */

describe('DefaultLimitIncreaseComponent', () => {
  it('should render "See more" button', () => {
    const clickAction = cy.stub().as('clickAction');

    cy.mount(DefaultLimitIncreaseComponent, {
      imports: [A2TreeBrowserModule],
      componentProperties: {
        clickAction,
      },
    });

    cy.contains('See more').should('be.visible');
  });

  it('should call clickAction when button is clicked', () => {
    const clickAction = cy.stub().as('clickAction');

    cy.mount(DefaultLimitIncreaseComponent, {
      imports: [A2TreeBrowserModule],
      componentProperties: {
        clickAction,
      },
    });

    cy.contains('See more').click();
    cy.get('@clickAction').should('have.been.calledOnce');
  });

  it('should be clickable multiple times', () => {
    const clickAction = cy.stub().as('clickAction');

    cy.mount(DefaultLimitIncreaseComponent, {
      imports: [A2TreeBrowserModule],
      componentProperties: {
        clickAction,
      },
    });

    cy.contains('See more').click();
    cy.contains('See more').click();
    cy.contains('See more').click();
    cy.get('@clickAction').should('have.callCount', 3);
  });
});

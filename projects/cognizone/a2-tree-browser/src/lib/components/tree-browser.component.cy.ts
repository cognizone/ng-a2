/// <reference path="../../../../../cypress-test-app/cypress/support/component.ts" />

import { TreeBrowserComponent } from './tree-browser.component';
import { A2TreeBrowserModule } from '../a2-tree-browser.module';
import { TreeModel } from '../model/tree-model';

// Simple mock tree structure for testing
interface SimpleNode {
  id: string;
  children?: SimpleNode[];
}

class MockTreeModel implements TreeModel<SimpleNode> {
  constructor(private root: SimpleNode) {}

  getRoot(): SimpleNode {
    return this.root;
  }

  getChildren(parent: SimpleNode): SimpleNode[] {
    return parent.children || [];
  }
}

describe('TreeBrowserComponent', () => {
  describe('Tree Rendering', () => {
    it('should render a simple tree with root only', () => {
      const mockData: SimpleNode = { id: 'root' };
      const treeModel = new MockTreeModel(mockData);

      cy.mount(TreeBrowserComponent, {
        imports: [A2TreeBrowserModule],
        componentProperties: {
          treeModel,
        },
      });

      cy.contains('Root').should('be.visible');
    });

    it('should render root with children', () => {
      const mockData: SimpleNode = {
        id: 'root',
        children: [{ id: 'child1' }, { id: 'child2' }, { id: 'child3' }],
      };
      const treeModel = new MockTreeModel(mockData);

      cy.mount(TreeBrowserComponent, {
        imports: [A2TreeBrowserModule],
        componentProperties: {
          treeModel,
        },
      });

      cy.contains('Root').should('be.visible');
      cy.contains('Node #0').should('be.visible');
      cy.contains('Node #1').should('be.visible');
      cy.contains('Node #2').should('be.visible');
    });
  });

  describe('Node Expansion and Collapse', () => {
    it('should expand and collapse nodes', () => {
      const mockData: SimpleNode = {
        id: 'root',
        children: [
          {
            id: 'child1',
            children: [{ id: 'grandchild1' }, { id: 'grandchild2' }],
          },
        ],
      };
      const treeModel = new MockTreeModel(mockData);

      cy.mount(TreeBrowserComponent, {
        imports: [A2TreeBrowserModule],
        componentProperties: {
          treeModel,
        },
      });

      // Initially grandchildren should be collapsed (not visible)
      // Node #0 is the child with children, we need to find its expand button
      cy.get('button').contains('expand').first().click();

      // Now grandchildren should be visible
      cy.contains('Node #0').should('be.visible');
      cy.contains('Node #1').should('be.visible');

      // Click collapse button
      cy.get('button').contains('collapse').first().click();

      // Grandchildren should be hidden again
      cy.contains('Node #1').should('not.exist');
    });
  });

  describe('Child Limits', () => {
    it('should limit children display when childLimit is set', () => {
      const mockData: SimpleNode = {
        id: 'root',
        children: [{ id: 'child1' }, { id: 'child2' }, { id: 'child3' }, { id: 'child4' }, { id: 'child5' }],
      };
      const treeModel = new MockTreeModel(mockData);

      cy.mount(TreeBrowserComponent, {
        imports: [A2TreeBrowserModule],
        componentProperties: {
          treeModel,
          childLimit: 3,
        },
      });

      // Should only show 3 children
      cy.contains('Node #0').should('be.visible');
      cy.contains('Node #1').should('be.visible');
      cy.contains('Node #2').should('be.visible');
      cy.contains('Node #3').should('not.exist');
      cy.contains('Node #4').should('not.exist');
    });

    it('should show "See more" button when children are limited', () => {
      const mockData: SimpleNode = {
        id: 'root',
        children: [{ id: 'child1' }, { id: 'child2' }, { id: 'child3' }, { id: 'child4' }],
      };
      const treeModel = new MockTreeModel(mockData);

      cy.mount(TreeBrowserComponent, {
        imports: [A2TreeBrowserModule],
        componentProperties: {
          treeModel,
          childLimit: 2,
          childLimitIncreaseAmount: 2,
        },
      });

      // Should show "See more" button
      cy.contains('See more').should('be.visible');
    });

    it('should increase limit when "See more" is clicked', () => {
      const mockData: SimpleNode = {
        id: 'root',
        children: [{ id: 'child1' }, { id: 'child2' }, { id: 'child3' }, { id: 'child4' }],
      };
      const treeModel = new MockTreeModel(mockData);

      cy.mount(TreeBrowserComponent, {
        imports: [A2TreeBrowserModule],
        componentProperties: {
          treeModel,
          childLimit: 2,
          childLimitIncreaseAmount: 2,
        },
      });

      // Initially only 2 children visible
      cy.contains('Node #0').should('be.visible');
      cy.contains('Node #1').should('be.visible');
      cy.contains('Node #2').should('not.exist');

      // Click "See more"
      cy.contains('See more').click();

      // Now 4 children should be visible
      cy.contains('Node #0').should('be.visible');
      cy.contains('Node #1').should('be.visible');
      cy.contains('Node #2').should('be.visible');
      cy.contains('Node #3').should('be.visible');

      // "See more" button should no longer be visible
      cy.contains('See more').should('not.exist');
    });
  });

  describe('Nested Structures', () => {
    it('should render nested tree structure', () => {
      const mockData: SimpleNode = {
        id: 'root',
        children: [
          {
            id: 'child1',
            children: [
              {
                id: 'grandchild1',
                children: [{ id: 'great-grandchild1' }],
              },
            ],
          },
        ],
      };
      const treeModel = new MockTreeModel(mockData);

      cy.mount(TreeBrowserComponent, {
        imports: [A2TreeBrowserModule],
        componentProperties: {
          treeModel,
        },
      });

      cy.contains('Root').should('be.visible');
      cy.contains('Node #0').should('be.visible');

      // Expand first level
      cy.contains('Node #0').parent().find('button').contains('expand').click();
      cy.contains('Node #0').should('be.visible');

      // Expand second level
      cy.contains('Node #0')
        .parent()
        .parent()
        .within(() => {
          cy.contains('Node #0').parent().find('button').contains('expand').click();
        });

      // Should show deeply nested node
      cy.contains('Node #0').should('be.visible');
    });
  });

  describe('Empty Tree Handling', () => {
    it('should handle tree with no children', () => {
      const mockData: SimpleNode = {
        id: 'root',
        children: [{ id: 'leaf1' }, { id: 'leaf2' }],
      };
      const treeModel = new MockTreeModel(mockData);

      cy.mount(TreeBrowserComponent, {
        imports: [A2TreeBrowserModule],
        componentProperties: {
          treeModel,
        },
      });

      cy.contains('Root').should('be.visible');
      cy.contains('Node #0').should('be.visible');
      cy.contains('Node #1').should('be.visible');

      // Leaf nodes should not have expand/collapse buttons
      cy.contains('Node #0').parent().find('button').should('not.exist');
      cy.contains('Node #1').parent().find('button').should('not.exist');
    });
  });
});

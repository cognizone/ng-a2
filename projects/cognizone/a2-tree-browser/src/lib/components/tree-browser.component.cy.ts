/// <reference path="../../../../../cypress-test-app/cypress/support/component.ts" />

import { Subject } from 'rxjs';
import { TreeBrowserComponent } from './tree-browser.component';
import { A2TreeBrowserModule } from '../a2-tree-browser.module';
import { TreeModel } from '../model/tree-model';

// Simple mock tree structure for testing
interface SimpleNode {
  id: string;
  label?: string;
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
  describe('Basic Rendering', () => {
    it('should render a simple tree with root only', () => {
      const mockData: SimpleNode = { id: 'root' };
      const treeModel = new MockTreeModel(mockData);

      cy.mount(TreeBrowserComponent, {
        imports: [A2TreeBrowserModule],
        componentProperties: { treeModel },
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
        componentProperties: { treeModel },
      });

      cy.contains('Root').should('be.visible');
      cy.contains('Node #0').should('be.visible');
      cy.contains('Node #1').should('be.visible');
      cy.contains('Node #2').should('be.visible');
    });
  });

  describe('Node Expansion and Collapse', () => {
    it('should expand collapsed node when expand button is clicked', () => {
      const mockData: SimpleNode = {
        id: 'root',
        children: [
          {
            id: 'parent',
            children: [{ id: 'grandchild1' }, { id: 'grandchild2' }],
          },
        ],
      };
      const treeModel = new MockTreeModel(mockData);

      cy.mount(TreeBrowserComponent, {
        imports: [A2TreeBrowserModule],
        componentProperties: { treeModel },
      });

      // Parent should be visible with expand button
      cy.contains('Node #0').should('be.visible');
      cy.get('button').contains('expand').should('be.visible');

      // Click expand
      cy.get('button').contains('expand').click();

      // Grandchildren should now be visible
      cy.get('button').contains('collapse').should('be.visible');
    });

    it('should collapse expanded node when collapse button is clicked', () => {
      const mockData: SimpleNode = {
        id: 'root',
        children: [
          {
            id: 'parent',
            children: [{ id: 'grandchild' }],
          },
        ],
      };
      const treeModel = new MockTreeModel(mockData);

      cy.mount(TreeBrowserComponent, {
        imports: [A2TreeBrowserModule],
        componentProperties: { treeModel },
      });

      // Expand first
      cy.get('button').contains('expand').should('be.visible');
      cy.get('button').contains('collapse').should('not.exist');
      cy.get('button').contains('expand').click();

      // Collapse
      cy.get('button').contains('collapse').should('be.visible');
      cy.get('button').contains('collapse').click();
      cy.get('button').contains('expand').should('be.visible');
    });

    it('should toggle between expand and collapse states', () => {
      const mockData: SimpleNode = {
        id: 'root',
        children: [
          {
            id: 'parent',
            children: [{ id: 'child' }],
          },
        ],
      };
      const treeModel = new MockTreeModel(mockData);

      cy.mount(TreeBrowserComponent, {
        imports: [A2TreeBrowserModule],
        componentProperties: { treeModel },
      });

      // Initially collapsed
      cy.get('button').contains('expand').should('be.visible');

      // Expand
      cy.get('button').contains('expand').click();
      cy.get('button').contains('collapse').should('be.visible');

      // Collapse again
      cy.get('button').contains('collapse').click();
      cy.get('button').contains('expand').should('be.visible');
    });
  });

  describe('Child Limits', () => {
    it('should limit children display when childLimit is set', () => {
      const mockData: SimpleNode = {
        id: 'root',
        children: [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }, { id: 'c4' }, { id: 'c5' }],
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
        children: [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }, { id: 'c4' }],
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

      cy.contains('See more').should('be.visible');
    });

    it('should increase limit when "See more" is clicked', () => {
      const mockData: SimpleNode = {
        id: 'root',
        children: [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }, { id: 'c4' }],
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

      // Initially 2 children
      cy.contains('Node #0').should('be.visible');
      cy.contains('Node #1').should('be.visible');
      cy.contains('Node #2').should('not.exist');

      // Click "See more"
      cy.contains('See more').click();

      // All 4 children visible
      cy.contains('Node #2').should('be.visible');
      cy.contains('Node #3').should('be.visible');

      // Button should disappear
      cy.contains('See more').should('not.exist');
    });

    it('should handle multiple "See more" clicks progressively', () => {
      const mockData: SimpleNode = {
        id: 'root',
        children: [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }, { id: 'c4' }, { id: 'c5' }, { id: 'c6' }],
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

      // First click - show 4 children
      cy.contains('See more').click();
      cy.contains('Node #2').should('be.visible');
      cy.contains('Node #3').should('be.visible');
      cy.contains('Node #4').should('not.exist');
      cy.contains('See more').should('be.visible');

      // Second click - show all 6
      cy.contains('See more').click();
      cy.contains('Node #4').should('be.visible');
      cy.contains('Node #5').should('be.visible');
      cy.contains('See more').should('not.exist');
    });
  });

  describe('Nested Tree Structures', () => {
    it('should render and expand deeply nested tree', () => {
      const mockData: SimpleNode = {
        id: 'root',
        children: [
          {
            id: 'level1',
            children: [
              {
                id: 'level2',
                children: [{ id: 'level3' }],
              },
            ],
          },
        ],
      };
      const treeModel = new MockTreeModel(mockData);

      cy.mount(TreeBrowserComponent, {
        imports: [A2TreeBrowserModule],
        componentProperties: { treeModel },
      });

      cy.contains('Root').should('be.visible');
      cy.contains('Node #0').should('be.visible');

      // Expand level 1
      cy.get('button').contains('expand').first().click();

      // Expand level 2
      cy.get('button').contains('expand').first().click();

      // All levels expanded
      cy.contains('Root').should('be.visible');
    });

    it('should handle multiple sibling branches independently', () => {
      const mockData: SimpleNode = {
        id: 'root',
        children: [
          { id: 'branch1', children: [{ id: 'leaf1' }] },
          { id: 'branch2', children: [{ id: 'leaf2' }] },
        ],
      };
      const treeModel = new MockTreeModel(mockData);

      cy.mount(TreeBrowserComponent, {
        imports: [A2TreeBrowserModule],
        componentProperties: { treeModel },
      });

      // Both branches should have expand buttons
      cy.get('button').filter(':contains("expand")').should('have.length', 2);

      // Expand first branch only
      cy.get('button').filter(':contains("expand")').first().click();

      // First branch has collapse, second still has expand
      cy.get('button').filter(':contains("collapse")').should('have.length', 1);
      cy.get('button').filter(':contains("expand")').should('have.length', 1);
    });
  });

  describe('Leaf Nodes', () => {
    it('should not show expand/collapse button for leaf nodes', () => {
      const mockData: SimpleNode = {
        id: 'root',
        children: [{ id: 'leaf1' }, { id: 'leaf2' }],
      };
      const treeModel = new MockTreeModel(mockData);

      cy.mount(TreeBrowserComponent, {
        imports: [A2TreeBrowserModule],
        componentProperties: { treeModel },
      });

      cy.contains('Node #0').should('be.visible');
      cy.contains('Node #1').should('be.visible');
      cy.get('button').should('not.exist');
    });

    it('should treat node with empty children array as leaf', () => {
      const mockData: SimpleNode = {
        id: 'root',
        children: [{ id: 'empty-parent', children: [] }],
      };
      const treeModel = new MockTreeModel(mockData);

      cy.mount(TreeBrowserComponent, {
        imports: [A2TreeBrowserModule],
        componentProperties: { treeModel },
      });

      cy.contains('Node #0').should('be.visible');
      cy.get('button').should('not.exist');
    });
  });

  describe('Refresh Events', () => {
    it('should update tree when refreshEvents$ emits new TreeModel', () => {
      const initialData: SimpleNode = {
        id: 'root',
        children: [{ id: 'child1' }],
      };
      const initialModel = new MockTreeModel(initialData);

      const refreshSubject = new Subject<TreeModel<SimpleNode>>();

      cy.mount(TreeBrowserComponent, {
        imports: [A2TreeBrowserModule],
        componentProperties: {
          treeModel: initialModel,
          refreshEvents$: refreshSubject.asObservable(),
        },
      });

      // Initial state
      cy.contains('Node #0').should('be.visible');
      cy.contains('Node #1').should('not.exist');

      // Update tree via refreshEvents$
      cy.then(() => {
        const updatedData: SimpleNode = {
          id: 'root',
          children: [{ id: 'child1' }, { id: 'child2' }],
        };
        refreshSubject.next(new MockTreeModel(updatedData));
      });

      // Updated state - Cypress will retry until this passes
      cy.contains('Node #0').should('be.visible');
      cy.contains('Node #1').should('be.visible');
    });
  });

  describe('Component Structure', () => {
    it('should render tree-node components inside tree-browser', () => {
      const mockData: SimpleNode = {
        id: 'root',
        children: [{ id: 'child1' }],
      };
      const treeModel = new MockTreeModel(mockData);

      cy.mount(TreeBrowserComponent, {
        imports: [A2TreeBrowserModule],
        componentProperties: { treeModel },
      });

      // TreeBrowserComponent is the mounted root, so we check for its child components
      // Root + 1 child = 2 tree-node components
      cy.get('tb-tree-node').should('exist');
      cy.get('tb-tree-node').should('have.length', 2);
      cy.contains('Root').should('be.visible');
      cy.contains('Node #0').should('be.visible');
    });
  });
});

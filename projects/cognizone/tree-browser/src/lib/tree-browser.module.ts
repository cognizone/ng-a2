import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNodeComponent } from './components/tree-node.component';
import { DefaultLimitIncreaseComponent, DefaultNodeTemplateComponent } from './components/default-node-template.component';
import { TreeBrowserComponent } from './components/tree-browser.component';
import { InternalChildrenTemplateComponent } from './components/internal-children-template.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    TreeBrowserComponent,
    TreeNodeComponent,
    DefaultNodeTemplateComponent,
    DefaultLimitIncreaseComponent,
    InternalChildrenTemplateComponent,
  ],
  exports: [TreeBrowserComponent, InternalChildrenTemplateComponent],
})
export class TreeBrowserModule {}

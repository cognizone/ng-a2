import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { TreeModel } from '../model/tree-model';
import { NodeWrapper } from '../model/node-wrapper';
import { Observable } from 'rxjs';
import { OnDestroy$ } from '@cognizone/ng-core';

@Component({
  selector: 'tb-tree-node',
  template: `
    <ng-container
      *ngTemplateOutlet="
        nodeTemplate;
        context: {
          nodeWrapper: nodeWrapper,
          internalTemplate: internalTemplate,
        }
      "
    >
    </ng-container>

    <ng-template #internalTemplate let-nodeWrapper="nodeWrapper">
      <tb-tree-node
        *ngFor="let child of nodeWrapper.children; let i = index; let c = count"
        [nodeWrapper]="wrap(child, i, c)"
        [treeModel]="treeModel"
        [nodeTemplate]="nodeTemplate"
        [childLimit]="childLimit"
        [childLimitIncreaseAmount]="childLimitIncreaseAmount"
        [limitIncreaseTemplate]="limitIncreaseTemplate"
        [refreshEvents$]="refreshEvents$"
      ></tb-tree-node>

      <ng-container *ngIf="nodeWrapper.isLimitingChildren()">
        <ng-container *ngTemplateOutlet="limitIncreaseTemplate; context: { clickAction: limitIncrease() }"></ng-container>
      </ng-container>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNodeComponent<T> extends OnDestroy$ implements AfterViewInit, OnInit {
  @Input() treeModel: TreeModel<T>;
  @Input() nodeWrapper: NodeWrapper<T>;

  @Input() nodeTemplate: TemplateRef<any>;
  @Input() limitIncreaseTemplate: TemplateRef<any>;

  @Input() childLimit: number;
  @Input() childLimitIncreaseAmount: number;

  @Input() refreshEvents$: Observable<void>;

  constructor(private readonly _ref: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.subSink = this.refreshEvents$.subscribe(() => {
      this._ref.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    this._ref.detach();
  }

  limitIncrease(): () => void {
    return () => {
      this.childLimit += this.childLimitIncreaseAmount;
      this.nodeWrapper.setLimit(this.childLimit);
      this._ref.detectChanges();
    };
  }

  wrap(node: T, index: number, count: number) {
    return new NodeWrapper<T>(node, index, this.treeModel, this.childLimit, count, false);
  }
}

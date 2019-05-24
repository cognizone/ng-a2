import { TreeModel } from './tree-model';
import { Preconditions } from '@cognizone/a2-core';

export class NodeWrapper<T> {
  private readonly _node: T;
  private _treeModel: TreeModel<T>;
  private _children: any[];
  private _childLimit: number;
  private readonly _isRoot: boolean;
  private readonly _index: number;
  private readonly _siblingCount: number;

  constructor(node: T, index: number, treeModel: TreeModel<T>, childLimit: number, siblingCount: number, isRoot = false) {
    this._node = node;
    this._childLimit = childLimit;
    this._index = index;
    this._treeModel = treeModel;
    this._children = treeModel.getChildren(node);
    Preconditions.checkState(this._children instanceof Array, () => 'Node children must be array');
    this._isRoot = isRoot;
    this._siblingCount = siblingCount;
  }

  get node(): T {
    return this._node;
  }

  get children(): T[] {
    return this._children.slice(0, this._childLimit);
  }

  public hasChildren(): boolean {
    return this._children && this._children.length > 0;
  }

  public isLimitingChildren(): boolean {
    return this._childLimit < this._children.length;
  }

  public isRoot(): boolean {
    return this._isRoot;
  }

  public isLeaf(): boolean {
    return !this.hasChildren();
  }

  public setLimit(limit: number) {
    this._childLimit = limit;
  }

  public get index() {
    return this._index;
  }

  public recalculateChildren() {
    this._children = this._treeModel.getChildren(this._node);
  }

  get siblingCount() {
    return this._siblingCount;
  }
}

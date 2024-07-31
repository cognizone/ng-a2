export interface TreeModel<T> {
  getRoot(): T;

  getChildren(parent: T): T[];
}


export interface AttributeModel {
  getUri(): string;

  getValue(attributeId: string): any;
  setValue(attributeId: string, value: any): void;
  clearValue (attributeId: string): void;
}

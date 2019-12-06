import {AttributeModel} from '../attribute-model/attribute-model';
import {Type} from '../applicationprofile/application-profile';

export interface TypedResource extends AttributeModel {

  getUri(): string;
  getValue(attributeId: string): any;
  setValue(attributeId: string, value: any): void;
  addValue(attributeId: string, value: any): void;
  clearValue(attributeId: string): void;

  getType(): Type;
  getResources(attributeId: string): TypedResource[];
  getResource(attributeId: string): TypedResource;
}


import { JsonResourceWrapper } from './json-resource-wrapper';
import { JsonResource } from './json-resource';

export interface JsonResourceFactory<T extends JsonResource> {
  (unwrappedData: any, structure: JsonResourceWrapper<T>): T;
}

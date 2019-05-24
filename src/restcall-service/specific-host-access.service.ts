import {RestCallBuilder} from "./rest-call";
import {Injectable} from "@angular/core";


@Injectable()
export abstract class SpecificHostAccessService {
  abstract builder(): RestCallBuilder;
  abstract getHost(): string;
}

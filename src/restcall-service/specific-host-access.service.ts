import {Injectable} from "@angular/core";
import {RestCallBuilder} from "./rest-call.service";


@Injectable()
export abstract class SpecificHostAccessService {
  abstract builder(): RestCallBuilder;
  abstract getHost(): string;
}

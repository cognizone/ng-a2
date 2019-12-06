import {ApplicationProfile, Attribute, Type} from "../applicationprofile/application-profile";
import {Preconditions} from "../../precondition/preconditions";

// @dynamic
export class ApplicationProfileUtils {

  public static mergeProfiles(uri:string|undefined, ...profiles: ApplicationProfile[]): ApplicationProfile {
    Preconditions.checkState(profiles.length > 0);
    if (profiles.length === 1) return profiles[0];

    const mergeMap = new Map<string, Type>();

    profiles.forEach(p => {
      p.getTypes().forEach((t) => {

        const classId = t.getClassIds()[0];

        if (mergeMap.has(classId)) {
          console.warn('"' + classId + '" defined multiple times, skipping ...');
          return;
        }
        mergeMap.set(classId, t);
      });
    });

    return new ApplicationProfile(uri, mergeMap);
  }


 public static mergeTypes(types: Type[]): Type {
    Preconditions.checkState(types.length > 0);
    if (types.length === 1) return types[0];

    const mergeMap = new Map<string, Attribute> ();
    let classIds: string[] = [];

    types.forEach(t => {
      Preconditions.checkState(!t.getClassIds().some(id => classIds.indexOf(id) >= 0));
      classIds = classIds.concat(t.getClassIds());
      t.getAttributes().forEach((a) => {
        const id = a.getAttributeId();
        if (mergeMap.has(id)) {
          // console.warn('"' + id + '" defined multiple times, skipping ...');
          return;
        }

        mergeMap.set(id, a);
      });
    });
    return new Type(types[0].getApplicationProfile(), classIds, mergeMap);
  }

  public static getAttributes(type: Type, predicate: (a: Attribute) => boolean): Attribute[] {
    return type.getAttributes().filter(a => predicate(a));
  }

  public static getLiteralAttributes(type: Type): Attribute[] {
    return this.getAttributes(type, a => a.isLiteral());
  }

  public static getResourceAttributes(type: Type): Attribute[] {
    return this.getAttributes(type, a => a.isTypedResource());
  }
}

export class Preconditions {

  static checkNotNull<T>(object: T, message = () => 'Preconditions checkNotNull failed'): T {
    if (object == null) { throw new Error(message()); }
    return object;
  }

  static checkState(state: boolean, message = () => 'Preconditions checkState failed') {
    if (!state) { throw new Error(message()); }
  }
}

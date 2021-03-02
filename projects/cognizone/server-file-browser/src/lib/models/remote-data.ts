// todo: (?) move to a shared esco lib in the future
export interface RemoteDataSuccess<T> {
  data: T;
}

export interface RemoteDataError<T, E = Error> {
  error: E;
  fallbackData?: T;
}

export type RemoteData<T, E = Error> = RemoteDataSuccess<T> | RemoteDataError<T, E>;

export function isRemoteDataSuccess<T, E>(o: RemoteData<T, E>): o is RemoteDataSuccess<T> {
  return 'data' in o;
}

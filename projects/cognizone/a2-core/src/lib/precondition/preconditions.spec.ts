import { Preconditions } from './preconditions';

describe('Preconditions', () => {
  describe('Precondition Checks', () => {
    describe('checkNotNull', () => {
      it('should return object when not null', () => {
        const obj = { test: 'value' };
        const result = Preconditions.checkNotNull(obj);
        expect(result).toBe(obj);
      });

      it('should return object when not undefined', () => {
        const obj = 'test';
        const result = Preconditions.checkNotNull(obj);
        expect(result).toBe(obj);
      });

      it('should throw error when null', () => {
        expect(() => Preconditions.checkNotNull(null)).toThrow('Preconditions checkNotNull failed');
      });

      it('should throw error when undefined', () => {
        expect(() => Preconditions.checkNotNull(undefined)).toThrow('Preconditions checkNotNull failed');
      });

      it('should throw custom error message when provided', () => {
        expect(() => Preconditions.checkNotNull(null, () => 'Custom error')).toThrow('Custom error');
      });
    });

    describe('checkState', () => {
      it('should not throw when state is true', () => {
        expect(() => Preconditions.checkState(true)).not.toThrow();
      });

      it('should throw error when state is false', () => {
        expect(() => Preconditions.checkState(false)).toThrow('Preconditions checkState failed');
      });

      it('should throw custom error message when provided', () => {
        expect(() => Preconditions.checkState(false, () => 'Custom state error')).toThrow('Custom state error');
      });
    });
  });
});

import { StringUtil } from './string-util';

describe('Creation and Retrieval of StringUtil', () => {
  describe('String Validation', () => {
    test('isUpper', () => {
      expect(StringUtil.isUpper('LABEL')).toBeTruthy();
      expect(StringUtil.isUpper('LABEl')).toBeFalsy();
      expect(StringUtil.isUpper('BLA bla')).toBeFalsy();
    });
  });

  describe('Attribute Label Conversion', () => {
    it('should convert camelCase to readable label', () => {
      expect(StringUtil.convertAttributeToLabel('firstName')).toBe('First name');
      expect(StringUtil.convertAttributeToLabel('lastName')).toBe('Last name');
      expect(StringUtil.convertAttributeToLabel('emailAddress')).toBe('Email address');
    });

    it('should handle single word attributes', () => {
      expect(StringUtil.convertAttributeToLabel('name')).toBe('Name');
      expect(StringUtil.convertAttributeToLabel('id')).toBe('Id');
    });

    it('should handle attributes with consecutive uppercase letters', () => {
      expect(StringUtil.convertAttributeToLabel('downloadURL')).toBe('Download URL');
      expect(StringUtil.convertAttributeToLabel('apiKey')).toBe('Api key');
    });

    it('should handle all lowercase attributes', () => {
      expect(StringUtil.convertAttributeToLabel('description')).toBe('Description');
      expect(StringUtil.convertAttributeToLabel('title')).toBe('Title');
    });

    it('should handle attributes starting with uppercase', () => {
      expect(StringUtil.convertAttributeToLabel('FirstName')).toBe('First name');
      expect(StringUtil.convertAttributeToLabel('LastName')).toBe('Last name');
    });

    it('should capitalize first letter of result', () => {
      expect(StringUtil.convertAttributeToLabel('firstName').charAt(0)).toBe('F');
      expect(StringUtil.convertAttributeToLabel('lastName').charAt(0)).toBe('L');
    });
  });
});

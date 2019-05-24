export class StringUtil {
  public static convertAttributeToLabel(attributeId: string): string {
    const original = attributeId;

    let result = '';
    for (let i = 0; i < original.length; i++) {
      let ch = original.charAt(i);

      if (!this.isUpper(ch)) {
        result += ch;
        continue;
      }

      if (i > 0 && this.isLower(original.charAt(i - 1))) {
        // lowercase new words
        result += ' ' + ch.toLowerCase();
      } else {
        // downloadURL case => uppercase previous char to get URL
        result =
            result.substring(0, result.length - 1) +
            result.charAt(result.length - 1).toUpperCase() +
            ch;
      }

      // TODO will not work for weird case of ISBNNumber which should split like ISBN number
    }

    return result.charAt(0).toUpperCase() + result.substring(1);
  }

  public static isUpper(character): boolean {
    return (character === character.toUpperCase() && character !== character.toLowerCase()   );
  }

  public static isLower(character): boolean {
    return (character === character.toLowerCase() && character !== character.toUpperCase());
  }
}

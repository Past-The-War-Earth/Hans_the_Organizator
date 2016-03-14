/**
 * Created by Papa on 2/11/2016.
 */

module to.speech {

  export var DICTIONARY:{[key:string]:string[]} = {
    organizer: [
      'organize',
      'an adventure'
    ],
    create: [
      'a great',
      'great'
    ]
  };

  export function wordMatchesKeysOrDictionary(
    keys:string[],
    word:string
  ):boolean {
    return keys.some((key) => {
      return wordMatchesKeyOrDictionary(key, word);
    });
  }

  export function wordMatchesKeyOrDictionary(
    key:string,
    word:string
  ):boolean {
    if (key === word) {
      return true;
    }

    let matches = DICTIONARY[key];
    if (!matches) {
      return false;
    }
    return matches.some(( match ) => {
      return match === word;
    });
  }

}

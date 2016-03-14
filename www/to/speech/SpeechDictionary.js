/**
 * Created by Papa on 2/11/2016.
 */
var to;
(function (to) {
    var speech;
    (function (speech) {
        speech.DICTIONARY = {
            organizer: [
                'organize',
                'an adventure'
            ],
            create: [
                'a great',
                'great'
            ]
        };
        function wordMatchesKeysOrDictionary(keys, word) {
            return keys.some(function (key) {
                return wordMatchesKeyOrDictionary(key, word);
            });
        }
        speech.wordMatchesKeysOrDictionary = wordMatchesKeysOrDictionary;
        function wordMatchesKeyOrDictionary(key, word) {
            if (key === word) {
                return true;
            }
            var matches = speech.DICTIONARY[key];
            if (!matches) {
                return false;
            }
            return matches.some(function (match) {
                return match === word;
            });
        }
        speech.wordMatchesKeyOrDictionary = wordMatchesKeyOrDictionary;
    })(speech = to.speech || (to.speech = {}));
})(to || (to = {}));
//# sourceMappingURL=SpeechDictionary.js.map
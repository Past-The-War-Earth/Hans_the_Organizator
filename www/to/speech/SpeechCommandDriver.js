///<reference path="../imports.ts"/>
/**
 * Created by Papa on 2/10/2016.
 */
var to;
(function (to) {
    var speech;
    (function (speech) {
        var SpeechCommandDriver = (function () {
            function SpeechCommandDriver(maxNumWordsInPhrase) {
                if (maxNumWordsInPhrase === void 0) { maxNumWordsInPhrase = 3; }
                this.maxNumWordsInPhrase = maxNumWordsInPhrase;
                this.currentPhraseWords = [];
                this.command = new speech.Command(new speech.CommandFragment(speech.COMMANDS));
            }
            // Navigate the global command tree and pick the next matching child node
            SpeechCommandDriver.prototype.matchWordToFragment = function (word, // word to match
                currentFragment) {
                var node = currentFragment.commandNode;
                if (
                // If this word isn't coming as a response to a system confirmation
                !currentFragment.isConfirming()
                    && currentFragment.keyMatches(speech.SAVE_WORDS) //
                ) {
                    // Add the word to the bucket
                    this.command.currentFragment.addWord(word);
                    return true;
                }
                // Check all branches from the current command tree node fragment
                for (var key in node.options) {
                    var nextNode = node.options[key];
                    // If the current fragment is for saving words
                    if (key === speech.SAVE_WORDS) {
                        var saveWordsFragment = this.command.addFragment(nextNode);
                        saveWordsFragment.addWord(word);
                        return true;
                    }
                    else 
                    // If the saved phrase with the current word matches an option on the current node
                    if (speech.wordMatchesKeysOrDictionary(nextNode.keys, this.getSavedPhrase(word))) {
                        // 1
                        // Remember this node
                        this.lastMatchedNode = nextNode;
                        // Save the word and return the word count overflow status
                        return this.saveWordToPhrase(word);
                    }
                }
                // If the current word does not match but there was already a phrase that matched
                if (this.lastMatchedNode) {
                    // 2
                    // Clear the last phrase, since we already have the node it matched
                    this.clearSavedPhrase();
                    // Add the command node
                    var lastNode = this.lastMatchedNode;
                    this.lastMatchedNode = null;
                    // Create a fragment for the last node
                    var lastFragment = this.command.addFragment(lastNode);
                    // All confirmation nodes are either command-terminal or continue one level in the tree
                    if (lastFragment.confirmIfNecessary()) {
                        this.runPostConfirmationLogic(lastFragment);
                    }
                    // re-run the word matching phase;
                    return this.matchWordToFragment(word, lastFragment);
                }
                // Else, there word didn't match a command and there was no pending fragment, just save the word
                return this.saveWordToPhrase(word);
            };
            // If any additional post confirmation logic is needed, add it here
            SpeechCommandDriver.prototype.runPostConfirmationLogic = function (confirmationFragment) {
            };
            SpeechCommandDriver.prototype.saveWordToPhrase = function (word) {
                this.currentPhraseWords.push(word);
                return this.currentPhraseWords.length <= this.maxNumWordsInPhrase;
            };
            SpeechCommandDriver.prototype.getSavedPhrase = function (word) {
                return (this.currentPhraseWords.join(' ') + " " + word).trim();
            };
            SpeechCommandDriver.prototype.clearSavedPhrase = function () {
                this.currentPhraseWords = [];
            };
            // Process the next word
            SpeechCommandDriver.prototype.next = function (word) {
                // Get the last command phrase fragment
                var currentFragment = this.command.getLastFragment();
                // If this word isn't coming as a response to a system confirmation
                if (!currentFragment.isConfirming()) {
                    // If the word matches the last command word
                    // TODO: make this configurable, maybe (un)learnable by the number of double words received
                    if (speech.wordMatchesKeysOrDictionary(currentFragment.commandNode.keys, word)) {
                        // Same command word twice, user could have been clearing their throat, just eat this word
                        return currentFragment.commandNode.isTerminal;
                    }
                }
                // If the word doesn't match the current command chain
                if (!this.matchWordToFragment(word, currentFragment)) {
                    // Throw the perceived command chain words
                    var errorMessage = this.getCommandString() + " " + this.getSavedPhrase(word);
                    throw errorMessage;
                }
                // Return false if the last fragment definitively ends a command
                return !this.command.isEnded();
            };
            SpeechCommandDriver.prototype.getCommandString = function () {
                var commandString = this.command.getLastSubCommandString();
                return commandString;
            };
            return SpeechCommandDriver;
        }());
        speech.SpeechCommandDriver = SpeechCommandDriver;
    })(speech = to.speech || (to.speech = {}));
})(to || (to = {}));
//# sourceMappingURL=SpeechCommandDriver.js.map
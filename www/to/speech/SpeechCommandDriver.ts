///<reference path="../imports.ts"/>
/**
 * Created by Papa on 2/10/2016.
 */

module to.speech {

  export class SpeechCommandDriver {

    currentPhraseWords:string[] = [];
    command:Command = new Command(new CommandFragment(COMMANDS));
    lastMatchedNode:CommandNode;

    constructor(
      private maxNumWordsInPhrase:number = 3
    ) {
    }

    // Navigate the global command tree and pick the next matching child node
    private matchWordToFragment(
      word:string, // word to match
      currentFragment:CommandFragment
    ):boolean {
      let node = currentFragment.commandNode;
      if (
        // If this word isn't coming as a response to a system confirmation
      !currentFragment.isConfirming()
        // And is the node is just a word bucket
      && currentFragment.keyMatches(SAVE_WORDS) //
      ) {
        // Add the word to the bucket
        this.command.currentFragment.addWord(word);
        return true;
      }
      // Check all branches from the current command tree node fragment
      for (let key in node.options) {
        let nextNode = node.options[key];
        // If the current fragment is for saving words
        if (key === SAVE_WORDS) {
          let saveWordsFragment = this.command.addFragment(nextNode);
          saveWordsFragment.addWord(word);

          return true;
        } else
        // If the saved phrase with the current word matches an option on the current node
        if (wordMatchesKeysOrDictionary(nextNode.keys, this.getSavedPhrase(word))) {
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
        let lastNode = this.lastMatchedNode;
        this.lastMatchedNode = null;
        // Create a fragment for the last node
        let lastFragment = this.command.addFragment(lastNode);

        // All confirmation nodes are either command-terminal or continue one level in the tree
        if (lastFragment.confirmIfNecessary()) {
          this.runPostConfirmationLogic(lastFragment)
        }

        // re-run the word matching phase;
        return this.matchWordToFragment(word, lastFragment);
      }

      // Else, there word didn't match a command and there was no pending fragment, just save the word
      return this.saveWordToPhrase(word);
    }

    // If any additional post confirmation logic is needed, add it here
    runPostConfirmationLogic(
      confirmationFragment:CommandFragment
    ):void {
    }

    saveWordToPhrase(
      word:string
    ):boolean {
      this.currentPhraseWords.push(word);

      return this.currentPhraseWords.length <= this.maxNumWordsInPhrase;
    }

    getSavedPhrase(
      word?:string
    ):string {
      return `${this.currentPhraseWords.join(' ')} ${word}`.trim();
    }

    clearSavedPhrase():void {
      this.currentPhraseWords = [];
    }

    // Process the next word
    next(
      word:string
    ):boolean {
      // Get the last command phrase fragment
      let currentFragment = this.command.getLastFragment();

      // If this word isn't coming as a response to a system confirmation
      if (!currentFragment.isConfirming()) {
        // If the word matches the last command word
        // TODO: make this configurable, maybe (un)learnable by the number of double words received
        if (wordMatchesKeysOrDictionary(currentFragment.commandNode.keys, word)) {
          // Same command word twice, user could have been clearing their throat, just eat this word
          return currentFragment.commandNode.isTerminal;
        }
      }

      // If the word doesn't match the current command chain
      if (!this.matchWordToFragment(word, currentFragment)) {
        // Throw the perceived command chain words
        let errorMessage = `${this.getCommandString()} ${this.getSavedPhrase(word)}`;

        throw errorMessage;
      }
      // Return false if the last fragment definitively ends a command
      return !this.command.isEnded();
    }

    getCommandString():string {
      let commandString = this.command.getLastSubCommandString();

      return commandString;
    }

  }

}

///<reference path="../imports.ts"/>
/**
 * Created by Papa on 2/10/2016.
 */

module to.speech {

  export enum CommandType {
    CREATE,
    UPDATE
  }

  export enum EntityType {
    ACTION,
    CATEGORY,
    MOTIVATION,
    ADVICE
  }

  export enum UpdateType {
    IMPORTANCE,
    PRIORITY,
    ADD,
    REMOVE
  }

  export enum RelationType {
    BEFORE,
    AFTER
  }

  // Organizer Create Action 'This is a test of Audible Action Creation'
  export class CompositionState {
    static COMMAND = 'COMMAND';
    static CONFIRMATION = 'CONFIRMATION'; // Ends tree triversal
    static CONTINUATION = 'CONTINUATION'; // Upon completion navigates one node up the tree
    static ENTITY = 'ENTITY';
    static NAME = 'NAME'; // Ends in a timeout that leads to a Confirmation
  }

  export interface CommandNode {
    isComplete?:boolean;
    isTerminal?:boolean;
    keys: string[];
    options?:{[word:string]:CommandNode};
    state: string;
  }

  export class Command {

    constructor(
      private rootFragment:CommandFragment,
      public currentFragment:CommandFragment = rootFragment
    ) {
    }

    addFragment(
      commandNode:CommandNode
    ):CommandFragment {
      switch (commandNode.state) {
        case CompositionState.CONTINUATION:
          return this.addContinuationFragment(commandNode);
        default:
          return this.addChildFragment(commandNode);
      }
    }

    addChildFragment(
      commandNode:CommandNode
    ):CommandFragment {
      let fragment = new CommandFragment(commandNode, this.currentFragment);
      this.currentFragment = fragment;

      return fragment;
    }

    addContinuationFragment(
      commandNode:CommandNode
    ):CommandFragment {
      let fragment = new CommandFragment(commandNode, this.currentFragment.parentFragment);
      this.currentFragment = fragment;

      return fragment;
    }

    getLastSubCommandString():string {
      let currentFragment = this.getLastBranchRoot();
      let commandString = '';
      do {
        if (this.keyMatches('SAVE_WORDS', currentFragment)) {
          commandString += currentFragment.words.join(' ') + ' ';
        } else {
          // TODO: MAYBE match the exact key and not just the first one
          commandString += currentFragment.commandNode.keys[0] + ' ';
        }
        currentFragment = currentFragment.childFragments[0];
      } while (currentFragment);

      return commandString;
    }

    keyMatches(
      value:string,
      fragment:CommandFragment
    ):boolean {
      let keys = fragment.commandNode.keys;
      return keys.some(( key ) => {
        return key === value
      });
    }

    private getLastBranchRoot(
      fragment:CommandFragment = this.currentFragment
    ):CommandFragment {
      let cursorFragment = fragment;
      let parentFragment = fragment.parentFragment;

      if (!parentFragment) {
        return cursorFragment;
      }
      if (parentFragment.childFragments.length > 1) {
        return cursorFragment;
      }
      return this.getLastBranchRoot(parentFragment);
    }

    getLastFragment():CommandFragment {
      return this.currentFragment;
    }

    isEnded():boolean {
      let lastFragment = this.getLastFragment();

      return lastFragment.commandNode.isTerminal;
    }

    isComplete():boolean {
      let lastFragment = this.getLastFragment();

      return lastFragment.commandNode.isComplete;
    }

    canConfirm():boolean {
      let lastFragment = this.getLastFragment();

      return !lastFragment.confirmingTries || lastFragment.confirmingTries < 3;
    }

    askForConfirmation():void {
      let lastFragment = this.getLastFragment();

      lastFragment.attemptConfirmation();
    }

  }

  export class CommandFragment {

    childFragments:CommandFragment[];
    confirmed:boolean;
    confirmingTries:number = 0;
    words:string[] = [];

    constructor(
      public commandNode:CommandNode,
      public parentFragment:CommandFragment = null
    ) {
      this.childFragments = [];

      if (parentFragment) {
        parentFragment.childFragments.push(this);
      }
    }

    keyMatches(
      value:string
    ):boolean {
      let keys = this.commandNode.keys;
      return keys.some(( key ) => {
        return key === value
      });
    }

    attemptConfirmation():void {
      this.confirmingTries++;
    }

    confirm():void {
      this.confirmed = true;
    }

    isConfirming():boolean {
      return this.confirmingTries && !this.confirmed;
    }

    confirmIfNecessary(
    ):boolean {
      if (this.confirmingTries) {
        this.confirmed = true;
        return true;
      }
      return false;
    }

    addWord(
      word:string
    ):void {
      this.words.push(word);
    }

  }

}

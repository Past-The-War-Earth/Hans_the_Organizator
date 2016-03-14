///<reference path="../imports.ts"/>
/**
 * Created by Papa on 2/10/2016.
 */

/**
 *
 * TODO: REMEMBER -
 *
 * 1) last Rule in a given set of options ALWAYS wins
 * 1) In a given key array, shortest match always wins
 */

module to.speech {

  export var SAVE_WORDS = 'SAVE_WORDS';

  var SET_PRIORITY:CommandNode = {
    keys: ['set priority'],
    state: CompositionState.COMMAND
  };
  var SET_URGENCY:CommandNode = {
    keys: ['set urgency'],
    state: CompositionState.COMMAND

  };
  var SET_DUE_BY:CommandNode = {
    keys: ['set due by'],
    state: CompositionState.COMMAND
  };

  var CONFIRMATION:CommandNode = {
    isComplete: true,
    keys: ['confirmation'],
    options: {
      no: {
        isTerminal: true,
        keys: ['no', 'incorrect'],
        state: CompositionState.CONFIRMATION
      },
      yes: {
        isTerminal: true,
        keys: ['execute', 'yes execute', 'correct execute'],
        state: CompositionState.CONFIRMATION
      },
      'yes also': {
        keys: ['yes also', 'yes and'],
        state: CompositionState.CONTINUATION
      },
    },
    state: CompositionState.CONFIRMATION
  };

  var CREATE_ACTION:CommandNode = {
    keys: ['action'],
    options: {
      SAVE_WORDS: {
        keys: [SAVE_WORDS],
        isComplete: true,
        options: {
          CONFIRMATION: CONFIRMATION
        },
        state: CompositionState.NAME,
      },
      'set priority': SET_PRIORITY,
      'set urgency': SET_URGENCY,
      'set due by': SET_DUE_BY
    },
    state: CompositionState.ENTITY
  };

  var CREATE_MOTIVATION:CommandNode = {
    keys: ['reason', 'motivation'],
    options: {
      SAVE_WORDS: {
        isComplete: true,
        keys: [SAVE_WORDS],
        state: CompositionState.NAME
      }
    },
    state: CompositionState.ENTITY
  };

  var CREATE_CATEGORY:CommandNode = {
    keys: ['category'],
    options: {
      SAVE_WORDS: {
        isComplete: true,
        keys: [SAVE_WORDS],
        state: CompositionState.NAME
      }
    },
    state: CompositionState.ENTITY
  };

  var CREATE_ADVICE:CommandNode = {
    keys: ['advice'],
    options: {
      SAVE_WORDS: {
        isComplete: true,
        keys: [SAVE_WORDS],
        state: CompositionState.NAME
      }
    },
    state: CompositionState.ENTITY
  };

  var COMMAND_UPDATE:CommandNode = {
    keys: ['update'],
    options: {},
    state: CompositionState.COMMAND
  };

  var COMMAND_CREATE:CommandNode = {
    keys: ['create'],
    options: {
      action: CREATE_ACTION,
      advice: CREATE_ADVICE,
      category: CREATE_CATEGORY,
      reason: CREATE_MOTIVATION
    },
    state: CompositionState.COMMAND
  };

  export var COMMANDS:CommandNode = {
    keys: [],
    options: {
      create: COMMAND_CREATE,
      update: COMMAND_UPDATE
    },
    state: undefined
  };

}

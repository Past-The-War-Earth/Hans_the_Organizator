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
var to;
(function (to) {
    var speech;
    (function (speech) {
        speech.SAVE_WORDS = 'SAVE_WORDS';
        var SET_PRIORITY = {
            keys: ['set priority'],
            state: speech.CompositionState.COMMAND
        };
        var SET_URGENCY = {
            keys: ['set urgency'],
            state: speech.CompositionState.COMMAND
        };
        var SET_DUE_BY = {
            keys: ['set due by'],
            state: speech.CompositionState.COMMAND
        };
        var CONFIRMATION = {
            isComplete: true,
            keys: ['confirmation'],
            options: {
                no: {
                    isTerminal: true,
                    keys: ['no', 'incorrect'],
                    state: speech.CompositionState.CONFIRMATION
                },
                yes: {
                    isTerminal: true,
                    keys: ['execute', 'yes execute', 'correct execute'],
                    state: speech.CompositionState.CONFIRMATION
                },
                'yes also': {
                    keys: ['yes also', 'yes and'],
                    state: speech.CompositionState.CONTINUATION
                }
            },
            state: speech.CompositionState.CONFIRMATION
        };
        var CREATE_ACTION = {
            keys: ['action'],
            options: {
                SAVE_WORDS: {
                    keys: [speech.SAVE_WORDS],
                    isComplete: true,
                    options: {
                        CONFIRMATION: CONFIRMATION
                    },
                    state: speech.CompositionState.NAME
                },
                'set priority': SET_PRIORITY,
                'set urgency': SET_URGENCY,
                'set due by': SET_DUE_BY
            },
            state: speech.CompositionState.ENTITY
        };
        var CREATE_MOTIVATION = {
            keys: ['reason', 'motivation'],
            options: {
                SAVE_WORDS: {
                    isComplete: true,
                    keys: [speech.SAVE_WORDS],
                    state: speech.CompositionState.NAME
                }
            },
            state: speech.CompositionState.ENTITY
        };
        var CREATE_CATEGORY = {
            keys: ['category'],
            options: {
                SAVE_WORDS: {
                    isComplete: true,
                    keys: [speech.SAVE_WORDS],
                    state: speech.CompositionState.NAME
                }
            },
            state: speech.CompositionState.ENTITY
        };
        var CREATE_ADVICE = {
            keys: ['advice'],
            options: {
                SAVE_WORDS: {
                    isComplete: true,
                    keys: [speech.SAVE_WORDS],
                    state: speech.CompositionState.NAME
                }
            },
            state: speech.CompositionState.ENTITY
        };
        var COMMAND_UPDATE = {
            keys: ['update'],
            options: {},
            state: speech.CompositionState.COMMAND
        };
        var COMMAND_CREATE = {
            keys: ['create'],
            options: {
                action: CREATE_ACTION,
                advice: CREATE_ADVICE,
                category: CREATE_CATEGORY,
                reason: CREATE_MOTIVATION
            },
            state: speech.CompositionState.COMMAND
        };
        speech.COMMANDS = {
            keys: [],
            options: {
                create: COMMAND_CREATE,
                update: COMMAND_UPDATE
            },
            state: undefined
        };
    })(speech = to.speech || (to.speech = {}));
})(to || (to = {}));
//# sourceMappingURL=InputRules.js.map
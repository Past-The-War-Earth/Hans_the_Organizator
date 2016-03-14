///<reference path="../imports.ts"/>
/**
 * Created by Papa on 2/10/2016.
 */
var to;
(function (to) {
    var speech;
    (function (speech) {
        (function (CommandType) {
            CommandType[CommandType["CREATE"] = 0] = "CREATE";
            CommandType[CommandType["UPDATE"] = 1] = "UPDATE";
        })(speech.CommandType || (speech.CommandType = {}));
        var CommandType = speech.CommandType;
        (function (EntityType) {
            EntityType[EntityType["ACTION"] = 0] = "ACTION";
            EntityType[EntityType["CATEGORY"] = 1] = "CATEGORY";
            EntityType[EntityType["MOTIVATION"] = 2] = "MOTIVATION";
            EntityType[EntityType["ADVICE"] = 3] = "ADVICE";
        })(speech.EntityType || (speech.EntityType = {}));
        var EntityType = speech.EntityType;
        (function (UpdateType) {
            UpdateType[UpdateType["IMPORTANCE"] = 0] = "IMPORTANCE";
            UpdateType[UpdateType["PRIORITY"] = 1] = "PRIORITY";
            UpdateType[UpdateType["ADD"] = 2] = "ADD";
            UpdateType[UpdateType["REMOVE"] = 3] = "REMOVE";
        })(speech.UpdateType || (speech.UpdateType = {}));
        var UpdateType = speech.UpdateType;
        (function (RelationType) {
            RelationType[RelationType["BEFORE"] = 0] = "BEFORE";
            RelationType[RelationType["AFTER"] = 1] = "AFTER";
        })(speech.RelationType || (speech.RelationType = {}));
        var RelationType = speech.RelationType;
        // Organizer Create Action 'This is a test of Audible Action Creation'
        var CompositionState = (function () {
            function CompositionState() {
            }
            CompositionState.COMMAND = 'COMMAND';
            CompositionState.CONFIRMATION = 'CONFIRMATION'; // Ends tree triversal
            CompositionState.CONTINUATION = 'CONTINUATION'; // Upon completion navigates one node up the tree
            CompositionState.ENTITY = 'ENTITY';
            CompositionState.NAME = 'NAME'; // Ends in a timeout that leads to a Confirmation
            return CompositionState;
        }());
        speech.CompositionState = CompositionState;
        var Command = (function () {
            function Command(rootFragment, currentFragment) {
                if (currentFragment === void 0) { currentFragment = rootFragment; }
                this.rootFragment = rootFragment;
                this.currentFragment = currentFragment;
            }
            Command.prototype.addFragment = function (commandNode) {
                switch (commandNode.state) {
                    case CompositionState.CONTINUATION:
                        return this.addContinuationFragment(commandNode);
                    default:
                        return this.addChildFragment(commandNode);
                }
            };
            Command.prototype.addChildFragment = function (commandNode) {
                var fragment = new CommandFragment(commandNode, this.currentFragment);
                this.currentFragment = fragment;
                return fragment;
            };
            Command.prototype.addContinuationFragment = function (commandNode) {
                var fragment = new CommandFragment(commandNode, this.currentFragment.parentFragment);
                this.currentFragment = fragment;
                return fragment;
            };
            Command.prototype.getLastSubCommandString = function () {
                var currentFragment = this.getLastBranchRoot();
                var commandString = '';
                do {
                    if (this.keyMatches('SAVE_WORDS', currentFragment)) {
                        commandString += currentFragment.words.join(' ') + ' ';
                    }
                    else {
                        // TODO: MAYBE match the exact key and not just the first one
                        commandString += currentFragment.commandNode.keys[0] + ' ';
                    }
                    currentFragment = currentFragment.childFragments[0];
                } while (currentFragment);
                return commandString;
            };
            Command.prototype.keyMatches = function (value, fragment) {
                var keys = fragment.commandNode.keys;
                return keys.some(function (key) {
                    return key === value;
                });
            };
            Command.prototype.getLastBranchRoot = function (fragment) {
                if (fragment === void 0) { fragment = this.currentFragment; }
                var cursorFragment = fragment;
                var parentFragment = fragment.parentFragment;
                if (!parentFragment) {
                    return cursorFragment;
                }
                if (parentFragment.childFragments.length > 1) {
                    return cursorFragment;
                }
                return this.getLastBranchRoot(parentFragment);
            };
            Command.prototype.getLastFragment = function () {
                return this.currentFragment;
            };
            Command.prototype.isEnded = function () {
                var lastFragment = this.getLastFragment();
                return lastFragment.commandNode.isTerminal;
            };
            Command.prototype.isComplete = function () {
                var lastFragment = this.getLastFragment();
                return lastFragment.commandNode.isComplete;
            };
            Command.prototype.canConfirm = function () {
                var lastFragment = this.getLastFragment();
                return !lastFragment.confirmingTries || lastFragment.confirmingTries < 3;
            };
            Command.prototype.askForConfirmation = function () {
                var lastFragment = this.getLastFragment();
                lastFragment.attemptConfirmation();
            };
            return Command;
        }());
        speech.Command = Command;
        var CommandFragment = (function () {
            function CommandFragment(commandNode, parentFragment) {
                if (parentFragment === void 0) { parentFragment = null; }
                this.commandNode = commandNode;
                this.parentFragment = parentFragment;
                this.confirmingTries = 0;
                this.words = [];
                this.childFragments = [];
                if (parentFragment) {
                    parentFragment.childFragments.push(this);
                }
            }
            CommandFragment.prototype.keyMatches = function (value) {
                var keys = this.commandNode.keys;
                return keys.some(function (key) {
                    return key === value;
                });
            };
            CommandFragment.prototype.attemptConfirmation = function () {
                this.confirmingTries++;
            };
            CommandFragment.prototype.confirm = function () {
                this.confirmed = true;
            };
            CommandFragment.prototype.isConfirming = function () {
                return this.confirmingTries && !this.confirmed;
            };
            CommandFragment.prototype.confirmIfNecessary = function () {
                if (this.confirmingTries) {
                    this.confirmed = true;
                    return true;
                }
                return false;
            };
            CommandFragment.prototype.addWord = function (word) {
                this.words.push(word);
            };
            return CommandFragment;
        }());
        speech.CommandFragment = CommandFragment;
    })(speech = to.speech || (to.speech = {}));
})(to || (to = {}));
//# sourceMappingURL=SpeechModel.js.map
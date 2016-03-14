///<reference path="../imports.ts"/>
/**
 * Created by Papa on 2/8/2016.
 */
var to;
(function (to) {
    var speech;
    (function (speech) {
        var SpeechEngine = (function () {
            function SpeechEngine(voiceEngine) {
                var _this = this;
                this.voiceEngine = voiceEngine;
                this.phraseSubject = new Rx.Subject();
                this.wordSubject = new Rx.Subject();
                //var recognition = new SpeechRecognition();
                var recognition = new webkitSpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.onresult = function (event) {
                    /*
                     event.results[i] – the array containing recognition result objects. Each array element corresponds to a recognized word on the i recognition stage.
                     event.resultIndex – the current recognition result index.
                     event.results[i][j] – the j-th alternative of a recognized word. The first element is a mostly probable recognized word.
                     event.results[i].isFinal – the Boolean value that shows whether this result is final or interim.
                     event.results[i][ j].transcript – the text representation of a word.
                     event.results[i][ j].confidence – the probability of the given word correct decoding (value from 0 to 1).
                     */
                    //if(event.results.length > 0) {
                    //  let text = event.results[0][0].transcript;
                    //}
                    for (var i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            var allOptions = event.results[i];
                            var text = allOptions[0].transcript;
                            if (allOptions.length > 1) {
                                for (var j = 0; j < allOptions.length; j++) {
                                    console.log(allOptions[j].transcript);
                                }
                            }
                            _this.phraseSubject.onNext(text);
                        }
                    }
                };
                this.recognition = recognition;
                this.run();
                this.phraseSubject.subscribe(function (phrase) {
                    _this.processPhrase(phrase);
                });
                this.wordSubject.subscribe(function (word) {
                    _this.processWord(word);
                });
            }
            SpeechEngine.prototype.run = function () {
                // TODO: maintain the session open, re-open if needed
                // restart the session if it ended after 60 seconds
                this.recognition.start();
                //recognition.stop();
            };
            SpeechEngine.prototype.processPhrase = function (//
                command //
                ) {
                var _this = this;
                if (!command) {
                    return;
                }
                console.log('CMD: ' + command);
                //jQuery('#text-recognition-result').val(command);
                var words = command.trim().toLowerCase().split(' ');
                words.forEach(function (word) {
                    _this.wordSubject.onNext(word);
                });
            };
            // Process a word
            SpeechEngine.prototype.processWord = function (//
                word //
                ) {
                var _this = this;
                this.lastWordTime = new Date();
                // If a command is in progress
                if (this.currentCommandDriver) {
                    try {
                        // If there are no more words required for the command
                        if (!this.currentCommandDriver.next(word)) {
                            this.executeCurrentCommand();
                        }
                    }
                    catch (error) {
                        this.recognition.stop();
                        // Notify the user of the invalid command
                        this.voiceEngine.invalidCommand(error).then(function () {
                            _this.recognition.start();
                        });
                    }
                }
                else 
                // If the "Computer" keyword matched
                if (speech.wordMatchesKeyOrDictionary('organizer', word)) {
                    // Start a new command
                    this.currentCommandDriver = new speech.SpeechCommandDriver();
                    // Wait for 5 seconds before attempting to run the command if nothing else is spoken
                    this.setupLoopbackCheck(4000);
                }
            };
            SpeechEngine.prototype.setupLoopbackCheck = function (//
                timeout //
                ) {
                var _this = this;
                setTimeout(function () {
                    // If a command isn't in progress
                    if (!_this.currentCommandDriver) {
                        // don't have to keep on checking
                        return;
                    }
                    // If a command is now complete
                    if (_this.currentCommandDriver.command.isComplete()) {
                        _this.executeCurrentCommand();
                    }
                    else {
                        var now = new Date();
                        var millisSinceLastWord = now.getTime() - _this.lastWordTime.getTime();
                        var checkInMillis = 4000 - millisSinceLastWord;
                        // If is still time between the last spoken word and the maximum timeout
                        if (checkInMillis > 0) {
                            // Try again when the maximum timeout expires
                            _this.setupLoopbackCheck(checkInMillis);
                        }
                        else 
                        // Maximum timeout has passed
                        {
                            _this.executeCurrentCommand();
                        }
                    }
                }, timeout);
            };
            SpeechEngine.prototype.executeCurrentCommand = function () {
                var _this = this;
                this.recognition.stop();
                var commandDriver = this.currentCommandDriver;
                this.currentCommandDriver = null;
                if (commandDriver.command.isComplete()) {
                    if (commandDriver.command.canConfirm()) {
                        this.confirmCommand(commandDriver);
                    }
                    else {
                    }
                }
                else {
                    var commandString = commandDriver.getCommandString();
                    this.voiceEngine.incompleteCommand(commandString).then(function () {
                        _this.recognition.start();
                    });
                }
                commandDriver = null;
            };
            SpeechEngine.prototype.confirmCommand = function (commandDriver) {
                var _this = this;
                var commandString = commandDriver.getCommandString();
                this.voiceEngine.confirmCommand(commandString).then(function () {
                    commandDriver.command.askForConfirmation();
                    _this.recognition.start();
                    // TODO: execute the command
                    console.log('Executing: ' + commandString);
                });
            };
            return SpeechEngine;
        }());
        speech.SpeechEngine = SpeechEngine;
        angular.module('organizator').service('speechEngine', SpeechEngine);
    })(speech = to.speech || (to.speech = {}));
})(to || (to = {}));
//# sourceMappingURL=SpeechEngine.js.map
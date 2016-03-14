///<reference path="../imports.ts"/>
/**
 * Created by Papa on 2/10/2016.
 */
// MUST be a global var so that it won't get garbage collected before onEnd is fired
var LAST_UTTERANCE;
var to;
(function (to) {
    var speech;
    (function (speech) {
        var VoiceEngine = (function () {
            function VoiceEngine() {
                this.synth = window['speechSynthesis'];
            }
            VoiceEngine.prototype.speak = function (phrase) {
                var _this = this;
                LAST_UTTERANCE = new SpeechSynthesisUtterance(phrase);
                //var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
                //for(i = 0; i < voices.length ; i++) {
                //  if(voices[i].name === selectedOption) {
                //    utterThis.voice = voices[i];
                //  }
                //}
                //utterThis.pitch = pitch.value;
                //utterThis.rate = rate.value;
                return new Promise(function (resolve) {
                    LAST_UTTERANCE.onend = resolve;
                    _this.synth.speak(LAST_UTTERANCE);
                });
            };
            VoiceEngine.prototype.confirmCommand = function (command) {
                var echo = command + ". Is this correct?";
                // TODO: generate echo sound
                return this.speak(echo);
            };
            VoiceEngine.prototype.invalidCommand = function (command) {
                var error = "Invalid command: " + command;
                // TODO: generate error sound
                return this.speak(error);
            };
            VoiceEngine.prototype.incompleteCommand = function (command) {
                var error = "Incomplete command: " + command;
                // TODO: generate error sound
                return this.speak(error);
            };
            return VoiceEngine;
        }());
        speech.VoiceEngine = VoiceEngine;
        angular.module('organizator').service('voiceEngine', VoiceEngine);
    })(speech = to.speech || (to.speech = {}));
})(to || (to = {}));
//# sourceMappingURL=VoiceEngine.js.map
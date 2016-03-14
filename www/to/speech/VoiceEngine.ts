///<reference path="../imports.ts"/>
/**
 * Created by Papa on 2/10/2016.
 */

declare var SpeechSynthesisUtterance;

// MUST be a global var so that it won't get garbage collected before onEnd is fired
var LAST_UTTERANCE;

module to.speech {

  export class VoiceEngine {

    synth = window['speechSynthesis'];

    speak(
      phrase:string
    ):Promise<any> {
      LAST_UTTERANCE = new SpeechSynthesisUtterance(phrase);
      //var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
      //for(i = 0; i < voices.length ; i++) {
      //  if(voices[i].name === selectedOption) {
      //    utterThis.voice = voices[i];
      //  }
      //}
      //utterThis.pitch = pitch.value;
      //utterThis.rate = rate.value;

      return new Promise((
        resolve
      )=> {
        LAST_UTTERANCE.onend = resolve;
        this.synth.speak(LAST_UTTERANCE);
      });
    }

    confirmCommand(
      command:string
    ):Promise<any> {
      let echo = `${command}. Is this correct?`;
      // TODO: generate echo sound
      return this.speak(echo);
    }

    invalidCommand(
      command:string
    ):Promise<any> {
      let error = `Invalid command: ${command}`;
      // TODO: generate error sound
      return this.speak(error);
    }

    incompleteCommand(
      command:string
    ):Promise<any> {
      let error = `Incomplete command: ${command}`;
      // TODO: generate error sound
      return this.speak(error);
    }
  }

  angular.module('organizator').service('voiceEngine', VoiceEngine);
}

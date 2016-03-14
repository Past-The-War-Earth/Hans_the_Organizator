///<reference path="../imports.ts"/>
/**
 * Created by Papa on 2/8/2016.
 */

declare var webkitSpeechRecognition;

declare var Rx;

module to.speech {

  export class SpeechEngine {

    lastWordTime:Date;
    phraseSubject = new Rx.Subject();
    recognition:SpeechRecognition;
    wordSubject = new Rx.Subject();

    currentCommandDriver:SpeechCommandDriver;

    constructor(
      private voiceEngine:VoiceEngine
    ) {
      //var recognition = new SpeechRecognition();
      let recognition:SpeechRecognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = ( event ) => {
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
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            let allOptions = event.results[i];
            let text = allOptions[0].transcript;
            if (allOptions.length > 1) {
              for (let j = 0; j < allOptions.length; j++) {
                console.log(allOptions[j].transcript);
              }
            }
            this.phraseSubject.onNext(text);
          }
        }
      };

      this.recognition = recognition;

      this.run();

      this.phraseSubject.subscribe((
        phrase:string
      ) => {
        this.processPhrase(phrase);
      });

      this.wordSubject.subscribe((
        word:string
      ) => {
        this.processWord(word);
      });
    }

    run() {
      // TODO: maintain the session open, re-open if needed
      // restart the session if it ended after 60 seconds
      this.recognition.start();
      //recognition.stop();
    }

    processPhrase( //
      command:string //
    ):void {
      if (!command) {
        return;
      }
      console.log('CMD: ' + command);
      //jQuery('#text-recognition-result').val(command);
      let words = command.trim().toLowerCase().split(' ');
      words.forEach(( word ) => {
        this.wordSubject.onNext(word);
      });
    }

    // Process a word
    processWord( //
      word:string //
    ):void {
      this.lastWordTime = new Date();
      // If a command is in progress
      if (this.currentCommandDriver) {
        try {
          // If there are no more words required for the command
          if (!this.currentCommandDriver.next(word)) {
            this.executeCurrentCommand();
          }
        } catch (error) {
          this.recognition.stop();
          // Notify the user of the invalid command
          this.voiceEngine.invalidCommand(error).then(()=> {
            this.recognition.start();
          });
        }
      } else
      // If the "Computer" keyword matched
      if (wordMatchesKeyOrDictionary('organizer', word)) {
        // Start a new command
        this.currentCommandDriver = new SpeechCommandDriver();
        // Wait for 5 seconds before attempting to run the command if nothing else is spoken
        this.setupLoopbackCheck(4000);
      }
    }

    setupLoopbackCheck( //
      timeout:number //
    ) {
      setTimeout(() => {
        // If a command isn't in progress
        if (!this.currentCommandDriver) {
          // don't have to keep on checking
          return;
        }
        // If a command is now complete
        if (this.currentCommandDriver.command.isComplete()) {
          this.executeCurrentCommand();
        } else {
          let now = new Date();
          let millisSinceLastWord = now.getTime() - this.lastWordTime.getTime();
          let checkInMillis = 4000 - millisSinceLastWord;
          // If is still time between the last spoken word and the maximum timeout
          if (checkInMillis > 0) {
            // Try again when the maximum timeout expires
            this.setupLoopbackCheck(checkInMillis);
          }
          else
          // Maximum timeout has passed
          {
            this.executeCurrentCommand();
          }
        }
      }, timeout);
    }

    executeCurrentCommand() {
      this.recognition.stop();

      let commandDriver = this.currentCommandDriver;
      this.currentCommandDriver = null;
      if (commandDriver.command.isComplete()) {
        if (commandDriver.command.canConfirm()) {
          this.confirmCommand(commandDriver);
        } else {
          // FIXME TODO: work here next!!!
        }
      } else {
        let commandString = commandDriver.getCommandString();
        this.voiceEngine.incompleteCommand(commandString).then(()=> {
          this.recognition.start();
        });
      }

      commandDriver = null;
    }

    confirmCommand(
      commandDriver:SpeechCommandDriver
    ):void {
      let commandString = commandDriver.getCommandString();
      this.voiceEngine.confirmCommand(commandString).then(()=> {
        commandDriver.command.askForConfirmation();
        this.recognition.start();
        // TODO: execute the command
        console.log('Executing: ' + commandString);
      })
    }
  }

  angular.module('organizator').service('speechEngine', SpeechEngine);
}

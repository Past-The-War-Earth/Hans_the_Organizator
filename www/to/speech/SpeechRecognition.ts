/**
 * Created by Papa on 2/7/2016.
 */

interface SpeechRecognition {
  grammars:SpeechGrammarList;
  lang:string;
  continuous:boolean;
  interimResults:boolean;
  maxAlternatives:number;
  serviceURI:string;

  start():void;
  stop():void;
  abort():void;

  onaudiostart;
  onsoundstart;
  onspeechstart;
  onspeechend;
  onsoundend;
  onaudioend;
  onresult:(event:SpeechEvent)=>void;
  onnomatch;
  onerror;
  onstart;
  onend;

}

interface SpeechEvent {
  resultIndex:number;
  results:any //SpeechResult[];
}

interface SpeechResult {
  //SpeechOption[];
  isFinal:boolean;
}

interface SpeechOption {
  transcript:string;
}

interface SpeechGrammarList {

}


interface SpeechSynthesis {
  // Read-only
  pending:boolean;
  speaking:boolean;
  paused:boolean;

  speak(utterance:SpeechSynthesisUtterance):void;
  cancel():void;
  pause():void;
  resume():void;
  getVoices():SpeechSynthesisVoiceList;

  onstart;
  onend;
  onerror;
  onpause;
  onresume;
  onmark;
  onboundary;

}

interface SpeechSynthesisUtterance {
  text:string;
  lang:string;
  voiceURI:string;
  volume:number;
  rate:number;
  pitch:number;
}

interface SpeechSynthesisVoiceList {

}

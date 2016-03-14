///<reference path="../imports.ts"/>
/**
 * Created by mark on 4/11/15.
 */

module to.common {

    export enum Event {
        DONE_MODIFYING
    }

    /**
     * When the controllers don't get unloaded, the EventBus will notify them
     * that something happened.
     */
    export class EventBus {

        listenersByEvent:{[event:number]:
            {[name:string]:{
                listener:Component;
                callback:()=>void;
            }}
        } = {};

        listen(event:Event, listener:Component, callback:()=>void) {
            var eventListeners = this.listenersByEvent[event];
            if(!eventListeners) {
                eventListeners = this.listenersByEvent[event] = {};
            }
            var listenerRecord =  {
                listener: listener,
                callback: callback
            };
            eventListeners[listener.name] = listenerRecord;
        }

        fire(event:Event, ...args) {
            var eventListeners = this.listenersByEvent[event];
            if(!eventListeners) {
                return;
            }
            for(var listenerName in eventListeners) {
                var listenerRecord = eventListeners[listenerName];
                listenerRecord.callback.apply(listenerRecord.listener, args);
            }
        }

    }

    export var pEventBus = new EventBus();
}

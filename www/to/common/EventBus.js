///<reference path="../imports.ts"/>
/**
 * Created by mark on 4/11/15.
 */
var to;
(function (to) {
    var common;
    (function (common) {
        (function (Event) {
            Event[Event["DONE_MODIFYING"] = 0] = "DONE_MODIFYING";
        })(common.Event || (common.Event = {}));
        var Event = common.Event;
        /**
         * When the controllers don't get unloaded, the EventBus will notify them
         * that something happened.
         */
        var EventBus = (function () {
            function EventBus() {
                this.listenersByEvent = {};
            }
            EventBus.prototype.listen = function (event, listener, callback) {
                var eventListeners = this.listenersByEvent[event];
                if (!eventListeners) {
                    eventListeners = this.listenersByEvent[event] = {};
                }
                var listenerRecord = {
                    listener: listener,
                    callback: callback
                };
                eventListeners[listener.name] = listenerRecord;
            };
            EventBus.prototype.fire = function (event) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var eventListeners = this.listenersByEvent[event];
                if (!eventListeners) {
                    return;
                }
                for (var listenerName in eventListeners) {
                    var listenerRecord = eventListeners[listenerName];
                    listenerRecord.callback.apply(listenerRecord.listener, args);
                }
            };
            return EventBus;
        }());
        common.EventBus = EventBus;
        common.pEventBus = new EventBus();
    })(common = to.common || (to.common = {}));
})(to || (to = {}));
//# sourceMappingURL=EventBus.js.map
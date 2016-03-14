///<reference path="../imports.ts"/>

/**
 * Created by artem on 3/29/15.
 */

module to.common {

	export class Logger {
		constructor
		(private componentName:string) {
		}

		trace
		(message:string) {
			console.log('TRACE: ' + new Date() + '[' + this.componentName + ']' + message);
		}

		debug
		(message:string) {
			console.log('DEBUG: ' + new Date() + '[' + this.componentName + ']' + message);
		}
	}
}
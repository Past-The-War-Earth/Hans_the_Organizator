///<reference path="../imports.ts"/>
/**
 * Created by artem on 4/11/15.
 */

module to.common {

    export class Breadcrumb {

        separator = '~';
        breadcrumbs:string[] = [''];

        constructor($stateParams) {
            if ($stateParams.breadcrumbs) {
                this.breadcrumbs = $stateParams.breadcrumbs.split(this.separator);
            }
        }

        back(params:any) {
            var lastState = this.breadcrumbs.pop();
            params.breadcrumbs = this.breadcrumbs.join(this.separator);

            return lastState;
        }

        forward
        (params:any,
         toState:string) {
            var copy = this.breadcrumbs.slice(0);
            copy.push(toState);

            params.breadcrumbs = copy.join(this.separator);

            return toState;
        }

        addCrumb(state:string) {
            this.breadcrumbs.push(state);
        }
    }
}
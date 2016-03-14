///<reference path="../imports.ts"/>

/**
 * Created by artem on 4/4/15.
 */
module to.model {
	export interface Motivation extends ContainerObject {
		comments:string[];
		description:string;
		impact;
		positive:boolean;
	}
}
///<reference path="../imports.ts"/>
/**
 * Created by artem on 4/28/15.
 */

module to.model {

	export interface DbObject {
		_id?:string;
		_rev?:string;
		cacheIndex?:number;
		createdDate?:Date;
		type:string;
		updatedDate?:Date;
	}
}
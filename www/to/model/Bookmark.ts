///<reference path="../imports.ts"/>

/**
 * Created by artem on 6/27/15.
 */

module to.model {

	export interface DbBookmark extends DbObject {
		categoryId?:string;
		hasCategoryFilter?:boolean;
		hasEisenhowerFilter?:boolean;
		hasFilters?:boolean;
		hasKanbanPlannedFilter?:boolean;
		hasKanbanReadyFilter?:boolean;
		hasKanbanInProgressFilter?:boolean;
		hasKanbanRecentlyDoneFilter?:boolean;
		hasMotivationFilter?:boolean;
		kanbanState?:string;
		motivationId?:string;
		orderIndex?:number;
		priorities?:string;
		stateName:string;
		urgencies?:string;
	}

	export interface Bookmark {
		category?:Category;
		dbBookmark:DbBookmark;
		motivation?:Motivation;
		kanbanStateLabel?:string;
	}
}

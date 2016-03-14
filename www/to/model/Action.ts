///<reference path="../imports.ts"/>
/**
 * Created by artem on 3/25/15.
 */

module to.model {

	export interface Action extends DbObject {
    adviceIds:string[];
    afterActionIds:string[];
		archived:boolean;
		archivedDate?:Date;
    beforeActionIds:string[];
		cacheIndex?:number;
		canceled?:boolean;
		categoryIds?:string[];
		dueDate:Date;
		doneDate?:Date;
		estimationBased:boolean;
		kanbanState;
		lastNumDaysInPlanning:number;
		lastNumDaysInProgress:number;
		lastNumDaysInReady:number;
		motivationIds?:string[];
		states:ActionState[];
		numBackMoves:number;
		numDaysInPlanning:number;
		numDaysInProgress:number;
		numDaysInReady:number;
		originalDoneDate?:Date;
		originalPlannedDate:Date;
		originalReadyDate?:Date;
		originalStartDate?:Date;
		phrase:string;
		plannedDate:Date;
		priority:string;
		readyDate?:Date;
		startDate?:Date;
		verbBased:boolean;
	}

	export interface ActionState {
		fromDate:Date;
		number:number;
		numDays?:number;
		state:number;
	}
}

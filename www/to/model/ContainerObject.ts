///<reference path="../imports.ts"/>

/**
 * Created by artem on 6/27/15.
 */

module to.model {

	export interface ContainerObject extends DbObject {
		// TODO
		avgActionPriority:number;
		avgCompletionTime:number;
		avgTimeInPlanning:number;
		avgTimeInProgress:number;
		avgTimeInReady:number;
		helpLevel:number;
		// TODO
		numActions:number;
		numCanceledActions:number;
		numCompleteActions:number;
		numInProgressActions:number;
		numPlannedActions:number;
		numReadyActions:number;
		numRevertedActions:number;

		position?:number;
	}
}

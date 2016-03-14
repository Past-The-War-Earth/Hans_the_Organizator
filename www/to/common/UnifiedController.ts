///<reference path="../imports.ts"/>

/**
 * Created by artem on 7/12/15.
 */

module to.common {


	export var matrixColors:string[][] = [
		['BBBBFF', 'BBBBEE', 'BBBBDD', 'BBBBCC', 'BBBBBB'],
		['BBFFFF', 'BBEEEE', 'BBDDDD', 'BBCCCC', 'BBBBBB'],
		['BBFFBB', 'BBEEBB', 'BBDDBB', 'BBCCBB', 'BBBBBB'],
		['FFFFBB', 'EEEEBB', 'DDDDBB', 'CCCCBB', 'BBBBBB'],
		//['FFCCBB', 'EECCBB', 'DDCCBB', 'CCBBBB' , 'BBBBBB'],
		['FFBBBB', 'EEBBBB', 'DDBBBB', 'CCBBBB', 'BBBBBB']
	];

	export var selectedMatrixColors:string[][] = [
		['7777FF', '7777DD', '7777BB', '777799', '777777'],
		['77FFFF', '77DDDD', '77BBBB', '779999', '777777'],
		['77FF77', '77DD77', '77BB77', '779977', '777777'],
		['FFFF77', 'DDDD77', 'BBBB77', '999977', '777777'],
		//['FF99BB', 'BB99BB', 'BB99BB', '99BBBB' , 'BBBBBB'],
		['FF7777', 'DD7777', 'BB7777', '997777', '777777']
	];

	export var urgencyColors:string[] = [
		'BBBBFF', 'BBFFFF', 'BBFFBB', 'FFFFBB', 'FFBBBB'
	];
	export var selectedUrgencyColors:string[] = [
		'7777FF', '77FFFF', '77FF77', 'FFFF77', 'FF7777'
	];
	export var priorityColors:string[] = [
		'FFFFFF', 'EEEEEE', 'DDDDDD', 'CCCCCC', 'BBBBBB'
	];
	export var selectedPriorityColors:string[] = [
		'FFFFFF', 'DDDDDD', 'BBBBBB', '999999', '777777'
	];

  export interface UnifiedController {

  }

	export interface UnifiedControllerHandler {

		onUrgencyColumnClick(clickedUrgency:number):void;
		getSelectedUrgencyStyle(urgency:number):any;
		getSelectedUrgencyLabelClass(urgency:number):string;
		onPriorityRowClick(clickedPriority:number):void;
		getSelectedPriorityStyle(priority:number);
		getSelectedPriorityLabelClass(urgency:number):string;

		//selectPlanned():void;
		//getPlannedButtonClass():string;
		//selectReady():void;
		//getReadyButtonClass():string;
		//getReadyLabelClass():string;
		//selectInProgress():void;
		//getInProgressButtonClass():string;
		//getInProgressLabelClass():string;

	}


}

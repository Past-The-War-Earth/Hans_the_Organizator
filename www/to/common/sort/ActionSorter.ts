///<reference path="../../imports.ts"/>

/**
 * Created by artem on 5/14/15.
 */

module to.common.sort {

	export class ActionSorter extends Sorter {

		constructor
		($ionicPopup,
		 $scope:angular.IScope,
		 private actions:to.model.Action[],
		 pickState:SortState) {
			super($ionicPopup, $scope, pickState);
		}

		showSortPopup() {
			super.showSortPopup('to/common/sort/SortActionsPopupView.html');
		}

		sort() {
			this.actions.sort(sortActions);
		}

		getSortSymbol() {
			switch (currentSortState.sortBy) {
				case 'CREATED':
					return '<i class="fa fa-lightbulb-o"></i>';
				case 'NAME':
					return '<i class="icon-quill name-sort"></i>';
				case 'PRIORITY':
					return '<i class="icon-list-numbered priority-sort"></i>';
				case 'MODIFIED':
					return '<i class="fa fa-save updated-date-sort"></i>';
				case 'URGENCY':
					return '<i class="fa fa-clock-o urgency-sort"></i>';
			}
		}

		getSortedProperty(action:to.model.Action):string {
			switch (this.getCurrentSortState().sortBy) {
				case 'CREATED':
					return action.createdDate.toLocaleDateString();
				case 'MODIFIED':
					return action.updatedDate.toLocaleDateString();
				case 'NAME':
				case 'PRIORITY':
				case 'URGENCY':
					return '';
			}
		}

	}

	function sortActions
	(action1:to.model.Action,
	 action2:to.model.Action) {
		var value1;
		var value2;
		switch (currentSortState.sortBy) {
			case 'CREATED':
				value1 = action1.createdDate;
				value2 = action2.createdDate;
				break;
			case 'NAME':
				value1 = action1.phrase.toLocaleLowerCase();
				value2 = action2.phrase.toLocaleLowerCase();
				break;
			case 'PRIORITY':
				value1 = action1.priority;
				value2 = action2.priority;
				break;
			case 'MODIFIED':
				value1 = action1.updatedDate;
				value2 = action2.updatedDate;
				break;
			case 'URGENCY':
				// Flip the dates for urgency
				value1 = action2.dueDate;
				value2 = action1.dueDate;
				break;
		}
		if (!currentSortState.ascending) {
			var tempValue = value1;
			value1 = value2;
			value2 = tempValue;
		}
		if (value1 > value2) {
			return 1;
		} else if (value2 > value1) {
			return -1;
		}
		return 0;
	}
}

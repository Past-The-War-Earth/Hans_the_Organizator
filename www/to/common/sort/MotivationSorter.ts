///<reference path="../../imports.ts"/>

/**
 * Created by artem on 5/14/15.
 */

module to.common.sort {

	export class MotivationSorter extends Sorter {

		constructor
		($ionicPopup,
		 $scope:angular.IScope,
		 private motivations:to.model.Motivation[],
		 pickState:SortState) {
			super($ionicPopup, $scope, pickState);
		}

		showSortPopup() {
			super.showSortPopup('to/common/sort/SortMotivationsPopupView.html');
		}

		sort() {
			this.motivations.sort(sortMotivations);
		}

		getSortSymbol() {
			switch (currentSortState.sortBy) {
				case 'IMPACT':
					return '<i class="fa fa-smile-o urgency-sort"></i>';
				case 'NAME':
					return '<i class="icon-quill name-sort"></i>';
				case 'NUM_PLANNED':
					return '<i class="fa fa-briefcase planned-sort"></i>';
				case 'NUM_READY':
					return '<i class="ion-clipboard ion-icon-sort"></i>';
				case 'NUM_IN_PROGRESS':
					return '<i class="ion-hammer ion-icon-sort"></i>';
			}
		}

	}

	function sortMotivations
	(motivation1:to.model.Motivation,
	 motivation2:to.model.Motivation) {
		var value1;
		var value2;
		switch (currentSortState.sortBy) {
			case 'IMPACT':
				value1 = motivation1.impact;
				value2 = motivation2.impact;
				break;
			case 'NAME':
				value1 = motivation1.description.toLocaleLowerCase();
				value2 = motivation2.description.toLocaleLowerCase();
			case 'NUM_IN_PROGRESS':
				value1 = motivation1.numInProgressActions;
				value2 = motivation2.numInProgressActions;
				break;
			case 'NUM_PLANNED':
				value1 = motivation1.numPlannedActions;
				value2 = motivation2.numPlannedActions;
				break;
				break;
			case 'NUM_READY':
				value1 = motivation1.numReadyActions;
				value2 = motivation2.numReadyActions;
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

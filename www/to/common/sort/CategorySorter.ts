///<reference path="../../imports.ts"/>

/**
 * Created by artem on 5/14/15.
 */

module to.common.sort {

	export class CategorySorter extends Sorter {

		constructor
		($ionicPopup,
		 $scope:angular.IScope,
		 private categories:to.model.Category[],
		 pickState:SortState) {
			super($ionicPopup, $scope, pickState);
		}

		showSortPopup() {
			super.showSortPopup('to/common/sort/SortCategoriesPopupView.html');
		}

		sort() {
			this.categories.sort(sortCategories);
		}


		getSortSymbol() {
			switch (currentSortState.sortBy) {
				case 'PRIORITY':
					return '<i class="icon-list-numbered priority-sort"></i>';
				case 'TIMEOUT':
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

	function sortCategories
	(category1:to.model.Category,
	 category2:to.model.Category) {
		var value1;
		var value2;
		switch (currentSortState.sortBy) {
			case 'PRIORITY':
				value1 = category1.priority;
				value2 = category2.priority;
				break;
			case 'TIMEOUT':
				value1 = category1.name.toLocaleLowerCase();
				value2 = category2.name.toLocaleLowerCase();
				break;
			case 'NUM_IN_PROGRESS':
				value1 = category1.numInProgressActions;
				value2 = category2.numInProgressActions;
				break;
			case 'NUM_PLANNED':
				value1 = category1.numPlannedActions;
				value2 = category2.numPlannedActions;
				break;
			case 'NUM_READY':
				value1 = category1.numReadyActions;
				value2 = category2.numReadyActions;
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

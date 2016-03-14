///<reference path="../../imports.ts"/>

/**
 * Created by artem on 5/9/15.
 */

module to.common.sort {

	export interface SortState {
		sortBy:string;
		ascending:boolean;
	}

	export var currentSortState:SortState = {
		sortBy: 'URGENCY',
		ascending: false
	};

	export class Sorter {

		constructor
		(private $ionicPopup,
		 private $scope:angular.IScope,
		 private pickState:SortState) {
			currentSortState = this.pickState;
		}

		showSortPopup(viewUrl:string) {
			this.pickState = JSON.parse(JSON.stringify(currentSortState));
			var sortPopup = this.$ionicPopup.show({
				templateUrl: viewUrl,
				title: 'Sort By',
				scope: this.$scope,
				buttons: [
					{text: 'Cancel'},
					{
						text: '<b>Sort</b>',
						type: 'button-positive',
						onTap: (e) => {
							this.setCurrentSortState();
							this.sort();
							return true;
						}
					}
				]
			});
		}

		sort() {
			// abstract
		}

		getCurrentSortState() {
			return currentSortState;
		}

		setCurrentSortState() {
			currentSortState = this.pickState;
			console.log('sorting by: ' + currentSortState.sortBy + ', ascending: ' + currentSortState.ascending);
		}

		getSortOrderLabel() {
			return this.pickState.ascending ? 'Ascending' : 'Descending';
		}

		getSortOrderStyle() {
			return currentSortState.ascending ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc';
		}

	}

}
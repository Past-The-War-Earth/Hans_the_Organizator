///<reference path="../imports.ts"/>

/**
 * Created by artem on 3/28/15.
 */

module to.common {

	export class CategoryController extends BranchComponent {

		category:to.model.Category;

		priorityOptions = [
			'Peripheral',
			'Minor',
			'Significant',
			'Crucial',
			'Paramount'
		];

		constructor
		($ionicHistory,
		 $scope:angular.IScope,
		 $state:angular.ui.IStateService,
		 name:string,
		 title:string) {
			super($ionicHistory, $scope, $state, name, title);
		}


		getPriorityLabel() {
			var priority = 'N/A';
			if (this.category) {
				priority = this.priorityOptions[this.category.priority];
			}
			return 'Category\'s priority? ' + this.getInputValue(priority);
		}

		getCategoryPriority() {
			var priority = 'N/A';
			if (this.category) {
				priority = this.priorityOptions[this.category.priority];
			}
			return this.getInputValue(priority);
		}

		getCoachingLabel() {
			var coaching = 'N/A';
			if (this.category) {
				coaching = to.common.getCoachingLabel(this.category.helpLevel);
			}
			return this.getInputValue(coaching);
		}
	}

}

///<reference path="../imports.ts"/>
/**
 * Created by artem on 3/29/15.
 */

module to.common {

	export class Component {
		Kanban = to.common.Kanban;
		Priority = to.common.Priority;
		Urgency = to.common.Urgency;
		protected logger:Logger;
		name:string;
		viewTitle:string;
		searchText:string;

		constructor
		(protected $scope:angular.IScope,
		 protected $state:angular.ui.IStateService,
		 name:string,
		 viewTitle:string) {
			this.logger = new Logger(name);
			this.name = name;
			this.viewTitle = viewTitle;
			to.common.setTheme(viewTitle);
		}

		afterDataLoad() {
			this.$scope.$apply();
			setTimeout(()=> {
				jQuery('.org-back-button').show();
				autosize(jQuery('textarea'));
			}, 100);
		}

		getInputValue
		(value):string {
			return `<span class="to-value">${value}</span>`;
		}

		listen(event:Event, callback:()=>void) {
			pEventBus.listen(event, this, callback);
		}

		fire(event:Event, ...args) {
			pEventBus.fire(event, args);
		}

		getCategoryPriorityClass(category:to.model.Category, diffSize:boolean) {
			if (!category) {
				return '';
			}
			return to.common.getPriorityClass(category.priority, diffSize);
		}

		getCategoryCoachingClass(category:to.model.Category) {
			if (!category) {
				return '';
			}
			return to.common.getCoachingClass(category.helpLevel);
		}

		getCategoryTeacherPhrase(category:to.model.Category) {
			if (!category) {
				return '';
			}
			return to.common.getCoachingLabel(category.helpLevel);
		}

		getMotivationImpactClass(motivation:to.model.Motivation) {
			if (!motivation) {
				return '';
			}
			return to.common.getImpactClass(motivation);
		}

		getMotivationCoachingClass(motivation:to.model.Motivation) {
			if (!motivation) {
				return '';
			}
			return to.common.getCoachingClass(motivation.helpLevel);
		}

		getMotivationTeacherPhrase(motivation:to.model.Motivation) {
			if (!motivation) {
				return '';
			}
			return to.common.getCoachingLabel(motivation.helpLevel);
		}

		getUrgencyClass(action:to.model.Action) {
			return to.common.getUrgencyClass(to.common.getUrgencyOfAction(action));
		}

		getPriorityClass(action:to.model.Action) {
			return to.common.getPriorityClass(action.priority);
		}

		actionIsNotDone(action:to.model.Action) {
			return action.kanbanState != this.Kanban.RecentlyDone && action.kanbanState != this.Kanban.Archived;
		}

		editAction(action:to.model.Action) {
			this.$state.go(to.common.states.EDIT_ACTION, {actionId: action._id});
		}
	}

	/**
	 * You can only go back from a leaf component.
	 */
	export class LeafComponent extends Component {

		back() {
			this.fire(Event.DONE_MODIFYING);
			window.history.back();
		}

	}

	/**
	 * You can go to other views from a branch component
	 */
	export class BranchComponent extends Component {

		constructor
		(private $ionicHistory,
		 $scope:angular.IScope,
		 $state:angular.ui.IStateService,
		 name:string,
		 viewTitle:string) {
			super($scope, $state, name, viewTitle);
			this.listen(Event.DONE_MODIFYING, this.reload);
		}

		reload(initial = true) {
			// Reload the data here
		}

		back() {
			this.doneModifying();
			this.$ionicHistory.goBack();
		}

		doneModifying() {
			this.fire(Event.DONE_MODIFYING, false);
		}

	}
}
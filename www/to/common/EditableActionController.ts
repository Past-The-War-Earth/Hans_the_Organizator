///<reference path="../imports.ts"/>

/**
 * Created by artem on 3/27/15.
 */

module to.common {

	export class EditableActionController extends ActionController {

		dueValue:number = 1;
		dueRemainderDays:number = 0;
		urgency:number = 2;

		constructor
		($ionicHistory,
		 $scope:angular.IScope,
		 $state:angular.ui.IStateService,
     actionService:to.act.ActionService,
     categoryRepository:to.storage.CategoryRepository,
     motivationRepository:to.storage.MotivationRepository,
		 name:string,
		 title:string) {
			super($ionicHistory, $scope, $state, actionService, categoryRepository, motivationRepository, name, title);
		}

		getPriorityModeButtonIcon() {
			if(!this.action) {
				return '';
			}
			return this.action.verbBased ? 'fa-user' : 'fa-university';
		}

		getEntryMode() {
			if(!this.action) {
				return '';
			}
			return this.action.verbBased ? 'Quick Entry' : 'Detailed Entry';
		}

		togglePriorityMode() {
			this.action.verbBased = !this.action.verbBased;
		}

		getUrgencyModeButtonIcon() {
			if(!this.action) {
				return '';
			}
			// TODO: add calendar mode icon (to switch to estimation based)
			return this.action.estimationBased ? 'fa-calculator' : 'fa-calendar';
		}

		toggleUrgencyMode() {
			this.action.estimationBased = !this.action.estimationBased;
		}

		getDuePeriod() {
			if (!this.action) {
				return 'N/A';
			}
			var prefix = ''
			if(this.urgency == this.Urgency.Weeks || this.urgency == this.Urgency.Years) {
				prefix = '<b>~</b> '
			}
			var primaryPeriod = super.getInputValue(to.common.getUrgencyLabel(this.urgency));
			if (this.dueRemainderDays) {
				primaryPeriod += ` and ${prefix}${this.dueRemainderDays} days`;
			}
			return primaryPeriod;
		}

		getUrgencyIcon() {
			return to.common.getUrgencyInlineIcon(this.urgency);
		}

		dueEstimationChanged() {
			this.action.dueDate = to.common.getActionDueDate(this);
		}

		dueDateChanged() {
			// Convert to day only
			this.action.dueDate = new Date(this.action.dueDate.getFullYear(), this.action.dueDate.getMonth(), this.action.dueDate.getDate());
			to.common.setDueValueAndUrgency(this, this.action);
		}

		searchCategories() {
			var params:to.common.ActionDetailParameters = {
				actionId: this.action._id
			};
			this.$state.go(to.common.states.EDIT_CATEGORIES_FOR_ACTION, params);
		}

		searchMotivations() {
			var params:to.common.ActionDetailParameters = {
				actionId: this.action._id
			};
			this.$state.go(to.common.states.EDIT_MOTIVATIONS_FOR_ACTION, params);
		}

		convertRanges() {
			if (this.urgency == this.Urgency.Now) {
				this.dueValue = 1;
			}
			this.action.dueDate = to.common.getActionDueDate(this);
		}

		convertPropertyToNumber(propertyName:string) {
			if (typeof this.action[propertyName] === 'string') {
				this.action[propertyName] = parseInt(this.action[propertyName]);
			}
		}

		removeCategory(index:number) {
			this.categories.splice(index, 1);
			this.action.categoryIds.splice(index, 1);
		}

		removeMotivation(index:number) {
			this.motivations.splice(index, 1);
			this.action.motivationIds.splice(index, 1);
		}

    addBeforeAction():void {
      var params:to.common.ActionDetailParameters = {
        actionId: this.action._id
      };
      this.$state.go(to.common.states.ADD_BEFORE_ACTIONS, params);

    }

    addAfterAction():void {
      var params:to.common.ActionDetailParameters = {
        actionId: this.action._id
      };
      this.$state.go(to.common.states.ADD_AFTER_ACTIONS, params);
    }

	}

}

///<reference path="../imports.ts"/>

/**
 * Created by artem on 4/24/15.
 */

module to.common {

	export class ActionController extends to.common.ActionsController {

		action:to.model.Action;
		categories:to.model.Category[];
		motivations:to.model.Motivation[];
    beforeActions:to.model.Action[];
    afterActions:to.model.Action[];

		actionOptions = [
			'Could',
			'Would like to',
			'Should',
			'Must',
			'Need to'
		];

		constructor
		($ionicHistory,
		 $scope:angular.IScope,
		 $state,
     protected actionService:to.act.ActionService,
     categoryRepository:to.storage.CategoryRepository,
     motivationRepository:to.storage.MotivationRepository,
		 name:string,
		 title:string) {
			super($ionicHistory, $scope, $state, categoryRepository, motivationRepository, name, title);
		}

		getActionLabel() {
			if (!this.action) {
				return 'N/A';
			}
			var icon = to.common.getPriorityInlineIcon(this.action);
			if (this.action.verbBased) {
				return icon + ' ' + super.getInputValue(`I ${this.actionOptions[this.action.priority]}`);
			} else {
				return icon + ' ' + super.getInputValue(`It is ${to.common.getPriorityLabel(this.action.priority)}`);
			}
		}

		getPriorityVerb() {
			if (!this.action) {
				return 'N/A';
			}
			var icon = to.common.getPriorityInlineIcon(this.action);
			return icon + super.getInputValue(`I ${this.actionOptions[this.action.priority]}`);
		}

		asPartOfLabel() {
			if (!this.categories) {
				return 'N/A';
			}
			var labelPrefix = 'As part of ';
			if (this.categories.length) {
				return labelPrefix + super.getInputValue(this.getCategoryList());
			} else {
				return labelPrefix + 'what?';

			}
		}

		getCategoryList() {
			if (!this.categories) {
				return 'N/A';
			}
			if(this.categories.length === 0) {
				return '';
			}
			return this.categories.map((category:to.model.Category)=> {
				return category.name;
			}).reduce((labelSuffix:string, categoryName:string)=> {
				return labelSuffix + ', ' + categoryName;
			});
		}

		getKanbanLabel() {
			if (!this.action) {
				return 'State: N/A';
			}

			return `State: ${super.getInputValue(to.common.getKanbanState(this.action.kanbanState))}`;
		}

		getMotivationsList() {
			if (!this.motivations) {
				return 'N/A';
			}
			if(this.motivations.length === 0) {
				return '';
			}
			return this.motivations.map((motivation:to.model.Motivation)=> {
				return motivation.description;
			}).reduce((labelSuffix:string, motivationName:string)=> {
				return labelSuffix + ', ' + motivationName;
			});
		}

    canRemoveBeforeAction(
      doBeforeAction:to.model.Action
    ):boolean {
      return this.actionIsNotDone(doBeforeAction);
    }

    removeBeforeAction(
      doBeforeAction:to.model.Action
    ):void {
      this.actionService.removeBeforeAction(this.action, doBeforeAction);
    }

    canRemoveAfterAction(
      doAfterAction:to.model.Action
    ):boolean {
      return this.actionIsNotDone(doAfterAction);
    }

    removeAfterAction(
      doAfterAction:to.model.Action
    ):void {
      this.actionService.removeAfterAction(this.action, doAfterAction);
    }

    getNoLaterStepsMessage() {
      return 'No Later steps';
    }

    getNoEarlierStepsMessage() {
      return 'No Earlier steps';
    }

	}
}

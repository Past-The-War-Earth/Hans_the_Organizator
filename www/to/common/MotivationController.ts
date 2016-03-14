///<reference path="../imports.ts"/>

/**
 * Created by artem on 4/4/15.
 */


module to.common {

	export class MotivationController extends BranchComponent {

		motivation:to.model.Motivation;
		comment:string;

		// If don't/do 'the action' then what?
		// what that motivates you will/won't happen?

		constructor
		($ionicHistory,
		 $scope:angular.IScope,
		 $state,
		 name:string,
		 title:string) {
			super($ionicHistory, $scope, $state, name, title);
		}

		getConditionLabel
		(condition:string) {
			if (!this.motivation) {
				return 'N/A';
			}
			if (this.motivation.positive) {
				return `If you ${condition}`
			} else {
				return `If you don't ${condition}`
			}
		}

		getOutcomeLevelLabel() {
			if (!this.motivation) {
				return 'N/A';
			}
			if (this.motivation.positive) {
				return 'How Good would it be? ' + to.common.getPositiveImpactLabel(this.motivation.impact);
			} else {
				return 'How Bad would it be? ' + to.common.getNegativeImpactLabel(this.motivation.impact);
			}
		}

		getMotivationImpact() {
			var impact = 'N/A';
			if (this.motivation) {
				if (this.motivation.positive) {
					impact = to.common.getPositiveImpactLabel(this.motivation.impact);
				} else {
					impact = to.common.getNegativeImpactLabel(this.motivation.impact);
				}
			}
			return this.getInputValue(impact);
		}

		getCoachingLabel() {
			var coaching = 'N/A';
			if (this.motivation) {
				coaching = to.common.getCoachingLabel(this.motivation.helpLevel);
			}
			return this.getInputValue(coaching);
		}

		toggleImpactMode() {
			this.motivation.positive = !this.motivation.positive;
		}

		getImpactModeButtonIcon() {
			if(!this.motivation) {
				return '';
			}
			return this.motivation.positive ? 'fa-thumbs-up' : 'fa-thumbs-down';
		}
		getMinimumImpactClass() {
			if(!this.motivation) {
				return '';
			}
			return this.motivation.positive ? 'icon-neutral' : 'icon-wondering';
		}

		getMaximumImpactClass() {
			if(!this.motivation) {
				return '';
			}
			return this.motivation.positive ? 'icon-grin' : 'icon-crying';
		}

	}

}
///<reference path="../imports.ts"/>
/**
 * Created by artem on 4/11/15.
 */

module to.common {

	export interface ActionDetailParameters extends angular.ui.IStateParamsService {
		// Provided if detail (Category or Motivation) is entered for an action and not by itself
		actionId:any;
		id?:any;
		archive?:string
	}

	export interface ObjectStateParameters extends angular.ui.IStateParamsService {
		id:any;
	}

	var KANBAN_OPTIONS = [
		'Planned',
		'Ready',
		'Doing',
		'Done',
		'Archived'
	];

	export function getKanbanState(kanbanState:Kanban):string {
		return KANBAN_OPTIONS[kanbanState];
	}

	export enum Kanban {
		Planned,
		Ready,
		InProgress,
		RecentlyDone,
		Archived,
		AllIncomplete
	}

	export function getKanbanClass(kanbanState) {
		switch (parseInt(kanbanState)) {
			case Kanban.Planned:
				return 'fa-briefcase';
			case Kanban.Ready:
				return 'ion-clipboard';
			case Kanban.InProgress:
				return 'ion-hammer';
			case Kanban.RecentlyDone:
				return 'ion-checkmark-round';
			case Kanban.Archived:
				return 'fa-archive';
		}
		return '';
	}

	var COACHING_LABELS = [
		'I don\'t need no education', // fa-bell-slash-o
		'Daycare Nanny', // icon-headphones
		'School Teacher', // fa-comment-o
		'College Instructor', // fa-bullhorn
		'University Professor' // icon-podcast
	];

	export enum Coaching {
		IDontNeedNoEducation,
		DaycareNanny,
		SchoolTeacher,
		CollegeInstructor,
		UniversityProfessor
	}

	export function getCoachingLabel(coaching) {
		return COACHING_LABELS[coaching];
	}

	export function getCoachingPhrase(coaching) {
		switch (parseInt(coaching)) {
			// I Don't Need No Education
			case to.common.Coaching.IDontNeedNoEducation:
				return 'I don\'t need no education';
			// Daycare Nanny
			case to.common.Coaching.DaycareNanny:
				return 'Daycare Nanny';
			// School Teacher
			case to.common.Coaching.SchoolTeacher:
				return 'School Teacher';
			// College Instructor
			case to.common.Coaching.CollegeInstructor:
				return 'College Instructor';
			// University Professor
			case to.common.Coaching.UniversityProfessor:
				return 'University Professor';
		}
		return '';
	}

	export function getCoachingClass(coaching) {
		switch (parseInt(coaching)) {
			// I Don't Need No Education
			case to.common.Coaching.IDontNeedNoEducation:
				return 'icon-accessibility';
			// Daycare Nanny
			case to.common.Coaching.DaycareNanny:
				return 'fa-home';
			// School Teacher
			case to.common.Coaching.SchoolTeacher:
				return 'icon-office';
			// College Instructor
			case to.common.Coaching.CollegeInstructor:
				return 'fa-building-o';
			// University Professor
			case to.common.Coaching.UniversityProfessor:
				return 'fa-institution';
		}
		return '';
	}

	var PRIORITY_LABELS = [
		'Petty',
		'Minor',
		'Major',
		'Key',
		'Vital'
	];

	export function getPriorityLabel(priority) {
		return PRIORITY_LABELS[priority];
	}

	export enum Priority {
		Optional,
		NotVeryImportant,
		Important,
		VeryImportant,
		Critical,
		All
	}

	export function getPriorityClass(priority, diffSize:boolean = true) {
		switch (parseInt(priority)) {
			case to.common.Priority.Critical:
				return 'icon-to-critical' + (diffSize ? ' fa-2x' : '');
			case to.common.Priority.VeryImportant:
				return 'icon-to-very-important' + (diffSize ? ' fa-lg' : '');
			case to.common.Priority.Important:
				return 'icon-to-important' + (diffSize ? ' fa-lg' : '');
			case to.common.Priority.NotVeryImportant:
				return 'icon-to-not-important';
			case to.common.Priority.Optional:
				return 'icon-to-optional';
		}
		return '';
	}

	export function getPriorityInlineIcon(action:to.model.Action) {
		return `<i class="${getPriorityClass(action.priority)} inline-icon"></i>`;
	}

	// How good/bad will it be?
	var POSITIVE_IMPACT_LABELS = [
		'OK',
		'Good',
		'Great',
		'Excellent',
		'Stellar'
	];
	var NEGATIVE_IMPACT_LABELS = [
		'Irritating',
		'Bad',
		'Awful',
		'Terrible',
		'Disgraceful'
	];

	export enum PositiveImpact {
		OK,
		Good,
		Great,
		Excellent,
		Stellar
	}

	export enum NegativeImpact {
		Irritating,
		Bad,
		Awful,
		Terrible,
		Disgraceful
	}

	export function getPositiveImpactLabel(impact:PositiveImpact) {
		return POSITIVE_IMPACT_LABELS[impact];
	}

	export function getNegativeImpactLabel(impact:NegativeImpact) {
		return NEGATIVE_IMPACT_LABELS[impact];
	}

	export function getImpactClass(motivation:to.model.Motivation) {
		if (motivation.positive) {
			switch (parseInt(motivation.impact)) {
				case to.common.PositiveImpact.OK:
					return 'icon-neutral';
				case to.common.PositiveImpact.Good:
					return 'icon-smile';
				case to.common.PositiveImpact.Great:
					return 'icon-wink';
				case to.common.PositiveImpact.Excellent:
					return 'icon-happy';
				case to.common.PositiveImpact.Stellar:
					return 'icon-grin';
			}
		} else {
			switch (parseInt(motivation.impact)) {
				case to.common.NegativeImpact.Irritating:
					return 'icon-wondering';
				case to.common.NegativeImpact.Bad:
					return 'icon-sad';
				case to.common.NegativeImpact.Awful:
					return 'icon-angry';
				case to.common.NegativeImpact.Terrible:
					return 'icon-frustrated';
				case to.common.NegativeImpact.Disgraceful:
					return 'icon-crying';
			}
		}
	}

	var URGENCY_LABELS = [
		'Year(s)',
		'Month(s)',
		'Week(s)',
		'Day(s)',
		'Now'
	];

	export function getUrgencyLabel(urgency:Urgency) {
		return URGENCY_LABELS[urgency];
	}

	export function getUrgencyClass(urgency) {
		switch (parseInt(urgency)) {
			case to.common.Urgency.Now:
				return 'fa-plane';
			case to.common.Urgency.Days:
				return 'fa-subway';
			case to.common.Urgency.Weeks:
				return 'fa-car';
			case to.common.Urgency.Months:
				return 'fa-bicycle';
			case to.common.Urgency.Years:
				return 'ion-android-walk';
		}
		return '';
	}

	export enum Urgency {
		Years,
		Months,
		Weeks,
		Days,
		Now,
		All
	}

	var DAY_MILLISECONDS = 3600 * 24 * 1000;
	var DUE_IN_DAYS = 1;
	var DUE_IN_WEEKS = 7;
	var DUE_IN_MONTHS = 30;
	var DUE_IN_YEARS = 365;

	var DUE_MULTIPLIERS:number[] = [0, DUE_IN_DAYS, DUE_IN_WEEKS, DUE_IN_MONTHS, DUE_IN_YEARS];

	export function getActionDueDate
	(container:{dueValue:number; urgency:number; dueRemainderDays:number}) {
		var offsetInMilliseconds = container.dueValue * DAY_MILLISECONDS * DUE_MULTIPLIERS[4 - container.urgency] + container.dueRemainderDays * DAY_MILLISECONDS;
		var today = getStartOfDayDate();

		return new Date(today.getTime() + offsetInMilliseconds);
	}

	export function setDueValueAndUrgency
	(container:{dueValue:number; urgency:number; dueRemainderDays:number},
	 action:to.model.Action) {
		var numDaysTillDue = getNumDaysUntilDate(action.dueDate);
		if (numDaysTillDue >= DUE_IN_YEARS) {
			container.urgency = Urgency.Years;
			container.dueValue = Math.floor(numDaysTillDue / DUE_IN_YEARS);
			container.dueRemainderDays = numDaysTillDue - (container.dueValue * DUE_IN_YEARS);
		} else if (numDaysTillDue >= DUE_IN_MONTHS) {
			container.urgency = Urgency.Months;
			container.dueValue = Math.floor(numDaysTillDue / DUE_IN_MONTHS);
			container.dueRemainderDays = numDaysTillDue - (container.dueValue * DUE_IN_MONTHS);
		} else if (numDaysTillDue >= DUE_IN_WEEKS) {
			container.urgency = Urgency.Weeks;
			container.dueValue = Math.floor(numDaysTillDue / DUE_IN_WEEKS);
			container.dueRemainderDays = numDaysTillDue - (container.dueValue * DUE_IN_WEEKS);
		} else if (numDaysTillDue >= DUE_IN_DAYS) {
			container.urgency = Urgency.Days;
			container.dueValue = Math.floor(numDaysTillDue / DUE_IN_DAYS);
			container.dueRemainderDays = numDaysTillDue - (container.dueValue * DUE_IN_DAYS);
		} else {
			container.urgency = Urgency.Now;
			container.dueValue = 0;
		}
	}

	export function getNumDaysUntilDate(date:Date):number {
		var today = getStartOfDayDate();
		var offsetInMilliseconds = date.getTime() - today.getTime();
		return offsetInMilliseconds / DAY_MILLISECONDS;
	}

	export function getNumDaysSinceDate(date:Date):number {
		var today = getStartOfDayDate();
		var offsetInMilliseconds = today.getTime() - date.getTime();
		return offsetInMilliseconds / DAY_MILLISECONDS;
	}

	export function getStartOfDayDate():Date {
		var now = new Date();
		return new Date(now.getFullYear(), now.getMonth(), now.getDate());
	}

	export function getCurrentDateTimestamp():string {
		return new Date().toJSON();
	}


	export function getUrgencyOfAction
	(action:to.model.Action):Urgency {
		var now = new Date();
		var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		var test:number = 1;
		var numDaysTillDue = (action.dueDate.getTime() - today.getTime()) / DAY_MILLISECONDS;
		if (numDaysTillDue >= DUE_IN_YEARS) {
			return Urgency.Years;
		} else if (numDaysTillDue >= DUE_IN_MONTHS) {
			return Urgency.Months;
		} else if (numDaysTillDue >= DUE_IN_WEEKS) {
			return Urgency.Weeks;
		} else if (numDaysTillDue >= DUE_IN_DAYS) {
			return Urgency.Days;
		}
		return Urgency.Now;
	}

	export function getUrgencyInlineIcon(urgency) {
		return `<i class="fa ${getUrgencyClass(parseInt(urgency))} fa-lg inline-icon"></i>`;
	}

	export function getEisenhowerFilterDescription(priorities, urgencies, asTable?:boolean):string {
		var priorityFragment = '';
		if (priorities != to.common.Priority.All) {
			var priorities = priorities.split(',');
			if (priorities.length > 0) {
				priorityFragment = priorities
					.map((priority) => {
						return `<i class="${to.common.getPriorityClass(priority, false)}"></i> `;
					})
					.reduce((result, priorityLabel) => {
						return result + ' & ' + priorityLabel;
					});
			}
		}
		var urgencyFragment = '';
		if (urgencies != to.common.Urgency.All) {

			var urgencies = urgencies.split(',');
			if (urgencies.length > 0) {
				urgencyFragment += urgencies
					.map((urgency) => {
						return `<i class="fa ${to.common.getUrgencyClass(urgency)}"></i> `;
					})
					.reduce((result, urgencyLabel) => {
						return result + ' & ' + urgencyLabel;
					});
			}
		}

		if (asTable) {
			var table = '<table class="eisenhower-filter">';
			if (priorityFragment) {
				table += `<tr><td>How:</td><td>${priorityFragment}</td></tr>`;
			}
			if (urgencyFragment) {
				table += `<tr><td>When:</td><td>${urgencyFragment}</td></tr>`;

			}
			table += '</table>';
			return table;
		} else {
			var fragment = '';
			if (priorityFragment) {
				fragment += 'How: ' + priorityFragment;
			}
			if (urgencyFragment) {
				if (priorityFragment) {
					fragment += '<br>';
				}
				fragment += 'When: ' + urgencyFragment;
			}
			return fragment;
		}
	}


	export function getBookmarkViewName(stateName) {
		switch (stateName) {
			case to.common.states.LIST_ACTIONS:
				return 'Listing of:';
			case to.common.states.EISENHOWER:
				return 'Tracking of:';
			case to.common.states.CHART_BUBBLE_CLICKABLE:
				return 'System of:';
			case to.common.states.KANBAN:
				return 'Progress for:';
			case to.common.states.CATEGORIES:
				return 'Categories for:';
			case to.common.states.MOTIVATIONS:
				return 'Reasons for:';
		}
		return '';
	}

	export module states {
    export var ADD_AFTER_ACTIONS = 'to.add-after-actions';
    export var ADD_BEFORE_ACTIONS = 'to.add-before-actions';
		export var ARCHIVE = 'to.archive';
		export var CATEGORIES = 'to.categories';
		export var CHART_BUBBLE = 'to.chart-bubble';
		export var CHART_BUBBLE_CLICKABLE = 'to.chart-bubble-clickable';
		export var EDIT_ACTION = 'to.edit-action';
		export var EDIT_CATEGORIES_FOR_ACTION = 'to.edit-categories-for-action';
		export var EDIT_CATEGORY = 'to.edit-category';
		export var EDIT_MOTIVATION = 'to.edit-motivation';
		export var EDIT_MOTIVATIONS_FOR_ACTION = 'to.edit-motivations-for-action';
		export var EISENHOWER = 'to.eisenhower';
		export var ENTER_ACTION = 'to.enter-action';
		export var ACTION = 'to.action';
		export var ENTER_CATEGORY = 'to.enter-category';
		export var ENTER_MOTIVATION = 'to.enter-motivation';
		export var KANBAN = 'to.kanban';
		export var LIST_ACTIONS = 'to.list-actions';
		export var PLANS = 'to.plans';
		export var MOTIVATIONS = 'to.motivations';
		export var BOOKMARKS = 'to.bookmarks';
		export var VIEW_ACTION = 'to.view-action';
		export var VIEW_CATEGORY = 'to.view-category';
		export var VIEW_MOTIVATION = 'to.view-motivation';
	}
}

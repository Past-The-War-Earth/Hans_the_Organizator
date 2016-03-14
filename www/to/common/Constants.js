///<reference path="../imports.ts"/>
/**
 * Created by artem on 4/11/15.
 */
var to;
(function (to) {
    var common;
    (function (common) {
        var KANBAN_OPTIONS = [
            'Planned',
            'Ready',
            'Doing',
            'Done',
            'Archived'
        ];
        function getKanbanState(kanbanState) {
            return KANBAN_OPTIONS[kanbanState];
        }
        common.getKanbanState = getKanbanState;
        (function (Kanban) {
            Kanban[Kanban["Planned"] = 0] = "Planned";
            Kanban[Kanban["Ready"] = 1] = "Ready";
            Kanban[Kanban["InProgress"] = 2] = "InProgress";
            Kanban[Kanban["RecentlyDone"] = 3] = "RecentlyDone";
            Kanban[Kanban["Archived"] = 4] = "Archived";
            Kanban[Kanban["AllIncomplete"] = 5] = "AllIncomplete";
        })(common.Kanban || (common.Kanban = {}));
        var Kanban = common.Kanban;
        function getKanbanClass(kanbanState) {
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
        common.getKanbanClass = getKanbanClass;
        var COACHING_LABELS = [
            'I don\'t need no education',
            'Daycare Nanny',
            'School Teacher',
            'College Instructor',
            'University Professor' // icon-podcast
        ];
        (function (Coaching) {
            Coaching[Coaching["IDontNeedNoEducation"] = 0] = "IDontNeedNoEducation";
            Coaching[Coaching["DaycareNanny"] = 1] = "DaycareNanny";
            Coaching[Coaching["SchoolTeacher"] = 2] = "SchoolTeacher";
            Coaching[Coaching["CollegeInstructor"] = 3] = "CollegeInstructor";
            Coaching[Coaching["UniversityProfessor"] = 4] = "UniversityProfessor";
        })(common.Coaching || (common.Coaching = {}));
        var Coaching = common.Coaching;
        function getCoachingLabel(coaching) {
            return COACHING_LABELS[coaching];
        }
        common.getCoachingLabel = getCoachingLabel;
        function getCoachingPhrase(coaching) {
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
        common.getCoachingPhrase = getCoachingPhrase;
        function getCoachingClass(coaching) {
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
        common.getCoachingClass = getCoachingClass;
        var PRIORITY_LABELS = [
            'Petty',
            'Minor',
            'Major',
            'Key',
            'Vital'
        ];
        function getPriorityLabel(priority) {
            return PRIORITY_LABELS[priority];
        }
        common.getPriorityLabel = getPriorityLabel;
        (function (Priority) {
            Priority[Priority["Optional"] = 0] = "Optional";
            Priority[Priority["NotVeryImportant"] = 1] = "NotVeryImportant";
            Priority[Priority["Important"] = 2] = "Important";
            Priority[Priority["VeryImportant"] = 3] = "VeryImportant";
            Priority[Priority["Critical"] = 4] = "Critical";
            Priority[Priority["All"] = 5] = "All";
        })(common.Priority || (common.Priority = {}));
        var Priority = common.Priority;
        function getPriorityClass(priority, diffSize) {
            if (diffSize === void 0) { diffSize = true; }
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
        common.getPriorityClass = getPriorityClass;
        function getPriorityInlineIcon(action) {
            return "<i class=\"" + getPriorityClass(action.priority) + " inline-icon\"></i>";
        }
        common.getPriorityInlineIcon = getPriorityInlineIcon;
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
        (function (PositiveImpact) {
            PositiveImpact[PositiveImpact["OK"] = 0] = "OK";
            PositiveImpact[PositiveImpact["Good"] = 1] = "Good";
            PositiveImpact[PositiveImpact["Great"] = 2] = "Great";
            PositiveImpact[PositiveImpact["Excellent"] = 3] = "Excellent";
            PositiveImpact[PositiveImpact["Stellar"] = 4] = "Stellar";
        })(common.PositiveImpact || (common.PositiveImpact = {}));
        var PositiveImpact = common.PositiveImpact;
        (function (NegativeImpact) {
            NegativeImpact[NegativeImpact["Irritating"] = 0] = "Irritating";
            NegativeImpact[NegativeImpact["Bad"] = 1] = "Bad";
            NegativeImpact[NegativeImpact["Awful"] = 2] = "Awful";
            NegativeImpact[NegativeImpact["Terrible"] = 3] = "Terrible";
            NegativeImpact[NegativeImpact["Disgraceful"] = 4] = "Disgraceful";
        })(common.NegativeImpact || (common.NegativeImpact = {}));
        var NegativeImpact = common.NegativeImpact;
        function getPositiveImpactLabel(impact) {
            return POSITIVE_IMPACT_LABELS[impact];
        }
        common.getPositiveImpactLabel = getPositiveImpactLabel;
        function getNegativeImpactLabel(impact) {
            return NEGATIVE_IMPACT_LABELS[impact];
        }
        common.getNegativeImpactLabel = getNegativeImpactLabel;
        function getImpactClass(motivation) {
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
            }
            else {
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
        common.getImpactClass = getImpactClass;
        var URGENCY_LABELS = [
            'Year(s)',
            'Month(s)',
            'Week(s)',
            'Day(s)',
            'Now'
        ];
        function getUrgencyLabel(urgency) {
            return URGENCY_LABELS[urgency];
        }
        common.getUrgencyLabel = getUrgencyLabel;
        function getUrgencyClass(urgency) {
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
        common.getUrgencyClass = getUrgencyClass;
        (function (Urgency) {
            Urgency[Urgency["Years"] = 0] = "Years";
            Urgency[Urgency["Months"] = 1] = "Months";
            Urgency[Urgency["Weeks"] = 2] = "Weeks";
            Urgency[Urgency["Days"] = 3] = "Days";
            Urgency[Urgency["Now"] = 4] = "Now";
            Urgency[Urgency["All"] = 5] = "All";
        })(common.Urgency || (common.Urgency = {}));
        var Urgency = common.Urgency;
        var DAY_MILLISECONDS = 3600 * 24 * 1000;
        var DUE_IN_DAYS = 1;
        var DUE_IN_WEEKS = 7;
        var DUE_IN_MONTHS = 30;
        var DUE_IN_YEARS = 365;
        var DUE_MULTIPLIERS = [0, DUE_IN_DAYS, DUE_IN_WEEKS, DUE_IN_MONTHS, DUE_IN_YEARS];
        function getActionDueDate(container) {
            var offsetInMilliseconds = container.dueValue * DAY_MILLISECONDS * DUE_MULTIPLIERS[4 - container.urgency] + container.dueRemainderDays * DAY_MILLISECONDS;
            var today = getStartOfDayDate();
            return new Date(today.getTime() + offsetInMilliseconds);
        }
        common.getActionDueDate = getActionDueDate;
        function setDueValueAndUrgency(container, action) {
            var numDaysTillDue = getNumDaysUntilDate(action.dueDate);
            if (numDaysTillDue >= DUE_IN_YEARS) {
                container.urgency = Urgency.Years;
                container.dueValue = Math.floor(numDaysTillDue / DUE_IN_YEARS);
                container.dueRemainderDays = numDaysTillDue - (container.dueValue * DUE_IN_YEARS);
            }
            else if (numDaysTillDue >= DUE_IN_MONTHS) {
                container.urgency = Urgency.Months;
                container.dueValue = Math.floor(numDaysTillDue / DUE_IN_MONTHS);
                container.dueRemainderDays = numDaysTillDue - (container.dueValue * DUE_IN_MONTHS);
            }
            else if (numDaysTillDue >= DUE_IN_WEEKS) {
                container.urgency = Urgency.Weeks;
                container.dueValue = Math.floor(numDaysTillDue / DUE_IN_WEEKS);
                container.dueRemainderDays = numDaysTillDue - (container.dueValue * DUE_IN_WEEKS);
            }
            else if (numDaysTillDue >= DUE_IN_DAYS) {
                container.urgency = Urgency.Days;
                container.dueValue = Math.floor(numDaysTillDue / DUE_IN_DAYS);
                container.dueRemainderDays = numDaysTillDue - (container.dueValue * DUE_IN_DAYS);
            }
            else {
                container.urgency = Urgency.Now;
                container.dueValue = 0;
            }
        }
        common.setDueValueAndUrgency = setDueValueAndUrgency;
        function getNumDaysUntilDate(date) {
            var today = getStartOfDayDate();
            var offsetInMilliseconds = date.getTime() - today.getTime();
            return offsetInMilliseconds / DAY_MILLISECONDS;
        }
        common.getNumDaysUntilDate = getNumDaysUntilDate;
        function getNumDaysSinceDate(date) {
            var today = getStartOfDayDate();
            var offsetInMilliseconds = today.getTime() - date.getTime();
            return offsetInMilliseconds / DAY_MILLISECONDS;
        }
        common.getNumDaysSinceDate = getNumDaysSinceDate;
        function getStartOfDayDate() {
            var now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }
        common.getStartOfDayDate = getStartOfDayDate;
        function getCurrentDateTimestamp() {
            return new Date().toJSON();
        }
        common.getCurrentDateTimestamp = getCurrentDateTimestamp;
        function getUrgencyOfAction(action) {
            var now = new Date();
            var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            var test = 1;
            var numDaysTillDue = (action.dueDate.getTime() - today.getTime()) / DAY_MILLISECONDS;
            if (numDaysTillDue >= DUE_IN_YEARS) {
                return Urgency.Years;
            }
            else if (numDaysTillDue >= DUE_IN_MONTHS) {
                return Urgency.Months;
            }
            else if (numDaysTillDue >= DUE_IN_WEEKS) {
                return Urgency.Weeks;
            }
            else if (numDaysTillDue >= DUE_IN_DAYS) {
                return Urgency.Days;
            }
            return Urgency.Now;
        }
        common.getUrgencyOfAction = getUrgencyOfAction;
        function getUrgencyInlineIcon(urgency) {
            return "<i class=\"fa " + getUrgencyClass(parseInt(urgency)) + " fa-lg inline-icon\"></i>";
        }
        common.getUrgencyInlineIcon = getUrgencyInlineIcon;
        function getEisenhowerFilterDescription(priorities, urgencies, asTable) {
            var priorityFragment = '';
            if (priorities != to.common.Priority.All) {
                var priorities = priorities.split(',');
                if (priorities.length > 0) {
                    priorityFragment = priorities
                        .map(function (priority) {
                        return "<i class=\"" + to.common.getPriorityClass(priority, false) + "\"></i> ";
                    })
                        .reduce(function (result, priorityLabel) {
                        return result + ' & ' + priorityLabel;
                    });
                }
            }
            var urgencyFragment = '';
            if (urgencies != to.common.Urgency.All) {
                var urgencies = urgencies.split(',');
                if (urgencies.length > 0) {
                    urgencyFragment += urgencies
                        .map(function (urgency) {
                        return "<i class=\"fa " + to.common.getUrgencyClass(urgency) + "\"></i> ";
                    })
                        .reduce(function (result, urgencyLabel) {
                        return result + ' & ' + urgencyLabel;
                    });
                }
            }
            if (asTable) {
                var table = '<table class="eisenhower-filter">';
                if (priorityFragment) {
                    table += "<tr><td>How:</td><td>" + priorityFragment + "</td></tr>";
                }
                if (urgencyFragment) {
                    table += "<tr><td>When:</td><td>" + urgencyFragment + "</td></tr>";
                }
                table += '</table>';
                return table;
            }
            else {
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
        common.getEisenhowerFilterDescription = getEisenhowerFilterDescription;
        function getBookmarkViewName(stateName) {
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
        common.getBookmarkViewName = getBookmarkViewName;
        var states;
        (function (states) {
            states.ADD_AFTER_ACTIONS = 'to.add-after-actions';
            states.ADD_BEFORE_ACTIONS = 'to.add-before-actions';
            states.ARCHIVE = 'to.archive';
            states.CATEGORIES = 'to.categories';
            states.CHART_BUBBLE = 'to.chart-bubble';
            states.CHART_BUBBLE_CLICKABLE = 'to.chart-bubble-clickable';
            states.EDIT_ACTION = 'to.edit-action';
            states.EDIT_CATEGORIES_FOR_ACTION = 'to.edit-categories-for-action';
            states.EDIT_CATEGORY = 'to.edit-category';
            states.EDIT_MOTIVATION = 'to.edit-motivation';
            states.EDIT_MOTIVATIONS_FOR_ACTION = 'to.edit-motivations-for-action';
            states.EISENHOWER = 'to.eisenhower';
            states.ENTER_ACTION = 'to.enter-action';
            states.ACTION = 'to.action';
            states.ENTER_CATEGORY = 'to.enter-category';
            states.ENTER_MOTIVATION = 'to.enter-motivation';
            states.KANBAN = 'to.kanban';
            states.LIST_ACTIONS = 'to.list-actions';
            states.PLANS = 'to.plans';
            states.MOTIVATIONS = 'to.motivations';
            states.BOOKMARKS = 'to.bookmarks';
            states.VIEW_ACTION = 'to.view-action';
            states.VIEW_CATEGORY = 'to.view-category';
            states.VIEW_MOTIVATION = 'to.view-motivation';
        })(states = common.states || (common.states = {}));
    })(common = to.common || (to.common = {}));
})(to || (to = {}));
//# sourceMappingURL=Constants.js.map
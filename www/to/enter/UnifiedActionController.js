var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var enter;
    (function (enter) {
        var UnifiedActionController = (function (_super) {
            __extends(UnifiedActionController, _super);
            function UnifiedActionController($ionicHistory, $scope, $state, $stateParams, actionRepository, actionService, categoryRepository, motivationRepository) {
                _super.call(this, $ionicHistory, $scope, $state, actionService, categoryRepository, motivationRepository, 'ActionController', 'Action');
                this.$stateParams = $stateParams;
                this.actionRepository = actionRepository;
                this.reasonOrCategoryMode = false;
                this.reload();
            }
            UnifiedActionController.prototype.reload = function () {
                var _this = this;
                return this.actionRepository.get(this.$stateParams.actionId).then(function (action) {
                    _this.action = action;
                    if (!_this.action) {
                        return;
                    }
                    to.common.setDueValueAndUrgency(_this, _this.action);
                    var operations = [
                        _this.categoryRepository.getAllByIds(_this.action.categoryIds),
                        _this.motivationRepository.getAllByIds(_this.action.motivationIds)];
                    Promise.all(operations).then(function (results) {
                        _this.categories = results[0];
                        _this.motivations = results[1];
                        _this.afterDataLoad();
                        _this.afterDataLoad();
                        _this.cellSideSize = _this.getCellSideSize();
                        jQuery('#action-circle').attr('cx', _this.cellSideSize * 2.5);
                        jQuery('#action-circle').attr('cy', _this.cellSideSize * 2.5);
                        jQuery('tr').css('height', _this.cellSideSize + 'px');
                        jQuery('svg').attr('width', _this.cellSideSize * 5);
                        jQuery('svg').attr('height', _this.cellSideSize * 5);
                        jQuery('span.quadrant').css('height', _this.cellSideSize * 5 + 'px');
                        jQuery('span.quadrant').css('width', _this.cellSideSize * 5 + 'px');
                        var navDiameter = _this.cellSideSize - 15;
                        var navRadius = navDiameter / 2;
                        jQuery('nav.eisenhower-header').css('height', navDiameter + 'px');
                        jQuery('nav.eisenhower-header').css('width', navDiameter + 'px');
                        jQuery('g[type="reason"][number="4"]').attr('transform', _this.getSatellitePosition(146.25));
                        jQuery('g[type="reason"][number="3"]').attr('transform', _this.getSatellitePosition(168.75));
                        jQuery('g[type="reason"][number="2"]').attr('transform', _this.getSatellitePosition(191.25));
                        jQuery('g[type="reason"][number="1"]').attr('transform', _this.getSatellitePosition(213.75));
                        jQuery('g[number]>circle').attr('fill', 'white');
                        jQuery('g[number]>circle').attr('stroke', 'gray');
                        jQuery('g[number]>circle').attr('r', navRadius);
                        jQuery('g[number]>text').attr('dx', '-12');
                        jQuery('g[number]>text').attr('dy', '10');
                        jQuery('g[number]>text').attr('font-size', '28px');
                        jQuery('g[type="reason"][number]>text').attr('font-family', 'FontAwesome');
                        jQuery('#category-2 > text').text('\ue601');
                        var unbindHandler = _this.$scope.$on('$ionicView.beforeLeave', function (event, stateParams) {
                            _this.convertRanges();
                            _this.actionRepository.update(_this.action);
                            unbindHandler();
                        });
                    });
                });
            };
            UnifiedActionController.prototype.getReasonTextStyle = function (position) {
                var styleObject = {};
                styleObject['fill'] = 'gray';
                return styleObject;
            };
            UnifiedActionController.prototype.getReasonText = function (position) {
                return '&#xf192';
            };
            UnifiedActionController.prototype.getSatellitePosition = function (degrees) {
                var diameter = this.cellSideSize - 15;
                var cirumference = diameter * 16;
                var radius = cirumference / 2 / Math.PI;
                var cx = this.cellSideSize * 2.5;
                var cy = this.cellSideSize * 2.5;
                var thirtyDegrees = this.toRadians(degrees);
                var x = cx + radius * Math.cos(thirtyDegrees);
                var y = cy + radius * Math.sin(thirtyDegrees);
                return "translate(" + x + "," + y + ")";
            };
            UnifiedActionController.prototype.onUrgencyColumnClick = function (clickedUrgency) {
                this.reasonOrCategoryMode = false;
                this.urgency = clickedUrgency;
            };
            UnifiedActionController.prototype.getSelectedUrgencyStyle = function (urgency) {
                var styleObject = {};
                styleObject['background-color'] = '#' + to.common.urgencyColors[urgency];
                if (urgency == this.urgency) {
                    styleObject['background-color'] = '#' + to.common.selectedUrgencyColors[urgency];
                    styleObject['border'] = '2px solid #1abc9c';
                }
                return styleObject;
            };
            UnifiedActionController.prototype.getSelectedUrgencyLabelClass = function (urgency) {
                return urgency == this.urgency ? 'selected-label' : '';
            };
            UnifiedActionController.prototype.onPriorityRowClick = function (clickedPriority) {
                this.reasonOrCategoryMode = false;
                this.action.priority = clickedPriority;
            };
            UnifiedActionController.prototype.getSelectedPriorityStyle = function (priority) {
                var styleObject = {};
                styleObject['background-color'] = '#' + to.common.priorityColors[4 - priority];
                if (priority == this.action.priority) {
                    styleObject['background-color'] = '#' + to.common.selectedPriorityColors[4 - priority];
                    styleObject['border'] = '2px solid #1abc9c';
                }
                return styleObject;
            };
            UnifiedActionController.prototype.getSelectedPriorityLabelClass = function (priority) {
                return priority == this.action.priority ? 'selected-label' : '';
            };
            UnifiedActionController.prototype.selectPlanned = function () {
                this.action.kanbanState = this.Kanban.Planned;
            };
            UnifiedActionController.prototype.getPlannedButtonClass = function () {
                if (this.action.kanbanState == this.Kanban.Planned) {
                    return 'background-plan selected-button';
                }
                return '';
            };
            UnifiedActionController.prototype.getPlannedLabelClass = function () {
                if (this.action.kanbanState == this.Kanban.Planned) {
                    return 'selected-label';
                }
                return '';
            };
            UnifiedActionController.prototype.selectReady = function () {
                this.action.kanbanState = this.Kanban.Ready;
            };
            UnifiedActionController.prototype.getReadyButtonClass = function () {
                if (this.action.kanbanState == this.Kanban.Ready) {
                    return 'background-categories selected-button';
                }
                return '';
            };
            UnifiedActionController.prototype.getReadyLabelClass = function () {
                if (this.action.kanbanState == this.Kanban.Ready) {
                    return 'selected-label';
                }
                return '';
            };
            UnifiedActionController.prototype.selectInProgress = function () {
                this.action.kanbanState = this.Kanban.InProgress;
            };
            UnifiedActionController.prototype.getInProgressButtonClass = function () {
                if (this.action.kanbanState == this.Kanban.InProgress) {
                    return 'background-advise selected-button';
                }
                return '';
            };
            UnifiedActionController.prototype.getInProgressLabelClass = function () {
                if (this.action.kanbanState == this.Kanban.InProgress) {
                    return 'selected-label';
                }
                return '';
            };
            UnifiedActionController.prototype.getCellSideSize = function () {
                return Math.floor((Math.min(window.innerHeight, window.innerWidth) - 10) / 6);
            };
            UnifiedActionController.prototype.getCategory1GPosition = function () {
                var diameter = this.cellSideSize - 15;
                var cirumference = diameter * 16;
                var radius = cirumference / 2 / Math.PI;
                var cx = this.cellSideSize * 2.5;
                var cy = this.cellSideSize * 2.5;
                var thirtyDegrees = this.toRadians(33.75);
                var x = cx + radius * Math.cos(thirtyDegrees);
                var y = cy + radius * Math.sin(thirtyDegrees);
                return "translate(" + x + "," + y + ")";
            };
            UnifiedActionController.prototype.getCategory2GPosition = function () {
                var diameter = this.cellSideSize - 15;
                var cirumference = diameter * 16;
                var radius = cirumference / 2 / Math.PI;
                var cx = this.cellSideSize * 2.5;
                var cy = this.cellSideSize * 2.5;
                var thirtyDegrees = this.toRadians(11.25);
                var x = cx + radius * Math.cos(thirtyDegrees);
                var y = cy + radius * Math.sin(thirtyDegrees);
                return "translate(" + x + "," + y + ")";
            };
            UnifiedActionController.prototype.getCategory3GPosition = function () {
                var diameter = this.cellSideSize - 15;
                var cirumference = diameter * 16;
                var radius = cirumference / 2 / Math.PI;
                var cx = this.cellSideSize * 2.5;
                var cy = this.cellSideSize * 2.5;
                var thirtyDegrees = this.toRadians(-11.25);
                var x = cx + radius * Math.cos(thirtyDegrees);
                var y = cy + radius * Math.sin(thirtyDegrees);
                return "translate(" + x + "," + y + ")";
            };
            UnifiedActionController.prototype.toRadians = function (angle) {
                return angle * (Math.PI / 180);
            };
            UnifiedActionController.prototype.toDegrees = function (angle) {
                return angle * (180 / Math.PI);
            };
            UnifiedActionController.prototype.getActionAvatarStyle = function () {
                var radius;
                var priority = parseInt(this.action.priority);
                switch (priority) {
                    case to.common.Priority.Critical:
                        radius = 35;
                        break;
                    case to.common.Priority.VeryImportant:
                        radius = 30;
                        break;
                    case to.common.Priority.Important:
                        radius = 25;
                        break;
                    case to.common.Priority.NotVeryImportant:
                        radius = 20;
                        break;
                    case to.common.Priority.Optional:
                        radius = 15;
                        break;
                }
                var styleObject = {};
                styleObject['r'] = radius;
                var backgroundColor = to.common.selectedMatrixColors[this.urgency][4 - priority];
                styleObject['fill'] = '#' + backgroundColor;
                styleObject['stroke-width'] = '4px';
                switch (this.action.kanbanState) {
                    case this.Kanban.Planned:
                        styleObject['stroke'] = '#8e44ad';
                        break;
                    case this.Kanban.Ready:
                        styleObject['stroke'] = '#27ae60';
                        break;
                    case this.Kanban.InProgress:
                        styleObject['stroke'] = '#d35400';
                        break;
                    case this.Kanban.RecentlyDone:
                    case this.Kanban.Archived:
                }
                return styleObject;
            };
            UnifiedActionController.prototype.getActionFillColor = function () {
                var priority = parseInt(this.action.priority);
                var backgroundColor = to.common.selectedMatrixColors[this.urgency][4 - priority];
                return '#' + backgroundColor;
            };
            UnifiedActionController.prototype.getActionRadius = function () {
                var priority = parseInt(this.action.priority);
                switch (priority) {
                    case to.common.Priority.Critical:
                        return 40;
                    case to.common.Priority.VeryImportant:
                        return 35;
                    case to.common.Priority.Important:
                        return 30;
                    case to.common.Priority.NotVeryImportant:
                        return 25;
                    case to.common.Priority.Optional:
                    default:
                        return 20;
                }
            };
            return UnifiedActionController;
        })(to.common.EditableActionController);
        angular.module('organizator').controller('UnifiedActionController', UnifiedActionController);
    })(enter = to.enter || (to.enter = {}));
})(to || (to = {}));
//# sourceMappingURL=UnifiedActionController.js.map
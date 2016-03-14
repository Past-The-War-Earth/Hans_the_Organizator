///<reference path="../imports.ts"/>

/**
 * Created by artem on 7/12/15.
 */

module to.enter {


  class UnifiedActionController extends to.common.EditableActionController implements to.common.UnifiedController {

    reasonOrCategoryMode:boolean = false;
    action:to.model.Action;
    cellSideSize:number;

    constructor
    (
      $ionicHistory,
      $scope:angular.IScope,
      $state:angular.ui.IStateService,
      private $stateParams:to.common.ActionDetailParameters,
      private actionRepository:to.storage.ActionRepository,
      actionService:to.act.ActionService,
      categoryRepository:to.storage.CategoryRepository,
      motivationRepository:to.storage.MotivationRepository
    ) {
      super($ionicHistory, $scope, $state, actionService, categoryRepository, motivationRepository, 'ActionController', 'Action');
      this.reload();
    }

    reload():Promise<any> {
      return this.actionRepository.get(this.$stateParams.actionId).then(( action )=> {
        this.action = action;
        if (!this.action) {
          return;
        }
        to.common.setDueValueAndUrgency(this, this.action);
        var operations:Promise<any>[] = [
          this.categoryRepository.getAllByIds(this.action.categoryIds),
          this.motivationRepository.getAllByIds(this.action.motivationIds)];
        Promise.all(operations).then(( results )=> {
          this.categories = results[0];
          this.motivations = results[1];
          this.afterDataLoad();

          this.afterDataLoad();
          this.cellSideSize = this.getCellSideSize();

          jQuery('#action-circle').attr('cx', this.cellSideSize * 2.5);
          jQuery('#action-circle').attr('cy', this.cellSideSize * 2.5);

          jQuery('tr').css('height', this.cellSideSize + 'px');
          jQuery('svg').attr('width', this.cellSideSize * 5);
          jQuery('svg').attr('height', this.cellSideSize * 5);
          jQuery('span.quadrant').css('height', this.cellSideSize * 5 + 'px');
          jQuery('span.quadrant').css('width', this.cellSideSize * 5 + 'px');
          var navDiameter = this.cellSideSize - 15;
          var navRadius = navDiameter / 2;
          jQuery('nav.eisenhower-header').css('height', navDiameter + 'px');
          jQuery('nav.eisenhower-header').css('width', navDiameter + 'px');
          jQuery('g[type="reason"][number="4"]').attr('transform', this.getSatellitePosition(146.25));
          jQuery('g[type="reason"][number="3"]').attr('transform', this.getSatellitePosition(168.75));
          jQuery('g[type="reason"][number="2"]').attr('transform', this.getSatellitePosition(191.25));
          jQuery('g[type="reason"][number="1"]').attr('transform', this.getSatellitePosition(213.75));
          jQuery('g[number]>circle').attr('fill', 'white');
          jQuery('g[number]>circle').attr('stroke', 'gray');
          jQuery('g[number]>circle').attr('r', navRadius);
          jQuery('g[number]>text').attr('dx', '-12');
          jQuery('g[number]>text').attr('dy', '10');
          jQuery('g[number]>text').attr('font-size', '28px');
          jQuery('g[type="reason"][number]>text').attr('font-family', 'FontAwesome');

          jQuery('#category-2 > text').text('\ue601');

          var unbindHandler = this.$scope.$on('$ionicView.beforeLeave', (
            event,
            stateParams
          )=> {
            this.convertRanges();
            this.actionRepository.update(this.action);
            unbindHandler();
          });
        });
      });
    }

    getReasonTextStyle( position ) {
      var styleObject = {};
      styleObject['fill'] = 'gray';

      return styleObject;
    }

    getReasonText( position ) {
      return '&#xf192';
    }

    getSatellitePosition( degrees ) {
      var diameter = this.cellSideSize - 15;
      var cirumference = diameter * 16;
      var radius = cirumference / 2 / Math.PI;
      // 30 degree increments, starting at 15 degrees
      var cx = this.cellSideSize * 2.5;
      var cy = this.cellSideSize * 2.5;

      var thirtyDegrees = this.toRadians(degrees);
      var x = cx + radius * Math.cos(thirtyDegrees);
      var y = cy + radius * Math.sin(thirtyDegrees);

      return `translate(${x},${y})`;
    }

    onUrgencyColumnClick( clickedUrgency:number ) {
      this.reasonOrCategoryMode = false;
      this.urgency = clickedUrgency;
    }

    getSelectedUrgencyStyle( urgency:number ) {
      var styleObject = {};
      styleObject['background-color'] = '#' + to.common.urgencyColors[urgency];
      if (urgency == this.urgency) {
        styleObject['background-color'] = '#' + to.common.selectedUrgencyColors[urgency];
        styleObject['border'] = '2px solid #1abc9c'
      }
      return styleObject;
    }

    getSelectedUrgencyLabelClass
    ( urgency:number ) {
      return urgency == this.urgency ? 'selected-label' : '';
    }


    onPriorityRowClick( clickedPriority ) {
      this.reasonOrCategoryMode = false;
      this.action.priority = clickedPriority;
    }

    getSelectedPriorityStyle
    ( priority:any ) {
      var styleObject = {};
      styleObject['background-color'] = '#' + to.common.priorityColors[4 - priority];
      if (priority == this.action.priority) {
        styleObject['background-color'] = '#' + to.common.selectedPriorityColors[4 - priority];
        styleObject['border'] = '2px solid #1abc9c';
      }
      return styleObject;
    }

    getSelectedPriorityLabelClass
    ( priority:any ) {
      return priority == this.action.priority ? 'selected-label' : '';
    }

    selectPlanned() {
      this.action.kanbanState = this.Kanban.Planned;
    }

    getPlannedButtonClass() {
      if (this.action.kanbanState == this.Kanban.Planned) {
        return 'background-plan selected-button';
      }
      return '';
    }

    getPlannedLabelClass() {
      if (this.action.kanbanState == this.Kanban.Planned) {
        return 'selected-label';
      }
      return '';
    }

    selectReady() {
      this.action.kanbanState = this.Kanban.Ready;
    }

    getReadyButtonClass() {
      if (this.action.kanbanState == this.Kanban.Ready) {
        return 'background-categories selected-button';
      }
      return '';
    }

    getReadyLabelClass() {
      if (this.action.kanbanState == this.Kanban.Ready) {
        return 'selected-label';
      }
      return '';
    }

    selectInProgress() {
      this.action.kanbanState = this.Kanban.InProgress;
    }

    getInProgressButtonClass() {
      if (this.action.kanbanState == this.Kanban.InProgress) {
        return 'background-advise selected-button';
      }
      return '';
    }

    getInProgressLabelClass() {
      if (this.action.kanbanState == this.Kanban.InProgress) {
        return 'selected-label';
      }
      return '';
    }

    getCellSideSize():number {
      return Math.floor((Math.min(window.innerHeight, window.innerWidth) - 10) / 6);
    }

    getCategory1GPosition() {
      var diameter = this.cellSideSize - 15;
      var cirumference = diameter * 16;
      var radius = cirumference / 2 / Math.PI;
      // 30 degree increments, starting at 15 degrees
      var cx = this.cellSideSize * 2.5;
      var cy = this.cellSideSize * 2.5;

      var thirtyDegrees = this.toRadians(33.75);
      /*
       x = cx + r * cos(a)
       y = cy + r * sin(a)
       */
      var x = cx + radius * Math.cos(thirtyDegrees);
      var y = cy + radius * Math.sin(thirtyDegrees);

      return `translate(${x},${y})`;
    }

    getCategory2GPosition() {
      var diameter = this.cellSideSize - 15;
      var cirumference = diameter * 16;
      var radius = cirumference / 2 / Math.PI;
      // 30 degree increments, starting at 15 degrees
      var cx = this.cellSideSize * 2.5;
      var cy = this.cellSideSize * 2.5;

      var thirtyDegrees = this.toRadians(11.25);
      /*
       x = cx + r * cos(a)
       y = cy + r * sin(a)
       */
      var x = cx + radius * Math.cos(thirtyDegrees);
      var y = cy + radius * Math.sin(thirtyDegrees);

      return `translate(${x},${y})`;
    }

    getCategory3GPosition() {
      var diameter = this.cellSideSize - 15;
      var cirumference = diameter * 16;
      var radius = cirumference / 2 / Math.PI;
      // 30 degree increments, starting at 15 degrees
      var cx = this.cellSideSize * 2.5;
      var cy = this.cellSideSize * 2.5;

      var thirtyDegrees = this.toRadians(-11.25);
      /*
       x = cx + r * cos(a)
       y = cy + r * sin(a)
       */
      var x = cx + radius * Math.cos(thirtyDegrees);
      var y = cy + radius * Math.sin(thirtyDegrees);

      return `translate(${x},${y})`;
    }

    toRadians( angle ) {
      return angle * (Math.PI / 180);
    }

    toDegrees( angle ) {
      return angle * (180 / Math.PI);
    }

    getActionAvatarStyle() {
      /**
       * base size: 320px width screen
       */
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

      var styleObject:any = {};

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
        // Display a pie chart of Planned, Ready, InProgress
        case this.Kanban.RecentlyDone:
        case this.Kanban.Archived:
      }

      return styleObject;
    }

    getActionFillColor() {
      var priority = parseInt(this.action.priority);
      var backgroundColor = to.common.selectedMatrixColors[this.urgency][4 - priority];
      return '#' + backgroundColor;
    }

    getActionRadius() {
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
    }
  }

  angular.module('organizator').controller('UnifiedActionController', UnifiedActionController);
}

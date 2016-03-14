///<reference path="imports.ts"/>

/**
 * Created by artem on 4/22/15.
 */

declare var Ionic;

module to {

  class MainController {

    bookmark:to.model.DbBookmark;
    bookmarkSaved:boolean;
    deploy = new Ionic.Deploy();
    hasUpdate:boolean = false;
    updateOrCheckInProgress:boolean = false;

    constructor
    (
      private $ionicActionSheet,
      private $scope,
      private $state:angular.ui.IStateService,
      private bookmarkRepository:to.storage.BookmarkRepository,
      private categoryRepository:to.storage.CategoryRepository,
      private motivationRepository:to.storage.MotivationRepository,
      private speechEngine:to.speech.SpeechEngine
    ) {

      $scope.$on('$stateChangeSuccess', (
        event,
        toState,
        toParams,
        fromState,
        fromParams
      )=> {
        var bookmark:to.model.DbBookmark = {
          categoryId: toParams.categoryId,
          kanbanState: toParams.kanbanState,
          motivationId: toParams.motivationId,
          priorities: toParams.priorities,
          stateName: toState.name,
          type: 'bookmark',
          urgencies: toParams.urgencies
        };
        bookmark.hasCategoryFilter = toParams.categoryId && toParams.categoryId != 0;
        bookmark.hasEisenhowerFilter = (toParams.urgencies
          && toParams.urgencies != to.common.Urgency.All)
          || (toParams.priorities
          && toParams.priorities != to.common.Priority.All);

        if (toParams.kanbanState) {
          switch (parseInt(toParams.kanbanState)) {
            case to.common.Kanban.Planned:
              bookmark.hasKanbanPlannedFilter = true;
              break;
            case to.common.Kanban.Ready:
              bookmark.hasKanbanReadyFilter = true;
              break;
            case to.common.Kanban.InProgress:
              bookmark.hasKanbanInProgressFilter = true;
              break;
            case to.common.Kanban.RecentlyDone:
              bookmark.hasKanbanRecentlyDoneFilter = true;
              break;
          }
        }
        bookmark.hasMotivationFilter = toParams.motivationId && toParams.motivationId != 0;
        bookmark.hasFilters = bookmark.hasCategoryFilter || bookmark.hasEisenhowerFilter
          || bookmark.hasKanbanPlannedFilter || bookmark.hasKanbanReadyFilter
          || bookmark.hasKanbanInProgressFilter || bookmark.hasKanbanRecentlyDoneFilter
          || bookmark.hasMotivationFilter;

        this.bookmark = bookmark;
        this.bookmarkRepository.bookmarkExists(bookmark).then(( exists )=> {
          this.bookmarkSaved = exists;
          $scope.$apply();
        });
      });

    }

    getUpdateIconClass():any {
      let classObject = {};
      if (this.updateOrCheckInProgress) {
        classObject['fa-spin'] = true;
      }
      if (this.hasUpdate) {
        classObject['fa-download'] = true;
      } else {
        classObject['fa-refresh'] = true;
      }
      return classObject;
    }

    onUpdateButtonClick():void {
      if (this.hasUpdate) {
        this.doUpdate();
      } else {
        this.checkForUpdates();
      }
    }

    // Update app code with new release from Ionic Deploy
    private doUpdate():void {
      this.hasUpdate = false;
      this.updateOrCheckInProgress = true;
      this.deploy.update().then(( res ) => {
        console.log('Ionic Deploy: Update Success! ', res);
        this.updateOrCheckInProgress = false;
      }, ( err ) => {
        console.log('Ionic Deploy: Update error! ', err);
        this.updateOrCheckInProgress = false;
      }, ( prog ) => {
        console.log('Ionic Deploy: Progress... ', prog);
      });
    }

    // Check Ionic Deploy for new code
    private checkForUpdates():void {
      this.updateOrCheckInProgress = true;
      console.log('Ionic Deploy: Checking for updates');
      this.deploy.check().then(( hasUpdate ) => {
        console.log('Ionic Deploy: Update available: ' + hasUpdate);
        this.hasUpdate = hasUpdate;
        this.updateOrCheckInProgress = false;
      }, ( err ) => {
        this.updateOrCheckInProgress = false;
        console.error('Ionic Deploy: Unable to check for updates', err);
      });
    }

    modifyFilters() {
      var categoryLabel;
      var motivationLabel;

      var params = <any>this.$state.params;
      var operations:Promise<any>[] = [];
      //this.bookmarkRepository
      if (this.bookmark.hasCategoryFilter) {
        operations.push(this.categoryRepository.get(params.categoryId));
      }
      if (this.bookmark.hasMotivationFilter) {
        operations.push(this.motivationRepository.get(params.motivationId));
      }
      if (operations.length) {
        Promise.all(operations).then(( results )=> {
          if (this.bookmark.hasCategoryFilter) {
            categoryLabel = (<any>results[0]).name;
            if (this.bookmark.hasMotivationFilter) {
              motivationLabel = (<any>results[1]).description;
            }
          } else {
            motivationLabel = (<any>results[0]).description;
          }
          this.modifyFiltersWithLabels(categoryLabel, motivationLabel);
        });
      } else {
        this.modifyFiltersWithLabels(categoryLabel, motivationLabel);
      }
    }

    modifyFiltersWithLabels(
      categoryLabel:string,
      motivationLabel:string
    ) {

      var params = <any>this.$state.params;
      var buttons = [];
      var indexes = [];
      if (this.bookmark.hasEisenhowerFilter) {
        buttons.push({
          // TODO: setting text in table format causes it to be too far to the left
          text: to.common.getEisenhowerFilterDescription(params.priorities, params.urgencies)
        });
        indexes.push('EISENHOWER');
      }
      if (this.bookmark.hasKanbanPlannedFilter || this.bookmark.hasKanbanReadyFilter
        || this.bookmark.hasKanbanInProgressFilter || this.bookmark.hasKanbanRecentlyDoneFilter) {
        buttons.push({
          text: `<i class="fa ${to.common.getKanbanClass(params.kanbanState)}"></i>: ${to.common.getKanbanState(params.kanbanState)}`
        });
        indexes.push('KANBAN');
      }
      if (this.bookmark.hasCategoryFilter) {
        buttons.push({
          text: '<i class="fa fa-folder-open-o"></i>: ' + categoryLabel
        });
        indexes.push('CATEGORY');
      }
      if (this.bookmark.hasMotivationFilter) {
        buttons.push({
          text: '<i class="fa fa-dot-circle-o"></i>: ' + motivationLabel
        });
        indexes.push('MOTIVATION');
      }
      //if (indexes.length > 1) {
      //	buttons.push({text: 'All'});
      //	indexes.push('ALL');
      //}

      var filterActionSheet:any = {
        buttons: buttons,
        titleText: 'Remove from ' + to.common.getBookmarkViewName(this.$state.current.name),
        cancelText: 'Cancel',
        buttonClicked: ( index:number ) => {
          var params = JSON.parse(JSON.stringify(this.$state.params));
          switch (indexes[index]) {
            case 'KANBAN':
              params.kanbanState = to.common.Kanban.AllIncomplete;
              break;
            case 'EISENHOWER':
              params.priorities = to.common.Priority.All;
              params.urgencies = to.common.Urgency.All;
              break;
            case 'CATEGORY':
              params.categoryId = 0;
              break;
            case 'MOTIVATION':
              params.motivationId = 0;
              break;
            case 'ALL':
              params.kanbanState = to.common.Kanban.AllIncomplete;
              params.priorities = to.common.Priority.All;
              params.urgencies = to.common.Urgency.All;
              params.categoryId = 0;
              params.motivationId = 0;
              break;

          }
          this.$state.go(this.$state.current.name, params);
          return true;
        },
        destructiveButtonClicked: ()=> {
          this.bookmarkRepository.save(this.bookmark).then(( bookmark )=> {
            this.bookmark = bookmark;
            this.bookmarkSaved = true;
            this.$scope.$apply();
          });
          return true;
        }
      };
      if (!this.bookmarkSaved) {
        filterActionSheet.destructiveText = 'Make a new Bookmark';
      }

      this.$ionicActionSheet.show(filterActionSheet);
    }

    goBack() {
      window.history.back();
      jQuery('.org-back-button').hide();
    }

    getInfo() {
      var params = <any>this.$state.params;
      var urgencies = params.urgencies;
      var priorities = params.priorities;
      var kanbanState = params.kanbanState;
      var categoryId = params.categoryId;
      var motivationId = params.motivationId;

      switch (this.$state.current.name) {
        case to.common.states.CATEGORIES:
        case to.common.states.EDIT_ACTION:
        case to.common.states.EDIT_CATEGORIES_FOR_ACTION:
        case to.common.states.EDIT_CATEGORY:
        case to.common.states.EDIT_MOTIVATION:
        case to.common.states.EDIT_MOTIVATIONS_FOR_ACTION:
        case to.common.states.EISENHOWER:
        //to.track.getEisenhowerInfo(this.$state.params, icons, body);
        case to.common.states.ENTER_ACTION:
        case to.common.states.ENTER_CATEGORY:
        case to.common.states.ENTER_MOTIVATION:
        case to.common.states.LIST_ACTIONS:
        case to.common.states.MOTIVATIONS:
        case to.common.states.BOOKMARKS:
        case to.common.states.KANBAN:
          break;
        default:
      }
      console.log('in get info');
      // eval(settings.functionName + '(' + t.parentNode.id + ')');
    }

    // Get function from string, with or without scopes (by Nicolas Gauthier)
    getFunctionFromString( string ) {
      var scope = window;
      var scopeSplit = string.split('.');
      for (var i = 0; i < scopeSplit.length - 1; i++) {
        scope = scope[scopeSplit[i]];

        if (scope == undefined) return;
      }

      return scope[scopeSplit[scopeSplit.length - 1]];
    }
  }


  angular
    .module(
      'organizator'
    ).controller(
    'MainController'
    ,
    MainController
  );
}

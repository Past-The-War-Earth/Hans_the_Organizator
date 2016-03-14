angular.module('organizator', ['ionic', 'pouchdb'])
    .run(function ($ionicLoading, $ionicPlatform, $ionicPopup, pouchDB, actionRepository, bookmarkRepository, categoryRepository, motivationRepository) {
    $ionicLoading.show({
        template: 'Loading...'
    });
    $ionicPlatform.ready(function () {
        var theWindow = window;
        if (theWindow.cordova && theWindow.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (theWindow.StatusBar) {
            StatusBar.styleDefault();
        }
        var db = pouchDB('organizator', { auto_compaction: true });
        var dbOperations = [db.allDocs({ startkey: 'bookmark_', endkey: 'bookmark_\uffff', include_docs: true }),
            db.allDocs({ startkey: 'action_', endkey: 'action_\uffff', include_docs: true }),
            db.allDocs({ startkey: 'category_', endkey: 'category_\uffff', include_docs: true }),
            db.allDocs({ startkey: 'motivation_', endkey: 'motivation_\uffff', include_docs: true })];
        Promise.all(dbOperations).then(function (results) {
            bookmarkRepository.setObjects(results[0].rows.map(function (record) {
                return record.doc;
            }));
            actionRepository.setObjects(results[1].rows.map(function (record) {
                return record.doc;
            }));
            categoryRepository.setObjects(results[2].rows.map(function (record) {
                return record.doc;
            }));
            motivationRepository.setObjects(results[3].rows.map(function (record) {
                return record.doc;
            }));
            $ionicLoading.hide();
        }).catch(function (errors) {
            $ionicPopup.alert({
                title: 'Database Error',
                template: 'Error caching objects on startup.'
            });
        });
    });
})
    .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('to', {
        url: "/to",
        abstract: true,
        controller: 'MainController as vm',
        templateUrl: "to/common/menu.html"
    })
        .state(to.common.states.PLANS, {
        cache: false,
        url: '/plans',
        views: {
            'menuContent': {
                templateUrl: 'to/act/PlansView.html',
                controller: 'PlansController as vm'
            }
        }
    })
        .state(to.common.states.LIST_ACTIONS, {
        cache: false,
        url: '/list-actions/:urgencies/:priorities/:kanbanState/:categoryId/:motivationId',
        params: {
            urgencies: '5',
            priorities: '5',
            kanbanState: '5',
            categoryId: '0',
            motivationId: '0'
        },
        views: {
            'menuContent': {
                templateUrl: 'to/act/ListActionsView.html',
                controller: 'ListActionsController as vm'
            }
        }
    })
        .state(to.common.states.EDIT_ACTION, {
        cache: false,
        url: '/edit-action/:actionId',
        views: {
            'menuContent': {
                templateUrl: 'to/edit/EditActionView.html',
                controller: 'EditActionController as vm'
            }
        }
    })
        .state(to.common.states.EDIT_CATEGORY, {
        cache: false,
        url: '/edit-category/:id/:actionId',
        views: {
            'menuContent': {
                templateUrl: 'to/edit/EditCategoryView.html',
                controller: 'EditCategoryController as vm'
            }
        }
    })
        .state(to.common.states.EDIT_MOTIVATION, {
        cache: false,
        url: '/edit-motivation/:id/:actionId',
        views: {
            'menuContent': {
                templateUrl: 'to/edit/EditMotivationView.html',
                controller: 'EditMotivationController as vm'
            }
        }
    })
        .state(to.common.states.ENTER_ACTION, {
        url: '/enter-action/:brandNew',
        params: {
            brandNew: 'Y'
        },
        views: {
            'menuContent': {
                templateUrl: 'to/edit/EditActionView.html',
                controller: 'EnterActionController as vm'
            }
        }
    })
        .state(to.common.states.ACTION, {
        url: '/action/:actionId',
        views: {
            'menuContent': {
                templateUrl: 'to/enter/UnifiedActionView.html',
                controller: 'UnifiedActionController as vm'
            }
        }
    })
        .state(to.common.states.EDIT_CATEGORIES_FOR_ACTION, {
        cache: false,
        url: '/edit-categories-for-action/:actionId',
        views: {
            'menuContent': {
                templateUrl: 'to/edit/AddCategoriesToActionView.html',
                controller: 'AddCategoriesToActionController as vm'
            }
        }
    })
        .state(to.common.states.ENTER_CATEGORY, {
        cache: false,
        url: '/enter-category/:actionId',
        views: {
            'menuContent': {
                templateUrl: 'to/edit/EditCategoryView.html',
                controller: 'EnterCategoryController as vm'
            }
        }
    })
        .state(to.common.states.EDIT_MOTIVATIONS_FOR_ACTION, {
        cache: false,
        url: '/edit-motivations-for-action/:actionId',
        views: {
            'menuContent': {
                templateUrl: 'to/edit/AddMotivationsToActionView.html',
                controller: 'AddMotivationsToActionController as vm'
            }
        }
    })
        .state(to.common.states.ENTER_MOTIVATION, {
        url: '/enter-motivation/:actionId',
        views: {
            'menuContent': {
                templateUrl: 'to/edit/EditMotivationView.html',
                controller: 'EnterMotivationController as vm'
            }
        }
    })
        .state(to.common.states.ADD_AFTER_ACTIONS, {
        cache: false,
        url: '/add-after-actions-for-action/:actionId',
        views: {
            'menuContent': {
                templateUrl: 'to/edit/AddAfterActionsToActionView.html',
                controller: 'AddAfterActionsToActionController as vm'
            }
        }
    })
        .state(to.common.states.ADD_BEFORE_ACTIONS, {
        cache: false,
        url: '/add-before-actions-for-action/:actionId',
        views: {
            'menuContent': {
                templateUrl: 'to/edit/AddBeforeActionsToActionView.html',
                controller: 'AddBeforeActionsToActionController as vm'
            }
        }
    })
        .state(to.common.states.BOOKMARKS, {
        cache: false,
        url: '/bookmarks',
        views: {
            'menuContent': {
                templateUrl: 'to/track/BookmarksView.html',
                controller: 'BookmarksController as vm'
            }
        }
    })
        .state(to.common.states.EISENHOWER, {
        cache: false,
        url: '/eisenhower/:urgencies/:priorities/:kanbanState/:categoryId/:motivationId',
        params: {
            urgencies: '5',
            priorities: '5',
            kanbanState: '5',
            categoryId: '0',
            motivationId: '0'
        },
        views: {
            'menuContent': {
                templateUrl: 'to/track/EisenhowerView.html',
                controller: 'EisenhowerController as vm'
            }
        },
        info: 'to.track.getEisenhowerInfo'
    })
        .state(to.common.states.KANBAN, {
        cache: false,
        url: '/kanban/:urgencies/:priorities/:categoryId/:motivationId',
        params: {
            urgencies: '5',
            priorities: '5',
            categoryId: '0',
            motivationId: '0'
        },
        views: {
            'menuContent': {
                templateUrl: 'to/track/KanbanView.html',
                controller: 'KanbanController as vm'
            }
        }
    })
        .state(to.common.states.CATEGORIES, {
        cache: false,
        url: '/categories/:urgencies/:priorities/:kanbanState/:motivationId',
        params: {
            urgencies: '5',
            priorities: '5',
            kanbanState: '5',
            motivationId: '0'
        },
        views: {
            'menuContent': {
                templateUrl: 'to/track/CategoriesView.html',
                controller: 'CategoriesController as vm'
            }
        }
    })
        .state(to.common.states.MOTIVATIONS, {
        cache: false,
        url: '/motivations/:urgencies/:priorities/:kanbanState/:categoryId',
        params: {
            urgencies: '5',
            priorities: '5',
            kanbanState: '5',
            categoryId: '0'
        },
        views: {
            'menuContent': {
                templateUrl: 'to/track/MotivationsView.html',
                controller: 'MotivationsController as vm'
            }
        }
    })
        .state(to.common.states.VIEW_ACTION, {
        cache: false,
        url: '/view-action/:actionId/:archive',
        views: {
            'menuContent': {
                templateUrl: 'to/view/ViewActionView.html',
                controller: 'ViewActionController as vm'
            }
        }
    })
        .state(to.common.states.VIEW_CATEGORY, {
        cache: false,
        url: '/view-category/:urgencies/:priorities/:kanbanState/:categoryId',
        views: {
            'menuContent': {
                templateUrl: 'to/view/ViewCategoryView.html',
                controller: 'ViewCategoryController as vm'
            }
        }
    })
        .state(to.common.states.VIEW_MOTIVATION, {
        cache: false,
        url: '/view-motivation/:urgencies/:priorities/:kanbanState/:motivationId',
        views: {
            'menuContent': {
                templateUrl: 'to/view/ViewMotivationView.html',
                controller: 'ViewMotivationController as vm'
            }
        }
    })
        .state(to.common.states.ARCHIVE, {
        cache: false,
        url: '/archive',
        views: {
            'menuContent': {
                templateUrl: 'to/act/ArchiveView.html',
                controller: 'ArchiveController as vm'
            }
        }
    })
        .state(to.common.states.CHART_BUBBLE, {
        cache: false,
        url: '/chart/bubble',
        views: {
            'menuContent': {
                templateUrl: 'to/chart/BubbleChartView.html',
                controller: 'BubbleChartController as vm'
            }
        }
    })
        .state(to.common.states.CHART_BUBBLE_CLICKABLE, {
        cache: false,
        url: '/chart/bubble-clickable/:urgencies/:priorities/:kanbanState/:categoryId/:motivationId',
        params: {
            urgencies: '5',
            priorities: '5',
            kanbanState: '5',
            categoryId: '0',
            motivationId: '0'
        },
        views: {
            'menuContent': {
                templateUrl: 'to/chart/ClickableBubbleChartView.html',
                controller: 'ClickableBubbleChartController as vm'
            }
        }
    });
    $urlRouterProvider.otherwise('/to/kanban/5/5/0/0');
});
//# sourceMappingURL=app.js.map
///<reference path="../imports.ts"/>
/**
 * Created by artem on 3/27/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var to;
(function (to) {
    var storage;
    (function (storage) {
        var CategoryRepository = (function (_super) {
            __extends(CategoryRepository, _super);
            function CategoryRepository($ionicPopup, actionRepository, pouchDB) {
                _super.call(this, $ionicPopup, 'category_', pouchDB);
                this.actionRepository = actionRepository;
                this.categories = [];
            }
            CategoryRepository.prototype.getByParameters = function (urgencies, priorities, kanbanState, motivationId) {
                var _this = this;
                if (urgencies == to.common.Urgency.All && priorities == to.common.Priority.All && kanbanState == to.common.Kanban.AllIncomplete && motivationId == "0") {
                    return this.getAll();
                }
                var categoryIdMap = {};
                return this.actionRepository.getByParameters(urgencies, priorities, kanbanState, 0, motivationId).then(function (actions) {
                    actions.forEach(function (action) {
                        action.categoryIds.forEach(function (categoryId) {
                            categoryIdMap[categoryId] = true;
                        });
                    });
                    var categoryIds = [];
                    for (var categoryId in categoryIdMap) {
                        categoryIds.push(categoryId);
                    }
                    return _this.getAllByIds(categoryIds);
                });
            };
            return CategoryRepository;
        }(storage.CachedRepository));
        storage.CategoryRepository = CategoryRepository;
        angular.module('organizator').service('categoryRepository', CategoryRepository);
    })(storage = to.storage || (to.storage = {}));
})(to || (to = {}));
//# sourceMappingURL=CategoryRepository.js.map
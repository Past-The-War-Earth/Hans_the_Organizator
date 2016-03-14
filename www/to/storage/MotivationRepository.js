///<reference path="../imports.ts"/>
/**
 * Created by artem on 4/4/15.
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
        var MotivationRepository = (function (_super) {
            __extends(MotivationRepository, _super);
            function MotivationRepository($ionicPopup, actionRepository, pouchDB) {
                _super.call(this, $ionicPopup, 'motivation_', pouchDB);
                this.actionRepository = actionRepository;
            }
            MotivationRepository.prototype.getByParameters = function (urgencies, priorities, kanbanState, categoryId) {
                var _this = this;
                if (urgencies == to.common.Urgency.All && priorities == to.common.Priority.All && kanbanState == to.common.Kanban.AllIncomplete && categoryId == "0") {
                    return this.getAll();
                }
                return this.actionRepository.getByParameters(urgencies, priorities, kanbanState, categoryId, 0).then(function (actions) {
                    var motivationIdMap = {};
                    actions.forEach(function (action) {
                        action.motivationIds.forEach(function (motivationId) {
                            motivationIdMap[motivationId] = true;
                        });
                    });
                    var motivationIds = [];
                    for (var motivationId in motivationIdMap) {
                        motivationIds.push(motivationId);
                    }
                    return _this.getAllByIds(motivationIds);
                });
            };
            return MotivationRepository;
        }(storage.CachedRepository));
        storage.MotivationRepository = MotivationRepository;
        angular.module('organizator').service('motivationRepository', MotivationRepository);
    })(storage = to.storage || (to.storage = {}));
})(to || (to = {}));
//# sourceMappingURL=MotivationRepository.js.map
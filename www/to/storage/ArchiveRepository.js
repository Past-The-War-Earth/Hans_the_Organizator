///<reference path="../imports.ts"/>
/**
 * Created by artem on 4/29/15.
 */
var to;
(function (to) {
    var storage;
    (function (storage) {
        var ArchiveRepository = (function () {
            function ArchiveRepository($ionicPopup, pouchDB) {
                this.$ionicPopup = $ionicPopup;
                this.db = pouchDB('archive');
            }
            ArchiveRepository.prototype.get = function (actionId) {
                var _this = this;
                return this.db.get(actionId).then(function (action) {
                    return action;
                }).catch(function (errors) {
                    _this.$ionicPopup.alert({
                        title: 'Database Error',
                        template: 'Error retrieving from archive.'
                    });
                });
            };
            //save(action:to.model.Action):void {
            //	action._id = 'archive_' + to.common.getCurrentDateTimestamp();
            //	delete action._rev;
            //	return this.db.put(action);
            //}
            ArchiveRepository.prototype.getAll = function () {
                var _this = this;
                return this.db.allDocs({ startkey: 'archive_', endkey: 'archive_\uffff', include_docs: true })
                    .then(function (result) {
                    return result.rows.map(function (record) {
                        return record.doc;
                    });
                }).catch(function (errors) {
                    _this.$ionicPopup.alert({
                        title: 'Database Error',
                        template: 'Error retrieving the archive.'
                    });
                });
            };
            return ArchiveRepository;
        }());
        storage.ArchiveRepository = ArchiveRepository;
        angular.module('organizator').service('archiveRepository', ArchiveRepository);
    })(storage = to.storage || (to.storage = {}));
})(to || (to = {}));
//# sourceMappingURL=ArchiveRepository.js.map
///<reference path="../imports.ts"/>
/**
 * Created by artem on 6/26/15.
 */
var to;
(function (to) {
    var storage;
    (function (storage) {
        var CachedRepository = (function () {
            function CachedRepository($ionicPopup, idPrefix, pouchDB) {
                this.$ionicPopup = $ionicPopup;
                this.idPrefix = idPrefix;
                this.db = pouchDB('organizator');
            }
            CachedRepository.prototype.setObjects = function (objects) {
                var _this = this;
                this.objects = objects;
                this.mapById = {};
                this.objects.forEach(function (object) {
                    _this.mapById[object._id] = object;
                });
            };
            CachedRepository.prototype.get = function (id) {
                var _this = this;
                return new Promise(function (resolve) {
                    _this.getAsync(id, resolve);
                });
            };
            CachedRepository.prototype.getAsync = function (id, callback) {
                var _this = this;
                if (!this.mapById) {
                    setTimeout(function () {
                        _this.getAsync(id, callback);
                    }, 300);
                }
                else {
                    callback(this.mapById[id]);
                }
            };
            CachedRepository.prototype.getAll = function () {
                var _this = this;
                return new Promise(function (resolve) {
                    _this.getAllAsync(resolve);
                });
            };
            CachedRepository.prototype.getMap = function () {
                var _this = this;
                return this.getAll().then(function () {
                    return _this.mapById;
                });
            };
            CachedRepository.prototype.getAllAsync = function (callback) {
                var _this = this;
                if (this.objects) {
                    callback(this.objects);
                }
                else {
                    setTimeout(function () {
                        _this.getAllAsync(callback);
                    }, 300);
                }
            };
            // FIXME: prototype code, use proper PouchDB interface for this
            CachedRepository.prototype.getAllByIds = function (objectIds) {
                var _this = this;
                return this.getAll().then(function () {
                    var objects = [];
                    if (objectIds) {
                        objectIds.forEach(function (objectId) {
                            objects.push(_this.mapById[objectId]);
                        });
                    }
                    return objects;
                });
            };
            //protected getAllByIdsAsync(callback:(objects:DBO[])=> {})
            CachedRepository.prototype.preSave = function (object, today) {
            };
            CachedRepository.prototype.save = function (object) {
                var _this = this;
                return new Promise(function (resolve) {
                    var today = to.common.getStartOfDayDate();
                    _this.preSave(object, today);
                    object.createdDate = today;
                    object._id = _this.idPrefix + to.common.getCurrentDateTimestamp();
                    _this.db.put(object)
                        .then(function (record) {
                        object._rev = record.rev;
                        resolve(object);
                    }).catch(function (errors) {
                        _this.$ionicPopup.alert({
                            title: 'Database Error',
                            template: 'Error creating an object.'
                        });
                    });
                    object.cacheIndex = _this.objects.length;
                    _this.mapById[object._id] = object;
                    _this.objects.push(object);
                });
            };
            CachedRepository.prototype.update = function (object) {
                var _this = this;
                return new Promise(function (resolve) {
                    object.updatedDate = to.common.getStartOfDayDate();
                    _this.db.put(object)
                        .then(function (record) {
                        object._rev = record.rev;
                        resolve(object);
                    }).catch(function (errors) {
                        _this.$ionicPopup.alert({
                            title: 'Database Error',
                            template: 'Error updating an object.'
                        });
                    });
                });
            };
            return CachedRepository;
        }());
        storage.CachedRepository = CachedRepository;
    })(storage = to.storage || (to.storage = {}));
})(to || (to = {}));
//# sourceMappingURL=CachedRepository.js.map
///<reference path="../imports.ts"/>
/**
 * Created by artem on 7/12/15.
 */
var to;
(function (to) {
    var common;
    (function (common) {
        common.matrixColors = [
            ['BBBBFF', 'BBBBEE', 'BBBBDD', 'BBBBCC', 'BBBBBB'],
            ['BBFFFF', 'BBEEEE', 'BBDDDD', 'BBCCCC', 'BBBBBB'],
            ['BBFFBB', 'BBEEBB', 'BBDDBB', 'BBCCBB', 'BBBBBB'],
            ['FFFFBB', 'EEEEBB', 'DDDDBB', 'CCCCBB', 'BBBBBB'],
            //['FFCCBB', 'EECCBB', 'DDCCBB', 'CCBBBB' , 'BBBBBB'],
            ['FFBBBB', 'EEBBBB', 'DDBBBB', 'CCBBBB', 'BBBBBB']
        ];
        common.selectedMatrixColors = [
            ['7777FF', '7777DD', '7777BB', '777799', '777777'],
            ['77FFFF', '77DDDD', '77BBBB', '779999', '777777'],
            ['77FF77', '77DD77', '77BB77', '779977', '777777'],
            ['FFFF77', 'DDDD77', 'BBBB77', '999977', '777777'],
            //['FF99BB', 'BB99BB', 'BB99BB', '99BBBB' , 'BBBBBB'],
            ['FF7777', 'DD7777', 'BB7777', '997777', '777777']
        ];
        common.urgencyColors = [
            'BBBBFF', 'BBFFFF', 'BBFFBB', 'FFFFBB', 'FFBBBB'
        ];
        common.selectedUrgencyColors = [
            '7777FF', '77FFFF', '77FF77', 'FFFF77', 'FF7777'
        ];
        common.priorityColors = [
            'FFFFFF', 'EEEEEE', 'DDDDDD', 'CCCCCC', 'BBBBBB'
        ];
        common.selectedPriorityColors = [
            'FFFFFF', 'DDDDDD', 'BBBBBB', '999999', '777777'
        ];
    })(common = to.common || (to.common = {}));
})(to || (to = {}));
//# sourceMappingURL=UnifiedController.js.map
"use strict";
exports.__esModule = true;
var IsDate = /** @class */ (function () {
    function IsDate() {
    }
    IsDate.prototype.isFutureDate = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length === 3) {
            var year = args[0], month = args[1], day = args[2];
            return new Date(year, month, day) > new Date();
        }
        var dateOrString = args[0];
        if (dateOrString instanceof Date) {
            return dateOrString > new Date();
        }
        return new Date(dateOrString) > new Date();
    };
    return IsDate;
}());
console.log(new Date());
console.log(new IsDate().isFutureDate('05 October 2023 14:48 UTC'));

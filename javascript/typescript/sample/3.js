"use strict";
exports.__esModule = true;
function useTime(getTimeFunc) {
    var timeOrUndefined = getTimeFunc === null || getTimeFunc === void 0 ? void 0 : getTimeFunc();
}
function checkForAdultUser(user) {
    if (user === null || user === void 0 ? void 0 : user.isAdult()) {
        console.log("user is adult");
    }
    else {
        console.log("user is child");
    }
}
var User = /** @class */ (function () {
    function User(age) {
        this.age = age;
    }
    User.prototype.isAdult = function () {
        return this.age > 18;
    };
    return User;
}());
var sampleUser1 = new User(45);
console.log(sampleUser1.age, sampleUser1.isAdult());
checkForAdultUser(sampleUser1);

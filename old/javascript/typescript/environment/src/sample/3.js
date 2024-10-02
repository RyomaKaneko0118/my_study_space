"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function useTime(getTimeFunc) {
    const timeOrUndefined = getTimeFunc === null || getTimeFunc === void 0 ? void 0 : getTimeFunc();
}
function checkForAdultUser(user) {
    if (user === null || user === void 0 ? void 0 : user.isAdult()) {
        console.log(`user is adult`);
    }
    else {
        console.log(`user is child`);
    }
}
class User {
    constructor(age) {
        this.age = age;
    }
    isAdult() {
        return this.age > 18;
    }
}
const sampleUser1 = new User(45);
console.log(sampleUser1.age, sampleUser1.isAdult());
checkForAdultUser(sampleUser1);
checkForAdultUser(null);

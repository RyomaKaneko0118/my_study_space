"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IsDate {
    isFuture(...args) {
        if (args.length === 3) {
            const [year, month, day] = args;
            return new Date(year, month, day) > new Date();
        }
        const dateOrString = args[0];
        if (dateOrString instanceof Date) {
            return dateOrString > new Date();
        }
        return new Date(dateOrString) > new Date();
    }
}

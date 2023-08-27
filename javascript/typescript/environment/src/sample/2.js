"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getName(human) {
    return human.name;
}
function getSpecies(animal) {
    return animal.age;
}
const randomFunction = Math.random() < 0.5 ? getName : getSpecies;
const sample = {
    name: "taro",
    age: 145
};
const result = randomFunction(sample);
console.log(result);

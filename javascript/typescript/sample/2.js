"use strict";
exports.__esModule = true;
function getName(human) {
    return human.name;
}
function getSpecies(animal) {
    return animal.species;
}
var randomFunction = Math.random() < 0.5 ? getName : getSpecies;
var sample = {
    name: "taro",
    species: "dog"
};
console.log(randomFunction(sample));

let _ = require('lodash');

let arraya = [1, 2, 3, 4, 5, 6, 7];
let arrayb = [2, 3, 4];
let array = [];

let a = _(arrayb).reduce(() => {}).value();
console.log(a);




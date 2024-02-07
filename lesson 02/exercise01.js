let diceRoll=[1,6,6,2,3,4,6];
const log6 = (v, index) => v === 6 && console.log(index + ":" + v);
const log = (v, index, compare) => compare(v) && console.log(index + ":" + v);

// 1) Write a function get6s_v1 that takes an array of numbers (dice values 1..6) as parameter, and prints the indexes and corresponding values of the array where elements are 6s. E.g., 1:6, 2:6, 6:6 ..." excluding other elements. At this stage, just write a basic version, eg. without using functions as parameters
// Apply the function to the above array as argument.

console.log("Part 1");

const get6s_v1 = (dice) => dice.forEach(log6);
get6s_v1(diceRoll);

// 2) Write a helper function eg "is6(v)" that can test if the supplied parameter value v is a 6
// Rewrite get6s_v1 to get6_v2 such that it uses the helper function to test if the index/value should be printed.
// Apply the function to the above array.

console.log("Part 2");

const is6 = v => v === 6;

const get6s_v2 = (dice) => dice
    .forEach((v, i) => log(v, i, is6));
get6s_v2(diceRoll);

// 3) Now create a get6s_v3 that rewrites get6_v2 to accept a dice array as first parameter, and a "compare" function as second parameter.
// Apply the function using the diceRoll and function "is6" as actual arguments

console.log("Part 3");

const get6s_v3 = (dice, compare) => dice
    .forEach((v, i) => log(v, i, compare));
get6s_v3(diceRoll, is6);

// 4) Copy and rename the get6s_v3 function to findDices_v1(dice,compare). Call it with the same arguments as above using the diceRoll and function "is6"
// Then call it using a function expression (named or anonymous) at the call site, to pass a function that selects 1 dices.

console.log("Part 4");

const findDices_v1 = (dice, compare) => dice
    .forEach((v, i) => log(v, i, compare));
findDices_v1(diceRoll, v => v === 1);

// 5) Then call it using a lambda expression to pass a function that selects dices with values <= 3.

console.log("Part 5");
findDices_v1(diceRoll, v => v <= 3);

// (advanced:)  what does the following statement produce?
// diceRoll
// .filter(dice=>dice==6)               // [6,6,6]
// .reduce((sum,dice)=>sum+dice,0);     // 18

const avgStringLength = (strings) =>
    strings.reduce((acc, str) => acc + str.length, 0) / strings.length

console.log("average string length:", avgStringLength(["Hej", "med", "dig"])); // 4.333333333333333

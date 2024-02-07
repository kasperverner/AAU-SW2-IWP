const makeTriangle = n => Array(n)
    .fill([])
    .map((_, i) => Array(n)
        .fill('')
        .map((_, j) => i >= j ? '*' : ' ')
        .join(''))
    .join('\n');

console.log(makeTriangle(8));

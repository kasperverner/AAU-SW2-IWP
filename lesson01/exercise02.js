const printChessBoard = (size) =>  Array(size)
    .fill([])
    .map((_, i) => Array(size)
        .fill("")
        .map((_, j) => (i + j) % 2 === 0 ? " " : "#")
        .join('')
    )
    .join('\n');

console.log(printChessBoard(8));

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateLottoCards() {
  let cards = [];

  for (let c = 0; c < 24; c++) {
    // Generate possible numbers in each column
    let numberSets = [
      Array.from({ length: 9 }, (_, i) => i + 1),
      Array.from({ length: 10 }, (_, i) => i + 10),
      Array.from({ length: 10 }, (_, i) => i + 20),
      Array.from({ length: 10 }, (_, i) => i + 30),
      Array.from({ length: 10 }, (_, i) => i + 40),
      Array.from({ length: 10 }, (_, i) => i + 50),
      Array.from({ length: 10 }, (_, i) => i + 60),
      Array.from({ length: 10 }, (_, i) => i + 70),
      Array.from({ length: 11 }, (_, i) => i + 80),
    ];

    let card = Array.from({ length: 3 }, () => Array(9).fill(0));
    let columnCounts = new Array(9).fill(0);
    let rowCounts = new Array(3).fill(0);

    // Function to add number to a specific cell in the given row and column
    let addNumber = function (row, col) {
      let numbers = numberSets[col];
      let index = Math.floor(Math.random() * numbers.length);
      card[row][col] = numbers.splice(index, 1)[0];
      columnCounts[col]++;
      rowCounts[row]++;
    };

    // Create a list of column indices and shuffle it
    let cols = shuffleArray(Array.from({ length: 9 }, (_, i) => i));

    // Add at least one number to each row and column
    for (let colIndex = 0; colIndex < 9; colIndex++) {
      let col = cols[colIndex];
      for (let row = 0; row < 3; row++) {
        if (rowCounts[row] < 4 && columnCounts[col] < 2) {
          addNumber(row, col);
        }
      }
    }

    // Randomly fill remaining cells
    while (rowCounts.some((count) => count < 5)) {
      for (let colIndex = 0; colIndex < 9; colIndex++) {
        let col = cols[colIndex];
        while (columnCounts[col] < 2) {
          let rows = Array.from({ length: 3 }, (_, i) => i).filter(
            (row) => rowCounts[row] < 5 && card[row][col] === 0
          );
          if (rows.length === 0) {
            break;
          }
          let row = rows[Math.floor(Math.random() * rows.length)];
          addNumber(row, col);
        }
      }
    }

    cards.push(card);
  }

  return cards;
}

// console.log(
//   generateLottoCards()
//     .map(
//       (t) =>
//         t.map((y) => y.map((y) => (y === 0 ? " " : y)).join("\t")).join("\n") +
//         "\n"
//     )
//     .join("\n")
// );
let deltas = [];

for (let i = 0; i < 100000; i++) {
  let startTime = new Date().getTime();
  generateLottoCards();
  deltas.push((new Date().getTime() - startTime) / 1000);
}

console.log(deltas.reduce((acc, v) => acc + v, 0) / deltas.length);

function shuffleArray(array: number[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function generateLottoCards({ amount = 1 } = {}) {
  const cards = [];

  for (let c = 0; c < amount; c++) {
    // Generate possible numbers in each column
    const numberSets = [
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

    const card = Array.from({ length: 3 }, () => Array(9).fill(0));
    const columnCounts = new Array(9).fill(0);
    const rowCounts = new Array(3).fill(0);

    // Function to add number to a specific cell in the given row and column
    const addNumber = function (row: number, col: number) {
      const numbers = numberSets[col];
      const index = Math.floor(Math.random() * numbers.length);
      card[row][col] = numbers.splice(index, 1)[0];
      columnCounts[col]++;
      rowCounts[row]++;
    };

    // Create a list of column indices and shuffle it
    const cols = shuffleArray(Array.from({ length: 9 }, (_, i) => i));

    // Add at least one number to each row and column
    for (let colIndex = 0; colIndex < 9; colIndex++) {
      const col = cols[colIndex];
      for (let row = 0; row < 3; row++) {
        if (rowCounts[row] < 4 && columnCounts[col] < 2) {
          addNumber(row, col);
        }
      }
    }

    // Randomly fill remaining cells
    while (rowCounts.some((count) => count < 5)) {
      for (let colIndex = 0; colIndex < 9; colIndex++) {
        const col = cols[colIndex];
        while (columnCounts[col] < 2) {
          const rows = Array.from({ length: 3 }, (_, i) => i).filter(
            (row) => rowCounts[row] < 5 && card[row][col] === 0
          );
          if (rows.length === 0) {
            break;
          }
          const row = rows[Math.floor(Math.random() * rows.length)];
          addNumber(row, col);
        }
      }
    }

    cards.push(card);
  }

  return cards;
}

export const generateRandomUniqueNumbersArray = (length: number) => {
  const arr = [];
  while (arr.length < length) {
    const r = Math.floor(Math.random() * length) + 1;
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
};

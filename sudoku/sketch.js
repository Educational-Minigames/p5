const params = new URLSearchParams(window.location.search)
const dem = Number(params.get('n')) || 9;

const numbers = dem === 9 ? [
  [5, 1, 7, 6, 0, 0, 0, 3, 4],
  [2, 8, 9, 0, 0, 4, 0, 0, 0],
  [3, 4, 6, 2, 0, 5, 0, 9, 0],
  [6, 0, 2, 0, 0, 0, 0, 1, 0],
  [0, 3, 8, 0, 0, 6, 0, 4, 7],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 9, 0, 0, 0, 0, 0, 7, 8],
  [7, 0, 3, 4, 0, 0, 5, 6, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]] : [
  [0, 0, 1, 6, 0, 0],
  [0, 4, 0, 0, 3, 0],
  [1, 0, 3, 4, 0, 6],
  [4, 0, 2, 5, 0, 3],
  [0, 1, 0, 0, 6, 0],
  [0, 0, 4, 3, 0, 0]];

const changeableNumbers = numbers.map((item) => item.map((item) => item === 0 ? true : false));
const conflictCheckbox = document.getElementById('conflict')
const domainCheckbox = document.getElementById('domain')
const helpCheckbox = document.getElementById('help')
const resetButton = document.getElementById('reset')
const sudoku = document.getElementById("sudoku");
const mask = document.getElementById("mask");

for (let i = 0; i < dem; i++) {
  for (let j = 0; j < dem; j++) {
    const item = document.createElement('div');
    const maskItem = document.createElement('div');
    item.classList.add("sudoku-item");
    maskItem.classList.add("mask-item");
    if (i % (dem / 3) === 0) {
      item.style.borderTop = "4px solid black";
      maskItem.style.borderTop = "4px solid transparent";
    }
    if (j % 3 === 0) {
      item.style.borderLeft = "4px solid black";
      maskItem.style.borderLeft = "4px solid transparent";
    }
    if (i === dem - 1) {
      item.style.borderBottom = "4px solid black";
      maskItem.style.borderBottom = "4px solid transparent";
    }
    if (j === dem - 1) {
      item.style.borderRight = "4px solid black";
      maskItem.style.borderRight = "4px solid transparent";
    }
    item.inputMode = "numeric";
    item.id = `item-${i}-${j}`;

    maskItem.style.gridTemplateColumns = `repeat(3, 1fr)`;
    maskItem.style.gridTemplateRows = `repeat(${dem / 3}, 1fr)`;
    maskItem.id = `mask-item-${i}-${j}`;
    sudoku.appendChild(item);
    mask.appendChild(maskItem);
  }
}

sudoku.style.gridTemplateColumns = `repeat(${dem}, 2rem)`;
sudoku.style.gridTemplateRows = `repeat(${dem}, 2rem)`;
mask.style.gridTemplateColumns = `repeat(${dem}, 2rem)`;
mask.style.gridTemplateRows = `repeat(${dem}, 2rem)`;

let showConflicts = conflictCheckbox.checked;
let showDomains = domainCheckbox.checked;
let showHelp = helpCheckbox.checked;

helpCheckbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    showHelp = true;
  } else {
    showHelp = false;
  }
  printHelp(numbers);
})

domainCheckbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    showDomains = true;
  } else {
    showDomains = false;
  }
  printDomains(numbers);
})

conflictCheckbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    showConflicts = true;
  } else {
    showConflicts = false;
  }
  printConflicts(numbers);
})

resetButton.addEventListener('click', (event) => {
  reset();
})

for (let i = 0; i < dem; i++) {
  for (let j = 0; j < dem; j++) {
    const item = sudoku.children.item(i * dem + j);

    if (numbers[i][j] !== 0) {
      item.innerHTML = numbers[i][j]
      item.style.removeProperty('background-color');
    }
    else {
      item.style.color = "#1976d2"
      item.contentEditable = true
      item.addEventListener('input', function () {
        // Remove any non-digit characters
        this.textContent = this.textContent.replace(new RegExp(`(\\D|0|(?![0-${dem}])\\d)`, 'g'), '');

        if (this.textContent.length > 1) {
          this.textContent = this.textContent.slice(0, 1);
        }

        let number = parseInt(this.textContent);
        numbers[i][j] = Number.isNaN(number) ? 0 : number;

        printConflicts(numbers);
        printDomains(numbers);
        printHelp();
      });
      item.addEventListener('keydown', function (event) {
        if (event.keyCode === 8) {
          event.preventDefault();
          this.textContent = '';
          numbers[i][j] = 0;

          printConflicts(numbers);
          printDomains(numbers);
          printHelp();
        }
      });
    }
  }
}

function transposeArray(array) {
  var newArray = [];
  for (var i = 0; i < array.length; i++) {
    newArray.push([]);
  }

  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < array.length; j++) {
      newArray[j].push(array[i][j]);
    }
  }

  return newArray;
}

function getBlock(arr, x, y) {
  x *= 3
  y *= (dem / 3)
  let cell = []
  for (let i = y; i < y + (dem / 3); i++) {
    for (let j = x; j < x + 3; j++) {
      cell.push(arr[i][j])
    }
  }
  return cell;
}

function getBlockij(arr, i, j) {
  let I = Math.floor(i / (dem / 3));
  let J = Math.floor(j / 3);
  return getBlock(arr, J, I);
}

function printDomains(numbers) {
  if (!showDomains) {
    for (let i = 0; i < dem; i++) {
      for (let j = 0; j < dem; j++) {
        let item = mask.children.item(i * dem + j);
        item.innerHTML = "";
      }
    }
    return;
  }

  for (let i = 0; i < dem; i++) {
    let row = numbers[i];
    for (let j = 0; j < dem; j++) {
      if (numbers[i][j] != 0) {
        let item = mask.children.item(i * dem + j);
        item.innerHTML = "";
        continue;
      }
      let col = transposeArray(numbers)[j];
      let block = getBlockij(numbers, i, j);
      let used = new Set([...row, ...col, ...block]);
      let domain = new Array(dem).fill(0).map((item, index) => index + 1);
      let item = mask.children.item(i * dem + j);
      item.innerHTML = "";
      for (let i = 0; i < domain.length; i++) {
        let div = document.createElement("div");
        div.innerHTML = used.has(domain[i]) ? " " : domain[i];
        div.className = "domain";
        item.appendChild(div);
      }
    }
  }
}

function printConflicts(numbers) {
  for (let i = 0; i < dem; i++) {
    for (let j = 0; j < dem; j++) {
      let item = mask.children.item(i * dem + j);
      item.style.removeProperty('background-color');;
    }
  }

  if (dem === 6) {
    for (let i = 0; i < dem; i++) {
      let item = mask.children.item(i * dem + i);
      item.style.backgroundColor = "#22222230";
      item = mask.children.item(i * dem + dem - 1 - i);
      item.style.backgroundColor = "#22222230";
    }
  }

  if (!showConflicts) {
    return;
  }

  for (let i = 0; i < dem; i++) {
    let row = numbers[i];
    let col = transposeArray(numbers)[i];
    let block = getBlock(numbers, i % (dem / 3), Math.floor(i / (dem / 3)));

    let hasConflictInRow = false;
    let hasConflictInCol = false;
    let hasConflictInBlock = false;
    row.forEach((item, index) => {
      if (item !== 0 && row.indexOf(item) !== index) {
        hasConflictInRow = true;
      }
    });

    col.forEach((item, index) => {
      if (item !== 0 && col.indexOf(item) !== index) {
        hasConflictInCol = true;
      }
    });

    block.forEach((item, index) => {
      if (item !== 0 && block.indexOf(item) !== index) {
        hasConflictInBlock = true;
      }
    });

    if (hasConflictInRow) {
      for (let j = 0; j < dem; j++) {
        let item = mask.children.item(i * dem + j);
        item.style.backgroundColor = "#ff525260";
      }
    }
    if (hasConflictInCol) {
      for (let j = 0; j < dem; j++) {
        let item = mask.children.item(j * dem + i);
        item.style.backgroundColor = "#ff525260";
      }
    }
    if (hasConflictInBlock) {
      for (let j = 0; j < dem; j++) {
        let item = mask.children.item((Math.floor(i / (dem / 3)) * (dem / 3) + Math.floor(j / 3)) * dem + (i % (dem / 3) * 3 + j % 3));
        item.style.backgroundColor = "#ff525260";
      }
    }

  }
  
  if (dem === 6) {
    let hasConflictInDiagonal = false;

    for (let i = 0; i < dem; i++) {
      const a = numbers[i][i];
      for (let j = 0; j < dem; j++) {
        const b = numbers[j][j];
        if (a !== 0 && a === b && i !== j) {
          hasConflictInDiagonal = true;
          break;
        }
      }
    }

    if (hasConflictInDiagonal) {
      for (let i = 0; i < dem; i++) {
        let item = mask.children.item(i * dem + i);
        item.style.backgroundColor = "#ff525260";
      }
    }

    hasConflictInDiagonal = false;

    for (let i = 0; i < dem; i++) {
      const a = numbers[i][dem - 1 - i];
      for (let j = 0; j < dem; j++) {
        const b = numbers[j][dem - 1 - j];
        if (a !== 0 && a === b && i !== j) {
          hasConflictInDiagonal = true;
          break;
        }
      }
    }

    if (hasConflictInDiagonal) {
      for (let i = 0; i < dem; i++) {
        let item = mask.children.item(i * dem + dem - 1 - i);
        item.style.backgroundColor = "#ff525260";
      }
    }
  }
}

function reset() {
  for (let i = 0; i < dem; i++) {
    for (let j = 0; j < dem; j++) {
      if (changeableNumbers[i][j] === true) {
        let item = sudoku.children.item(i * dem + j);
        item.innerHTML = "";
        numbers[i][j] = 0;
      }
    }
  }
  printConflicts(numbers);
  printDomains(numbers);
  printHelp()
}

function printHelp() {
  for (let i = 0; i < dem; i++) {
    for (let j = 0; j < dem; j++) {
      let item = sudoku.children.item(i * dem + j);
      item.style.removeProperty('background-color');
    }
  }

  if (!showHelp) {
    return;
  }

  let minDomain = dem;
  let minDomainI = 0;
  let minDomainJ = 0;
  for (let i = 0; i < dem; i++) {
    let row = numbers[i];
    for (let j = 0; j < dem; j++) {
      if (numbers[i][j] != 0) {
        continue;
      }
      let col = transposeArray(numbers)[j];
      let block = getBlockij(numbers, i, j);
      let used = new Set([...row, ...col, ...block]);
      used.delete(0);
      let domainSize = dem - used.size;
      if (domainSize < minDomain && domainSize > 0) {
        minDomain = domainSize;
        minDomainI = i;
        minDomainJ = j;
      }
    }
  }
  let item = sudoku.children.item(minDomainI * dem + minDomainJ);
  item.style.backgroundColor = "#E6AF2Eaa";
}

printConflicts(numbers);
printDomains(numbers);
printHelp();
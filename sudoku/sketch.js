const numbers = [
  [5, 1, 7, 6, 0, 0, 0, 3, 4],
  [2, 8, 9, 0, 0, 4, 0, 0, 0],
  [3, 4, 6, 2, 0, 5, 0, 9, 0],
  [6, 0, 2, 0, 0, 0, 0, 1, 0],
  [0, 3, 8, 0, 0, 6, 0, 4, 7],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 9, 0, 0, 0, 0, 0, 7, 8],
  [7, 0, 3, 4, 0, 0, 5, 6, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]];

const changeableNumbers = numbers.map((item) => item.map((item) => item === 0 ? true : false));
const conflictCheckbox = document.getElementById('conflict')
const domainCheckbox = document.getElementById('domain')
const helpCheckbox = document.getElementById('help')
const resetButton = document.getElementById('reset')
const sudoku = document.getElementById("sudoku");
const mask = document.getElementById("mask");

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

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    const item = sudoku.children.item(i * 9 + j);

    if (numbers[i][j] !== 0) {
      item.innerHTML = numbers[i][j]
      item.style.removeProperty('background-color');
    }
    else {
      item.style.color = "#1976d2"
      item.contentEditable = true
      item.addEventListener('input', function () {
        // Remove any non-digit characters
        this.textContent = this.textContent.replace(/(\D|0)/g, '');

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
  y *= 3
  let cell = []
  for (let i = y; i < y + 3; i++) {
    for (let j = x; j < x + 3; j++) {
      cell.push(arr[i][j])
    }
  }
  return cell;
}

function getBlockij(arr, i, j) {
  let I = Math.floor(i / 3)
  let J = Math.floor(j / 3);
  return getBlock(arr, J, I);
}

function printDomains(numbers) {
  if (!showDomains) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let item = mask.children.item(i * 9 + j);
        item.innerHTML = "";
      }
    }
    return;
  }

  for (let i = 0; i < 9; i++) {
    let row = numbers[i];
    for (let j = 0; j < 9; j++) {
      if (numbers[i][j] != 0) {
        let item = mask.children.item(i * 9 + j);
        item.innerHTML = "";
        continue;
      }
      let col = transposeArray(numbers)[j];
      let block = getBlockij(numbers, i, j);
      let used = new Set([...row, ...col, ...block]);
      let domain = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      let item = mask.children.item(i * 9 + j);
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
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let item = mask.children.item(i * 9 + j);
      item.style.removeProperty('background-color');;
    }
  }

  if (!showConflicts) {
    return;
  }

  for (let i = 0; i < 9; i++) {
    let row = numbers[i];
    let col = transposeArray(numbers)[i];
    let block = getBlock(numbers, i % 3, Math.floor(i / 3));

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
      for (let j = 0; j < 9; j++) {
        let item = mask.children.item(i * 9 + j);
        item.style.backgroundColor = "#ff525260";
      }
    }
    if (hasConflictInCol) {
      for (let j = 0; j < 9; j++) {
        let item = mask.children.item(j * 9 + i);
        item.style.backgroundColor = "#ff525260";
      }
    }
    if (hasConflictInBlock) {
      for (let j = 0; j < 9; j++) {
        let item = mask.children.item(Math.floor(i / 3) * 27 + (i % 3) * 3 + Math.floor(j / 3) * 9 + (j % 3));
        item.style.backgroundColor = "#ff525260";
      }
    }

  }
}

function reset() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (changeableNumbers[i][j] === true) {
        let item = sudoku.children.item(i * 9 + j);
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
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let item = sudoku.children.item(i * 9 + j);
      item.style.removeProperty('background-color');
    }
  }

  if (!showHelp) {
    return;
  }

  let minDomain = 9;
  let minDomainI = 0;
  let minDomainJ = 0;
  for (let i = 0; i < 9; i++) {
    let row = numbers[i];
    for (let j = 0; j < 9; j++) {
      if (numbers[i][j] != 0) {
        continue;
      }
      let col = transposeArray(numbers)[j];
      let block = getBlockij(numbers, i, j);
      let used = new Set([...row, ...col, ...block]);
      used.delete(0);
      let domainSize = 9 - used.size;
      if (domainSize < minDomain && domainSize > 0) {
        minDomain = domainSize;
        minDomainI = i;
        minDomainJ = j;
      }
    }
  }
  let item = sudoku.children.item(minDomainI * 9 + minDomainJ);
  item.style.backgroundColor = "#E6AF2Eaa";
}

printConflicts(numbers);
printDomains(numbers);
printHelp();
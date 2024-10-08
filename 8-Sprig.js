/*
8-Sprig is inspired by the popular 8-puzzle game, especially the version inside of https://conicgames.github.io/exponentialidle/. There are some
new changes and tweaks to accommodate for the Sprig platform. Music by FructosePear.

@title: 8-Sprig
@author: NoozAbooz
@tags: ['beginner', 'endless', 'infinite', 'puzzle']
@addedOn: 2024-07-04
*/

const cursor = "p"
const background = "b"

const one = "o"
const two = "t"
const three = "T"
const four = "f"
const five = "F"
const six = "s"
const seven = "S"
const eight = "e"

// list needed for random generation
const blocks = ["o", "t", "T", "f", "F", "s", "S", "e"];

var level = 0;
var gameStarted = false;
var gameOverState = false;
var speedrun = false;
var statsShowing = false;

var startTime = 0;
var endTime = 0;

var endlessStartTime;
var endlessEndTime;
var personalBest = 10000;

setLegend(
  [cursor, bitmap`
6666666666666666
66............66
6..............6
6..............6
6..............6
6..............6
6..............6
6..............6
6..............6
6..............6
6..............6
6..............6
6..............6
6..............6
66............66
6666666666666666`],
  [background, bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000`],

  [one, bitmap`
................
..222222222222..
.2............2.
.2......2.....2.
.2....222.....2.
.2......2.....2.
.2......2.....2.
.2......2.....2.
.2......2.....2.
.2......2.....2.
.2......2.....2.
.2......2.....2.
.2....22222...2.
.2............2.
..222222222222..
................`],
  [two, bitmap`
................
..222222222222..
.2............2.
.2...222222...2.
.2..22....22..2.
.2.........2..2.
.2.........2..2.
.2........22..2.
.2.......22...2.
.2.....222....2.
.2...222......2.
.2..22........2.
.2..222222222.2.
.2............2.
..222222222222..
................`],
  [three, bitmap`
................
..222222222222..
.2............2.
.2..222222....2.
.2.......222..2.
.2.........2..2.
.2.......222..2.
.2....2222....2.
.2..2222222...2.
.2........2...2.
.2........22..2.
.2.......22...2.
.2..222222....2.
.2............2.
..222222222222..
................`],
  [four, bitmap`
................
..222222222222..
.2............2.
.2..2....2....2.
.2..2....2....2.
.2..2....2....2.
.2..2....2....2.
.2..22222222..2.
.2.......2....2.
.2.......2....2.
.2.......2....2.
.2.......2....2.
.2.......2....2.
.2............2.
..222222222222..
................`],
  [five, bitmap`
................
..222222222222..
.2............2.
.2...2222222..2.
.2..22........2.
.2..2.........2.
.2..22222.....2.
.2......222...2.
.2........22..2.
.2.........2..2.
.2........22..2.
.2.......22...2.
.2..222222....2.
.2............2.
..222222222222..
................`],
  [six, bitmap`
................
..222222222222..
.2............2.
.2....222222..2.
.2...2........2.
.2..2.........2.
.2..2.........2.
.2..2222222...2.
.2..22.....2..2.
.2..2.......2.2.
.2..2.......2.2.
.2..22.....22.2.
.2...2222222..2.
.2............2.
..222222222222..
................`],
  [seven, bitmap`
................
..222222222222..
.2............2.
.2.222222222..2.
.2.........22.2.
.2........22..2.
.2........2...2.
.2.......22...2.
.2......22....2.
.2......2.....2.
.2.....22.....2.
.2....22......2.
.2...22.......2.
.2............2.
..222222222222..
................`],
  [eight, bitmap`
................
..222222222222..
.2............2.
.2....2222....2.
.2...22..22...2.
.2...2....2...2.
.2...2....2...2.
.2...222222...2.
.2....2222....2.
.2...2....2...2.
.2...2....2...2.
.2...22..22...2.
.2....2222....2.
.2............2.
..222222222222..
................`]
);

const levels = [
  map`
.................
.................
.................
.................
.................
.................
.................
.................
.................
.................
..............otT
..............fFs
..............Se.`,
  map`
otT
Fs.
fSe`,
  map`
Sot
f.e
TFs`,
  map`
FoS
f.T
est`
];

const endScreenLevel = [
  map`
....................
....................
....................
....................
....................
....................
....................
....................
....................
....................
....................
....................
.................otT
.................fFs
.................Se.`
];

setSolids( // dont allow stuff to pass through them 💀
  [one, two, three, four, five, six, seven, eight]
)
setPushables({ // goofy logic to allow two blocks to both be pushed simultaneously provided there is a empty space on on opposite side
  [one]: [two, three, four, five, six, seven, eight],
  [two]: [one, three, four, five, six, seven, eight],
  [three]: [one, two, four, five, six, seven, eight],
  [four]: [one, two, three, five, six, seven, eight],
  [five]: [one, two, three, four, six, seven, eight],
  [six]: [one, two, three, four, five, seven, eight],
  [seven]: [one, two, three, four, five, six, eight],
  [eight]: [one, two, three, four, five, six, seven],
})
setBackground(background)

// music, define sound effects
const melodyPart1 = tune`
245.9016393442623: D5^245.9016393442623,
245.9016393442623: E4/245.9016393442623 + C5^245.9016393442623,
245.9016393442623: E4~245.9016393442623 + E5-245.9016393442623,
245.9016393442623: E4/245.9016393442623 + F5-245.9016393442623 + B5~245.9016393442623,
245.9016393442623: D5^245.9016393442623 + B5~245.9016393442623,
245.9016393442623: E4/245.9016393442623 + E5-245.9016393442623 + B5~245.9016393442623,
245.9016393442623: E4~245.9016393442623 + C5^245.9016393442623,
245.9016393442623: E4/245.9016393442623 + D5^245.9016393442623,
245.9016393442623: E5^245.9016393442623,
245.9016393442623: E4/245.9016393442623 + A4^245.9016393442623,
245.9016393442623: E4~245.9016393442623 + E5-245.9016393442623,
245.9016393442623: E4/245.9016393442623 + F5-245.9016393442623 + B5~245.9016393442623,
245.9016393442623: D5^245.9016393442623 + B5~245.9016393442623,
245.9016393442623: E4/245.9016393442623 + E5-245.9016393442623 + B5~245.9016393442623,
245.9016393442623: E4~245.9016393442623 + C5^245.9016393442623,
245.9016393442623: E4/245.9016393442623 + D5^245.9016393442623,
245.9016393442623: C5^245.9016393442623,
3688.5245901639346`
const melodyPart2 = tune`
245.9016393442623: E4/245.9016393442623,
245.9016393442623: E4~245.9016393442623 + E5-245.9016393442623,
245.9016393442623: E4/245.9016393442623 + F5-245.9016393442623 + B5~245.9016393442623,
245.9016393442623: D5^245.9016393442623 + B5~245.9016393442623,
245.9016393442623: E4/245.9016393442623 + E5-245.9016393442623 + B5~245.9016393442623,
245.9016393442623: C5^245.9016393442623 + E4~245.9016393442623,
245.9016393442623: E4/245.9016393442623 + A4^245.9016393442623,
245.9016393442623,
245.9016393442623: E4/245.9016393442623 + C5^245.9016393442623,
245.9016393442623: E5-245.9016393442623 + E4~245.9016393442623,
245.9016393442623: E4/245.9016393442623 + F5-245.9016393442623 + B5~245.9016393442623,
245.9016393442623: D5^245.9016393442623 + B5~245.9016393442623,
245.9016393442623: E4/245.9016393442623 + E5-245.9016393442623 + A4^245.9016393442623 + B5~245.9016393442623,
245.9016393442623: E4~245.9016393442623,
245.9016393442623: E4/245.9016393442623 + C5^245.9016393442623,
4180.327868852459`
const click = tune`
96.7741935483871,
96.7741935483871: E4^96.7741935483871,
2903.225806451613`
const thock = tune`
196.07843137254903,
196.07843137254903: C4-196.07843137254903,
5882.352941176471` 
const victoryTune = tune`
170.45454545454547: F5^170.45454545454547,
170.45454545454547: F5^170.45454545454547,
170.45454545454547: F5^170.45454545454547,
170.45454545454547: F5~170.45454545454547,
170.45454545454547,
170.45454545454547: B4~170.45454545454547,
340.90909090909093,
170.45454545454547: D5~170.45454545454547,
340.90909090909093,
170.45454545454547: F5^170.45454545454547,
170.45454545454547: F5^170.45454545454547,
170.45454545454547: E5^170.45454545454547,
170.45454545454547: F5~170.45454545454547,
2897.727272727273`

function loopMelody() { // async recursive loop to infinitely play music with small delay
  if (gameOverState === true) {
    console.log("stopping music");
    return;
  }

  // play pt1
  playTune(melodyPart1)
  
  if (gameOverState === true) {
    return;
  }

  // async delay to play pt2
  setTimeout(() => {
    playTune(melodyPart2)
  }, 4000)
  
  if (gameOverState === true) {
    return;
  }

  // async wait for both parts to finish and loop
  setTimeout(loopMelody, 8500);
  
  if (gameOverState === true) {
    return;
  }
}

loopMelody();

// game start, show text and instructions
setMap(levels[level])
addSprite(14, 10, cursor)

addText("Welcome to 8-Sprig!", {
  x: 0,
  y: 1,
  color: color`7`
})
addText("-Arrange the blocks", {
  x: 0,
  y: 3,
  color: color`2`
})
addText("in order (see below)", {
  x: 0,
  y: 4,
  color: color`2`
})
addText("-Right D-pad to move", {
  x: 0,
  y: 6,
  color: color`2`
})
addText("your", {
  x: 0,
  y: 7,
  color: color`2`
})
addText("cursor", {
  x: 5,
  y: 7,
  color: color`6`
})
addText(", left", {
  x: 11,
  y: 7,
  color: color`2`
})
addText("D-pad to move the", {
  x: 0,
  y: 8,
  color: color`2`
})
addText("blocks", {
  x: 0,
  y: 9,
  color: color`6`
})
addText("Press Left-Up for", {
  x: 0,
  y: 11,
  color: color`1`
})
addText("speedrun", {
  x: 0,
  y: 12,
  color: color`3`
})
addText("Press Right-Up", {
  x: 0,
  y: 14,
  color: color`1`
})
addText("for endless", {
  x: 0,
  y: 15,
  color: color`8`
})

// handle cursor input movement
onInput("i", () => {
  playTune(click)
  if (statsShowing === false) {
    getFirst(cursor).y -= 1
  }

  if (gameStarted === false) {
    speedrun = false;
    startGame();
  } else if (statsShowing === true && speedrun === false) {
    nextLevel();
  }
})
onInput("k", () => {
  playTune(click)
  getFirst(cursor).y += 1
})
onInput("j", () => {
  playTune(click)
  getFirst(cursor).x -= 1
})
onInput("l", () => {
  playTune(click)
  getFirst(cursor).x += 1
})

// handle movements for moving the entire cursor and the block selected under it
function moveManager(event) {
  const cursorSprite = getFirst(cursor);
  const selectedSprite = getTile(cursorSprite.x, cursorSprite.y);

  // Check if the cursor sprite is on top of a block, and satisfy move conditions
  selectedSprite.forEach(block => {
    if (block !== cursorSprite && block.type !== background) {
      playTune(thock)

      const initialX = block.x
      const initialY = block.y
      
      switch (event) {
        case 'w':
          // Move both the cursor sprite and the sprite it is on top of
          block.y -= 1;
          // move cursor too, horrible horrible cursed inline logic for conciseness
          cursorSprite.y -= (block.y != initialY) ? 1 : 0; 

          // Above statement is equivalent to ->
          // if(block.y != initialY){   // so if a block has changed from initial position (check to make sure it's not running into wall)
          //    x = n;   // move cursor along with it in the -1 direction
          // } 
          // else { 
          //    x = m;  // dont move cursor at all if the block doesn't move
          // } 
          break;
        case 's':
          block.y += 1;
          cursorSprite.y += (block.y != initialY) ? 1 : 0; 
          break;
        case 'a':
          block.x -= 1;
          cursorSprite.x -= (block.x != initialX) ? 1 : 0; 
          break;
        case 'd':
          block.x += 1;
          cursorSprite.x += (block.x != initialX) ? 1 : 0; 
          break;
      }
    }
  });
}

onInput("w", () => {
  // special trigger for game start
  if (gameStarted === false) {
    speedrun = true;
    startGame();
  }
  
  moveManager("w")
})

onInput("s", () => {
  moveManager("s")
})

onInput("a", () => {
  moveManager("a")
})

onInput("d", () => {
  moveManager("d")
})

// called upon main menu input
function startGame() {
  gameStarted = true;
  clearText()
  nextLevel()
  startTime = Date.now();
}

// special level switcher logic
function nextLevel() {
  if (speedrun === true) { // actually switch levels since we are in speedrun mode
    if (levels.length - 1 == level) {
      gameOver();
    } else {
      //console.log("next level");
      level++;
      setMap(levels[level])
      addSprite(0, 0, cursor)
    }
  } else { // if in endless mode
    clearText()
    statsShowing = false;
    level = 1; // keep level the same for simplicity
    setMap(levels[level])
    addSprite(0, 0, cursor)

    // generate new puzzle configuration
    setSolids([]) // allow block collisions temporarily to allow setting random puzzle config
    let puzzle = generateRandomPuzzle();
    // let puzzle = [1, 2, 3, 4, 5, 6, 7, 0, 8] //for debug purposes
    for (let i = 0; i < blocks.length; i++) { // loop for every tile and get its position from the configuration
      let tile = i + 1;
      let position = getTilePosition(puzzle, tile);

      let tileSprite = getFirst(blocks[i]);
      tileSprite.x = position.x
      tileSprite.y = position.y
      //console.log(`Tile ${blocks[i]} is at position: (${position.x}, ${position.y})`);
    }
    printPuzzle(puzzle);

    setSolids( // bring collisions back now that we've set all positions
      [one, two, three, four, five, six, seven, eight]
    )
    endlessStartTime = Date.now();
  }
}

function endlessStats() { // stats screen after every solve in endless mode
  statsShowing = true;
  setMap(endScreenLevel[0])

  endlessEndTime = Date.now()
  var timeDiff = endlessEndTime - endlessStartTime; //in ms
  // strip the ms and convert to seconds
  timeDiff /= 1000;
  var seconds = +timeDiff.toFixed(2);

  if (seconds < personalBest) {
    personalBest = seconds;
  }

  addText(`Time: ${seconds} sec`, { x: 3, y: 2, color: color`4` })
  addText(`PB: ${personalBest} sec`, { x: 4, y: 4, color: color`3` })
  addText("Press Right-Up", {
    x: 3,
    y: 10,
    color: color`8`
  })
  addText("to continue", {
    x: 4,
    y: 11,
    color: color`8`
  })
}

function gameOver() { // only in speedrun mode
  gameOverState = true;
  setMap(endScreenLevel[0])
  setTimeout(() => {
    playTune(victoryTune)
  }, 5000)
  
  endTime = Date.now();
  var timeDiff = endTime - startTime; //in ms
  // strip the ms and convert to seconds
  timeDiff /= 1000;
  var seconds = +timeDiff.toFixed(2);

  addText("Game Over!", {
    x: 5,
    y: 2,
    color: color`2`
  })
  addText(`Time: ${seconds} sec`, { x: 4, y: 4, color: color`4` })
  addText("Did you beat my PB?", {
    x: 1,
    y: 7,
    color: color`2`
  })
  addText("It was 88.05s", {
    x: 4,
    y: 8,
    color: color`2`
  })
}

afterInput(() => {
  const firstRowAligned = getFirst(one).x < getFirst(two).x && getFirst(two).x < getFirst(three).x && [one, two, three].every(type => getFirst(type).y === 0);
  const secondRowAligned = getFirst(four).x < getFirst(five).x && getFirst(five).x < getFirst(six).x && [four, five, six].every(type => getFirst(type).y === 1);
  const thirdRowAligned = getFirst(seven).x === 0 && getFirst(eight).x === 1 && [seven, eight].every(type => getFirst(type).y === 2);

  if (firstRowAligned && secondRowAligned && thirdRowAligned) {
    if (speedrun === true) {
      nextLevel();
    } else {
      endlessStats();
    }
  } else if (statsShowing === true) {
    nextLevel();
  }
})

// all of this is dedicated to endless mode random setup generation, geeksforgeeks FTW
function generateRandomPuzzle() {
  const puzzle = [...Array(9).keys()];

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function countInversions(array) {
    let inversions = 0;
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = i + 1; j < array.length; j++) {
        if (array[i] > array[j] && array[i] !== 0 && array[j] !== 0) {
          inversions++;
        }
      }
    }
    return inversions;
  }
  let isSolvable = false;
  while (!isSolvable) {
    shuffle(puzzle);
    const inversions = countInversions(puzzle);
    isSolvable = inversions % 2 === 0;
  }
  return puzzle;
}

function getTilePosition(puzzle, tile) {
  const index = puzzle.indexOf(tile);
  if (index === -1) {
    return null;
  }
  const x = index % 3;
  const y = Math.floor(index / 3);
  return { x, y };
}

function printPuzzle(puzzle) {
  for (let i = 0; i < 9; i += 3) {
    console.log(puzzle.slice(i, i + 3).join(" "));
  }
}

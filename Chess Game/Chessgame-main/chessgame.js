let board;
let start = true
let whitepieces = [];
let blackpieces = [];
let count = -1;
let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
let checkmate = false;
let validmove = false;
let clearspace = true;
let checking = true;
let check = false;
let turns = 0;
let revealcheck = false;
let colour = whitepieces;
const canvas = document.getElementById("board")
const ctx = canvas.getContext("2d")
let pieceImages = {};
let lastx = 0;
let lasty = 0;
const offset = 250;
const offsety = 40
let selected = false;
let selectedx;
let selectedy;
let boardrect = new Path2D();
boardrect.rect(offset,offsety,805,805)
let changedPawns = 9;
let piecechoiceimg = ["Queen","knight","rook","bishop"];
let piecechoice = new Array(1);
let choosing = false;
let savedx;
let savedy;
let savedcolour;
let possibleMoves = false
let rules = true


var checkbox = document.getElementById('possiblemovesbox');
if (checkbox.checked) {
   console.log('test');
}

let horsemoves = [
  { x: 2, y: 1 },
  { x: 2, y: -1 },
  { x: -2, y: 1 },
  { x: -2, y: -1 },
  { x: 1, y: 2 },
  { x: 1, y: -2 },
  { x: -1, y: 2 },
  { x: -1, y: -2 },];

function backBoard(){//background for the board, without pieces
  ctx.fillStyle = "grey"
  ctx.fillRect(offset,offsety,805,805)//offset constants to allow easy formatting while designing
  for (let x=0;x<=7;x++){
      for (let y=0;y<=7;y++){
          a = 100*x//100 is the pixel size of each square
          b = 100*y
          if ((x+y)%2==0){//alternates with mod 2, to alternate b&w
              ctx.fillStyle = "white"
          }
          else{
              ctx.fillStyle = "black"
          }
          ctx.fillRect(a+5+offset,b+5+offsety,95,95)
      }
  }
}

let positions = new Array(8);
board = new Array(8)// does not work if put in a function, so must be built at the start
for (let i = 0; i < 8; i++) {
  board[i] = new Array(8);
  positions[i] = new Array(8);
  for (let j = 0; j < 8; j++) {
    board[i][j] = ' ';
    positions[i][j] = new Path2D();//paths used to detect where on the board was clicked
    positions[i][j].rect(100*i + offset, 100*j + offsety,100,100);
  }
}

function printChooser(colour){ 
let start = null
if (colour == 'b'){
  start = "black_"
}
if (colour == 'w'){
  start = "white_"
}
ctx.fillStyle = "grey"
ctx.fillRect(offset + 906, offsety, 120, 405)//offsets to the right of the board
ctx.lineWidth = 4
ctx.strokeStyle = 'black'
ctx.strokeRect(offset + 906, offsety, 120, 405)
ctx.lineWidth = 1
  for (let i =0; i<4;i++){
    piecechoice[i] = new Path2D();//paths to determine where clicked
    piecechoice[i].rect(offset + 925, offsety +i*100, 80, 80)
    path = start+piecechoiceimg[i]
    let img = pieceImages[path];//finds the image code
    ctx.drawImage(img, offset + 925, offsety + 10 + i*100, 80, 80)//draws each image
  }
  choosing = true
}

function printBoard() {
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      path = getImage(x, y)
      if (path != null) {
        let img = pieceImages[path];//finds image code from array
        ctx.drawImage(img, x * 100 +10 + offset, y * 100 +10 + offsety, 80, 80);
       }
      }
    }
  }

  canvas.addEventListener('mousemove',
  function(event) {
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {//when mouse moved, checks all 64 squares to see if mouse is in square
        if (ctx.isPointInPath(positions[x][y],event.offsetX,event.offsetY)) {
          ctx.strokeStyle = 'yellow';//if mouse in square, selected is highlighted with a yellow border
          ctx.strokeRect(100*x+4 + offset,100*y+4 + offsety,97,97)
        }
        else{
          ctx.strokeStyle = 'grey';//if mouse not in square, grey border is drawn, and will cover any previous yellow one
          ctx.strokeRect(100*x+4+ offset,100*y+4+offsety,97,97)
        }
      }
    }
    if(choosing){// if pawn being chosen, this border effect also happens to the select bar
      for(let x=0;x<4;x++){
        if (ctx.isPointInPath(piecechoice[x],event.offsetX,event.offsetY)){
          ctx.strokeStyle = 'yellow';
          ctx.strokeRect(918 + offset,100*x + offsety+4,96,96)
        }
        else{
          ctx.strokeStyle = 'grey'
          ctx.strokeRect(918 + offset,100*x + offsety+4,96,96)
        }
      }
    }
  });

  canvas.addEventListener('click', 
  function(event){//when clicked
    var checkbox = document.getElementById('possiblemovesbox');
    if (checkbox.checked) {
    possibleMoves = true
    }
    else{
      possibleMoves = false
    }
    var checkbox = document.getElementById('rulesbox');
    if (checkbox.checked) {
      rules = true
    }
    else{
      rules = false
    }
    if(possibleMoves){
      backBoard()
      printBoard()
    }
    if(!choosing){
    if((lastx+lasty)%2 == 0){
      ctx.fillStyle = 'white';//replaces last click location with origional colour and piece
      ctx.fillRect(lastx*100+5+offset,lasty*100+5+offsety,95,95)
      path = getImage(lastx, lasty)
      if (path != null) {
      let img = pieceImages[path];
      ctx.drawImage(img, lastx * 100 +10+offset, lasty * 100 +10+offsety, 80, 80);
      }
    }
    else{
      ctx.fillStyle = 'black';//replaces last click location with origional colour and piece
      ctx.fillRect(lastx*100+5+offset,lasty*100+5+offsety,95,95)
      path = getImage(lastx, lasty)
      if (path != null) {
        let img = pieceImages[path];
        ctx.drawImage(img, lastx * 100 +10+offset, lasty * 100 +10+offsety, 80, 80);
      }
    }
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {//on click, checks all 64 squares to determine which one has been clocked
        if(ctx.isPointInPath(positions[x][y],event.offsetX,event.offsetY)){
          console.log("you clicked", x, y)
          if(selected == true){//selected means a piece is selected, and the next click is where its moving to
            if(movePiece(selectedx, selectedy, x, y)){//runs the move piece function, if its a valid move, returns true, and board is reprinted
            backBoard()
            printBoard()
            selected = false
            }
            else{
              selected = true
            }
            if(selectedx == x && selectedy == y){
              selected = true
            }
          }
          if(seleted = true){
            selected = true
            selectedx = x//saves last click position
            selectedy = y
            if(board[x][y] == ' '){
              selected = false;//deselects if a piece isnt clicked
            }
            else{
              if(possibleMoves){//runs the function to highlight possible moves if the setting is on
                findPossible(whatPiece(x,y), board[x][y].charAt(2), x, y)
              }
            }
          }
          lastx = x
          lasty = y
          ctx.fillStyle = 'yellow';//fills in the selected square with yellow
          ctx.fillRect(x*100+5+offset,y*100+5+offsety,95,95)
          path = getImage(x,y)
          if (path != null) {
            let img = pieceImages[path];//if theres an image in the selected square, its reprinted over the yellow
            ctx.drawImage(img, x * 100 +10+offset, y * 100 +10+offsety, 80, 80);
            }
        }

        }
      }
    }
    if(ctx.isPointInPath(boardrect,event.offsetX,event.offsetY) == false){
      console.log("click off board")
      console.log(blackpieces, whitepieces)
      selected = false//click off board removes current selection
    }
      if(choosing){//if pawn is being chosen, only the sidebar can be selected
        for(let x=0;x<4;x++){
          if (ctx.isPointInPath(piecechoice[x],event.offsetX,event.offsetY)){
            ctx.clearRect(offset + 900, offsety-5, 130, 415)//once selected, its removed
            selected = false
            choosing = false
            pawnend(piecechoiceimg[x].charAt(0),savedx,savedy)//runs function to apply selectuion
          }
        }
      }
  });
  

function getImage(x,y){
  let start = null
  letter = board[x][y].charAt(0)
  if (letter == ' '){
    return null
  }
  colour = board[x][y].charAt(2) // image names follow the format (colour_piece)
  if (colour == 'b'){
    start = "black"
  }
  if (colour == 'w'){
    start = "white"
  }
  if (letter == 'p') {
    return (start+"_pawn")
  }
  if (letter == 'r') {
    return (start+"_rook")
  }
  if (letter == 'k') {
    return (start+"_knight")
  }
  if (letter == 'b') {
    return (start+"_bishop")
  }
  if (letter == 'K') {
    return (start+"_King")
  }
  if (letter == 'Q') {
    return (start+"_Queen")
  }
}


//a base function to push an array of records containing each piece 
function addPieces(colourpieces, yCoord, name, xCoord, num) {
  if (colourpieces == whitepieces) {
    colour = 'w'
  }
  if (colourpieces == blackpieces) {
    colour = "b"
  }
  colourpieces.push({
    coordx: xCoord,
    coordy: yCoord,
    state: true, //dead/alive
    moved: false,
    type: name + num.toString() + colour //name and number of piece
  });
}

//adds all 8 pawns for one side, left to right
function addPawns(colour, position) {
  for (x = 0; x < 8; x++) {
    addPieces(colour, position, 'p', x, x + 1) //add pawns
  }
}
//the function for piece pairs, eg left bishop and right bishop
function addPairs(colour, yposition, name, position) {
  addPieces(colour, yposition, name, position, 1)
  addPieces(colour, yposition, name, 7 - position, 2)
}
//takes all the piece functions for one side, to be called at one point, with their respective coordinates
function addAll(colour, yposition, pawnyposition) {
  addPawns(colour, pawnyposition)
  addPairs(colour, yposition, 'b', 2)
  addPairs(colour, yposition, 'r', 0)
  addPairs(colour, yposition, 'k', 1)
  addPieces(colour, yposition, 'K', 3, 1)
  addPieces(colour, yposition, 'Q', 4, 1)
}
//adds every piece to the board array
function fillBoard(pieces) {
  for (let x = 0; x < 16; x++) {
    xCoord = pieces[x].coordx; //takes coordinate from array
    yCoord = pieces[x].coordy;
    letter = pieces[x].type;
    board[xCoord][yCoord] = letter;//takes only the letter from the piece type eg p from p1
  }
}
function whatPiece(x, y) {
  letter = board[x][y].charAt(0)
  if (letter == 'p') {
    return "pawn"
  }
  if (letter == 'r') {
    return "rook"
  }
  if (letter == 'k') {
    return "knight"
  }
  if (letter == 'b') {
    return "bishop"
  }
  if (letter == 'K') {
    return "King"
  }
  if (letter == 'Q') {
    return "Queen"
  }
}

function movePiece(x, y, newx, newy) {
  validmove = true
      piece = board[x][y]
      moves = board[newx][newy]
      if (y <= -1 || y >= 8 || newy <= -1 || newy >= 8 || x == -1 || newx == -1) {
        validmove = false
        console.log("Invalid Move 1")
      }
      else {
        if (turns % 2 == 1 && board[x][y].charAt(2) == 'w') {
          validmove = false
          console.log("not your turn")
        }
        else if (turns % 2 == 0 && board[x][y].charAt(2) == 'b') {
          validmove = false
          console.log("not your turn")
        }
        else {
          if (board[x][y] == ' ') {
            console.log("You haven't selected a piece to move")
            validmove = false
          }
          else {
            value = board[x][y];
            movingto = board[newx][newy];
            if (value.charAt(2) != movingto.charAt(2)) { //check if both are the same colour
            if(value.charAt(2) == 'w'){
              colour = whitepieces
            }
            if(value.charAt(2) == 'b'){
              colour = blackpieces
            }
              if (checkPieceRule(whatPiece(x, y), x, y, newx, newy, colour)) {
                console.log("rules checked")
                validmove = true
                if(check == true){
                  temp1 = board[x][y]
                  temp2 = board[newx][newy]
                  board[newx][newy] = temp1
                  board[x][y] = ' '
                  if(whatPiece(newx,newy) != 'King'){
                    if (turns % 2 == 1) {
                      if (checkifCheck(blackpieces, blackpieces[14].coordx, blackpieces[14].coordy)) {
                        console.log("You are still in check")
                        validmove = false
                      }
                    }
                    if (turns % 2 == 0) {
                      if (checkifCheck(whitepieces, whitepieces[14].coordx, whitepieces[14].coordy)) {
                        console.log("You are still in check")
                        validmove = false
                      }
                  }
                }
                else{
                  if(checkifCheck(colour, newx, newy)){
                    console.log("You are still in check")
                    validmove = false
                }
              }
                  board[x][y] = temp1
                  board[newx][newy] = temp2
                }
                if(revealcheck){//checks if a piece is revealing the king to check
                  temp1 = board[x][y]
                  temp2 = board[newx][newy]
                  board[newx][newy] = temp1
                  board[x][y] = ' '
                  console.log("moving near king")
                  if (turns % 2 == 1 && value.charAt(0) != 'K') {
                    if (checkifCheck(blackpieces, blackpieces[14].coordx, blackpieces[14].coordy)) {
                      console.log("You can't move into check!")
                      validmove = false
                    }
                  }
                  if (turns % 2 == 0) {
                    if (checkifCheck(whitepieces, whitepieces[14].coordx, whitepieces[14].coordy)) {
                      console.log("You can't move into check!")
                      validmove = false
                    }
                  }
                  board[x][y] = temp1
                  board[newx][newy] = temp2
                  revealcheck = false
                }
                if(value.charAt(0)== 'K'){//checks to see if king is moving into check
                  temp = board[x][y]
                  board[x][y] = ' '
                  if (turns % 2 == 1) {
                    if (checkifCheck(blackpieces, newx, newy)) {
                      console.log("You can't move into check!!")
                      validmove = false
                      
                    }
                  }
                  if (turns % 2 == 0) {
                    if (checkifCheck(whitepieces, newx, newy)) {
                      console.log("You can't move into check!!")
                      validmove = false
                    }
                  }
                  board[x][y] = temp
                }
                if (validmove == true) {
                  check = false
                  console.log(whatPiece(x, y), piece, "moving to", moves)
                  board[newx][newy] = board[x][y]
                  board[x][y] = ' '
                  turns += 1;
                  console.log(turns)
                  if (value.charAt(2) == 'w') {
                    updatePosition(whitepieces, value, newx, newy)
                    console.log("updated positions")
                  }
                  if (value.charAt(2) == 'b') {
                    updatePosition(blackpieces, value, newx, newy)
                    console.log("updated positions")
                  }
                  if (value != ' ') {//if a piece is being taken
                    if (movingto.charAt(2) == 'w') {
                      stateChange(whitepieces, moves, true)
                      console.log("piece taken")
                    }
                    if (movingto.charAt(2) == 'b') {
                      stateChange(blackpieces, moves, true)
                      console.log("Piece taken")
                    }
                  }
                  if (turns % 2 == 1) {
                    if (checkifCheck(blackpieces, blackpieces[14].coordx, blackpieces[14].coordy)) {
                      console.log("Black is in check")
                      check = true
                    }
                  }
                  if (turns % 2 == 0) {
                    if (checkifCheck(whitepieces, whitepieces[14].coordx, whitepieces[14].coordy)) {
                      console.log("White is in check")
                      check = true
                    }
                  }
                }
                else {
                  console.log("This move is not valid")
                  validmove = false
                }
              }
              else {
                console.log("That piece can't do that move")
                validmove = false
              }
            }
            else {
              console.log("You can't take your own piece")
              validmove = false
            }
          }
        }
      }
  return validmove
}

function stateChange(colour, value, change, moves) {
  if(checking){
    return true
  }
  else{
  count = 0
  while (count <= 15) {
    if (colour[count].type == value) { //finds piece being taken, to change its state in the array
      if (change == true) {
        return colour[count].state = false
      }
      if (change == false) {
        if (moves == false) {
          return colour[count].moved = false
        }
        if (moves == true) {
          return colour[count].moved = true
        }
      }
    }
    else {
      count += 1
    }
  }
}
}

function updatePosition(colour, value, newx, newy) {
  let count = 0
  while (count <= 15) {
    if (colour[count].type == value) {
      colour[count].coordx = newx
      colour[count].coordy = newy
      console.log("found and changed")
      tempcount = count
      count =16
    }
    count += 1
  }
  if(board[newx][newy].charAt(0) == 'p'){
    if(colour == whitepieces){
      if(newy == 7){
        savedx = newx
        savedy = newy
        savedcolour = blackpieces
        console.log(savedx, savedy, savedcolour)
        printChooser('w')
      }
    }
    if(colour == blackpieces){
      if(newy == 0){
        savedx = newx
        savedy = newy
        savedcolour = blackpieces
        console.log(savedx, savedy, savedcolour)
        printChooser('b')
  //       console.log("PAWN AT END")
  //       let validinput = false
  //       while(validinput == false){
  //         newpieces = prompt("what do you want your pawn to turn into")
  //         if(newpieces.length == 1){
  //           validinput = true
  //           newcode = newpieces
  //           newcode += board[x][y].charAt(1)
  //           newcode += board[x][y].charAt(2)
  //           colour[tempcount].type = newcode
  //           board[x][y] = newcode
  //         }
  //       }
  //     }
  //   }
  // }
      }
    }
  }
}


function pawnend(piece,x,y){
  newcode = piece
  newcode += board[savedx][savedy].charAt(1)
  newcode += board[savedx][savedy].charAt(2)
  newcode += 'p'
  savedcolour[x].type = newcode
  board[savedx][savedy] = newcode
  backBoard()
  printBoard()
  if (turns % 2 == 1) {
    if (checkifCheck(blackpieces, blackpieces[14].coordx, blackpieces[14].coordy)) {
      console.log("Black is in check")
      check = true
    }
  }
  if (turns % 2 == 0) {
    if (checkifCheck(whitepieces, whitepieces[14].coordx, whitepieces[14].coordy)) {
      console.log("White is in check")
      check = true
  }
}
}

function checkPieceRule(piece, x, y, newx, newy, colour) {
  if(rules == false){
    return true
  }
  xchange = newx - x
  ychange = newy - y
  if (xchange == 0 && ychange == 0) {
    return false
  }
  if(whatPiece(x,y) != 'King'){
  if(colour[14].coordx == x || colour[14].coordy == y){
    revealcheck = true
  }
  if(Math.abs(colour[14].coordx - x) == Math.abs(colour[14].coordy - y)){
    revealcheck = true
  }
}
  console.log(xchange, ychange)
  if (piece == "knight") {
    if ((Math.abs(xchange) == 2 && Math.abs(ychange) == 1) 
    || (Math.abs(xchange) == 1) && Math.abs(ychange) == 2) {
      return true
    }
    else {
      return false
    }
  }
  if (piece == "bishop") {
    if (Math.abs(xchange) == Math.abs(ychange)) {
      clearspace = true
      for (let i = 1; i < Math.abs(xchange); i++) {
        if (board[x + (i * (Math.sign(xchange)))][y + (i * (Math.sign(ychange)))] != " ") {
          clearspace = false
        }
      }
      return clearspace
    }
    else {
      return false
    }
  }
  if (piece == "rook") {
    clearspace = true
    if (xchange == 0 || ychange == 0) {
      for (let i = 1; i < Math.abs(xchange + ychange); i++) {
        if (board[x + (i * (Math.sign(xchange)))][y + (i * (Math.sign(ychange)))] != " ") {
          clearspace = false
        }
      }
      if (clearspace == true) {
          stateChange(colour, board[x][y], false, true)
        }
        return clearspace
      }
    else {
      return false
    }
  }

  if (piece == "pawn") {
    console.log("pawn")
    if (colour == whitepieces) {
      if (y == 1) {
        if (xchange == 0 && (ychange) == 2) {
          if (board[newx][newy] == ' ' && board[newx][newy - 1] == ' ') {
            console.log("True")
            stateChange(whitepieces, board[x][y], false, true)
            return true
          }
        }
      }
      if (xchange == 0 && ychange == 1) {
        if (board[newx][newy] == ' ') {
          stateChange(whitepieces, board[x][y], false, false)
          return true
        }
      }
      if (Math.abs(xchange) == 1 && ychange == 1) {
        if (board[newx][newy] != ' ') {
          stateChange(whitepieces, board[x][y], false, false)
          return true
        }
        if (board[newx][newy - 1].charAt(0) == 'p' && blackpieces[board[newx][newy - 1].charAt(1) - 1].moved == true && board[newx][newy -1].charAt(2)=='b') {
          stateChange(whitepieces, board[x][y], false, false)
          stateChange(whitepieces, board[newx][newy - 1], true)
          if(!checking){
          board[newx][newy - 1] = ' '
          }
          return true
        }
      }
    }

    if (colour == blackpieces) {
      if (y == 6) {
        if (xchange == 0 && ychange == -2) {
          if (board[newx][newy] == ' ' && board[newx][newy + 1]) {
            stateChange(blackpieces, board[x][y], false, true)//double move
            return true
          }
        }
      }
        if (xchange == 0 && ychange == -1) {
          if (board[newx][newy] == ' ') {//single move
            stateChange(blackpieces, board[x][y], false, false)
            return true
          }
        }
        if (Math.abs(xchange) == 1 && ychange == -1) {//pawn taking
          if (board[newx][newy] != ' ') {
            stateChange(blackpieces, board[x][y], false, false)
            return true
          }
          if (board[newx][newy + 1].charAt(0) == 'p' && whitepieces[board[newx][newy + 1].charAt(1) - 1].moved == true && board[newx][newy + 1].charAt(2)=='w') {
            stateChange(blackpieces, board[x][y], false, false)
            stateChange(blackpieces, board[newx][newy + 1], true)
            if(!checking){
            board[newx][newy + 1] = ' '
            }
            return true
          }
        }
      }
    return false
  }
  if (piece == "King") {
    if (Math.abs(xchange) <= 1 && Math.abs(ychange) <= 1) {
      if (colour = whitepieces) {
        stateChange(whitepieces, board[x][y], false, true)
      }
      else {
        stateChange(blackpieces, board[x][y], false, true)
      }
      return true
    }
    if (xchange == -2 && !check) {
      if (colour == whitepieces) {
        console.log(whitepieces[10].moved)
        if (whitepieces[10].moved == false && whitepieces[14].moved == false && whitepieces[10].state == true) {
          if (board[1][0] == ' ' && board[2][0] == ' ') {
            if(!checking){
            board[2][0] = board[0][0]
            board[0][0] = ' '
            stateChange(whitepieces, board[2][0], false, true)
            whitepieces[14].moved = true
            }
            return true
          }
        }
      }
      if (colour == blackpieces) {
        console.log(blackpieces[10])
        if (blackpieces[10].moved == false && blackpieces[14].moved == false && blackpieces[10].state == true) {
          if (board[1][7] == ' ' && board[2][7] == ' ') {
            if(!checking){
            board[2][7] = board[0][7]
            board[0][7] = ' '
            stateChange(blackpieces, board[2][7], false, true)
            blackpieces[14].moved = true
            }
            return true
          }
        }
      }
    }
    if (xchange == 2 && !check) {
      if (colour == whitepieces) {
        if (whitepieces[11].moved == false && whitepieces[14].moved == false && whitepieces[11].state == true) {
          if (board[6][0] == ' ' && board[5][0] == ' ' && board[4][0] == ' ') {
            if(!checking){
            board[4][0] = board[7][0]
            board[7][0] = ' '
            whitepieces[14].moved = true
            stateChange(whitepieces, board[4][0], false, true)
            }
            return true
          }
        }
      }
      if (colour == blackpieces) {
        if (blackpieces[11].moved == false && blackpieces[14].moved == false && blackpieces[11].state == true) {
          if (board[4][7] == ' ' && board[5][7] == ' ' && board[6][7] == ' ') {
            if(!checking){
            board[4][7] = board[7][7]
            board[7][7] = ' '
            blackpieces[14].moved = true
            stateChange(blackpieces, board[4][7], false, true)
            }
            return true
          }
        }
      }
    }
  }
  if (piece == "Queen") {
    clearspace = true
    if (xchange == 0 ^ ychange == 0) {
      console.log("called")
      for (let i = 1; i <= Math.abs(xchange + ychange) - 1; i++) {
        if (board[x + (i * (Math.sign(xchange)))][y + (i * (Math.sign(ychange)))] != " ") {
          clearspace = false
        }
      }
      return clearspace
    }
    else {
      if (Math.abs(xchange) == Math.abs(ychange)) {
        let clearspace = true
        console.log("diagonal")
        for (let i = 1; i <= Math.abs(xchange) - 1; i++) {
          if (board[x + (i * (Math.sign(xchange)))][y + (i * (Math.sign(ychange)))] != " ") {
            clearspace = false
          }
        }
        return clearspace
      }
      else {
        return false
      }
    }
  }
  return false
}

function checkifCheck(colour, xcoord, ycoord) {
  if(rules == false){
    return false
  }
  if (colour == whitepieces) {
    letter = 'w'
    letter2 = 'b'
  }
  else {
    letter = 'b'
    letter2 = 'w'
  }
  console.log("checking for knight check")
  for (posx = 0; posx < 8; posx++) { //checks if king is in check by a horse
    if (xcoord + horsemoves[posx].x >= 0 && ycoord + horsemoves[posx].y >= 0
      && xcoord + horsemoves[posx].x <= 7 && ycoord + horsemoves[posx].y <= 7) {
      //console.log(board[xcoord + horsemoves[posx].x][ycoord + horsemoves[posx].y])
      console.log(letter2)
      if (board[xcoord + horsemoves[posx].x][ycoord + horsemoves[posx].y].charAt(0) == 'k'
        && board[xcoord + horsemoves[posx].x][ycoord + horsemoves[posx].y].charAt(2) == letter2) {
        return true
      }
    }
  }
  console.log("checking for rook/queen check")
  for (posx = -1; posx <= 2; posx += 2) {
    let safehorizontal = false;
    let safevertical = false;
    let count = 0;
    let direction = posx;
    count += direction
    console.log("x is" + posx)
    while (!safehorizontal && xcoord + count <= 7 && xcoord + count >= 0) { //checks if king is in check by a rook or queen
      console.log("valid  " + count)
      console.log(board[xcoord + count][ycoord].charAt(0))
      if(board[xcoord + count][ycoord].charAt(2) == letter2){
        if (board[xcoord + count][ycoord].charAt(0) == 'r' ||
          board[xcoord + count][ycoord].charAt(0) == 'Q'){
          return true
        }
    }
      console.log("At position", board[xcoord+ count][ycoord])
      if (board[xcoord + count][ycoord] != ' ' ) {
        safehorizontal = true //true if direction is blocked, so nothing can check
        //console.log(safehorizontal)
      }
      count += direction
    }
    count = direction
    while (safevertical != true && ycoord + count <= 7 && ycoord + count >= 0) {
      console.log("valid2 " + count)
      if (board[xcoord][ycoord + count].charAt(0) == 'r' ||
      board[xcoord][ycoord + count].charAt(0) == 'Q' &&
      board[xcoord][ycoord + count].charAt(2) == letter2) {
          return true
      }
      if (board[xcoord][ycoord + count].charAt(2) != ' ') {
        safevertical = true
      }
      count += direction
    }
  }

  console.log("Checking for bishop/queen check")
  for(posy=-1;posy<2;posy+=2){
    console.log(xcoord, ycoord)
    let safeBLeft = false
    let safeBRight = false
    let count = 0;
    let direction = posy;
    count = direction
    console.log(direction, "is direction")
    while(!safeBLeft && xcoord + count <= 7 && xcoord + count >= 0
    && ycoord + count <= 7 && ycoord + count >= 0 ){
      console.log(board[xcoord + count][ycoord + count], "piece")
      if(board[xcoord+ count][ycoord + count].charAt(2) == letter2){
      if (board[xcoord + count][ycoord + count].charAt(0) == 'b' || 
      board[xcoord + count][ycoord + count].charAt(0) == 'Q') {
          return true
      }
    }
      if(board[xcoord + count][ycoord + count] != ' '){
        safeBLeft = true
        console.log('safe by left')
      }
      count+=direction
      console.log(count)
    }
    count = direction
    while(!safeBRight && xcoord + count <= 7 && xcoord + count >= 0
    && ycoord - count <= 7 && ycoord - count >= 0 ){
      console.log(board[xcoord + count][ycoord - count], "piece")
      if(board[xcoord+ count][ycoord - count].charAt(2) == letter2){
        if (board[xcoord + count][ycoord - count].charAt(0) == 'b' || 
            board[xcoord + count][ycoord - count].charAt(0) == 'Q') {
          return true
        }
      }
      if(board[xcoord + count][ycoord - count] != ' '){
        safeBRight = true
        console.log('safe by right')
      }
      count += direction
    }
  }
  console.log("checking for check by pawn")
  let countP = 0
  if(colour == whitepieces){
    countP = 1}
  else{
    countP = -1
  }
  if(xcoord + 1 <= 7 && xcoord + 1 >= 0
  && xcoord - 1 <= 7 && xcoord - 1 >= 0
  && ycoord + countP <= 7 && ycoord + countP >= 0 ){
    //console.log("correct")
    if(board[xcoord-1][ycoord + countP].charAt(2) == letter2 && 
      board[xcoord-1][ycoord + countP].charAt(0) == 'p'){
      console.log("pawncheck")
      return true
      }
      if(board[xcoord+1][ycoord + countP].charAt(2) == letter2 && 
      board[xcoord+1][ycoord + countP].charAt(0) == 'p'){
        console.log("pawncheck")
        return true
    }
  }

  console.log("no check")
  return false
}


function findPossible(piece, colour, x, y){
  checking = true
  console.log('checking',checking)
  if(colour == 'b'){
    colourarray = blackpieces
  }
  else{
    colourarray = whitepieces
  }
  if(turns%2 == 1){
    if(colour == 'w'){
    console.log('wrongside')
    return false
    }
  }
  if(turns%2 == 0){
    if(colour == 'b'){
    console.log('wrong side')
    return false
    }
  }
  for (let ax = 0; ax < 8; ax++) {
    for (let ay = 0; ay < 8; ay++) {
      if(board[ax][ay].charAt(2) != colour){
        if(checkPieceRule(piece, x, y, ax, ay, colourarray)){//checks if the rules would allow the piece to move for every position on the board
          let temp = board[x][y]//old position
          let temp2 = board[ax][ay]//new position
          board[ax][ay] = board[x][y]
          board[x][y] = ' '
          if (turns % 2 == 1){
            console.log(board[ax][ay], '!!!!!!!!!!!!!!!!!!!!!')
            if(board[ax][ay].charAt(0) !='K'){
              if (!checkifCheck(blackpieces, blackpieces[14].coordx, blackpieces[14].coordy)) {//if move is possble, checks if it would result in check
                ctx.fillStyle = 'green'
                ctx.fillRect(ax*100 + offset +5,ay*100 + offsety+5,5,5)
              }
              else{
                console.log("tries into check")
                  }
                }
                else{
                  console.log("checkign king")
                  if(!checkifCheck(blackpieces, ax, ay)){
                  ctx.fillStyle = 'green'
                  ctx.fillRect(ax*100 + offset +5,ay*100 + offsety+5,5,5)
                }
              }
            }
            if (turns % 2 == 0) {
              console.log(board[ax][ay], '!!!!!!!!!!!!!!!!!!!!!')
              if(board[ax][ay].charAt(0)!='K'){
                if (!checkifCheck(whitepieces, whitepieces[14].coordx, whitepieces[14].coordy)) {
                  ctx.fillStyle = 'green'
                  ctx.fillRect(ax*100 + offset+5 ,ay*100+ offsety+5 ,5,5)
                }
                else{
                  console.log("tries into check")
                  }
                }
                else{
                  console.log("checkign king")
                  if(!checkifCheck(whitepieces, ax, ay)){
                  ctx.fillStyle = 'green'
                  ctx.fillRect(ax*100 + offset +5,ay*100 + offsety+5,5,5)
                }
              }
            }
          board[x][y] = temp //resets origional position
          board[ax][ay] = temp2
        }
      }
    }
  }
  checking = false
  console.log('checking',checking)
}


function saveboard(colour){
  for(let j = 0;j<16;j++){
    colour[j].state = false
  }
  for(let x = 0;x<8;x++){
    for(let y = x;y<8;y++){
      if(board[x][y] != ' '){
        for(let j=0;j<16;j++){
          if(colour[j].type == board[x][y]){
            colour[j].state = true
            colour[j].coordx = x
            colour[j].coordy = y
            colour[j].moved = false
          }
        }
      }
    }
  }
}

//while (checkmate == false) {
  function clearboard(){
    turns = 0;
    whitepieces = [];
    blackpieces = [];
    addAll(whitepieces, 0, 1)
    addAll(blackpieces, 7, 6)
    for (let x = 0; x <= board.length - 1; x++) {
      for (let y = 0; y <= board.length - 1; y++) {
        board[x][y] = ' '
      }
    }
      fillBoard(whitepieces)
      fillBoard(blackpieces)
      if(!start){
        backBoard()
        printBoard()
      }
      start = false
    }

    clearboard()
  
    pieceImages["black_bishop"] = new Image();
    pieceImages["black_bishop"].src = "./pieces/black_bishop.png";
  
    pieceImages["black_King"] = new Image();
    pieceImages["black_King"].src = "./pieces/black_king.png";
  
    pieceImages["black_knight"] = new Image();
    pieceImages["black_knight"].src = "./pieces/black_knight.png";
  
    pieceImages["black_pawn"] = new Image();
    pieceImages["black_pawn"].src = "./pieces/black_pawn.png";
  
    pieceImages["black_Queen"] = new Image();
    pieceImages["black_Queen"].src = "./pieces/black_queen.png";
  
    pieceImages["black_rook"] = new Image();
    pieceImages["black_rook"].src = "./pieces/black_rook.png";
  
    pieceImages["white_bishop"] = new Image();
    pieceImages["white_bishop"].src = "./pieces/white_bishop.png";
  
    pieceImages["white_King"] = new Image();
    pieceImages["white_King"].src = "./pieces/white_king.png";
  
    pieceImages["white_knight"] = new Image();
    pieceImages["white_knight"].src = "./pieces/white_knight.png";
  
    pieceImages["white_pawn"] = new Image();
    pieceImages["white_pawn"].src = "./pieces/white_pawn.png";
  
    pieceImages["white_Queen"] = new Image();
    pieceImages["white_Queen"].src = "./pieces/white_queen.png";
  
    pieceImages["white_rook"] = new Image();
    pieceImages["white_rook"].src = "./pieces/white_rook.png";
  
  
    setTimeout(backBoard, printBoard,  100);
    //}
    //movePiece()
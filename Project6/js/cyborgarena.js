(function game(global){

  var moveSfx = document.createElement("audio");
  moveSfx.src = "sound/move.mp3";
  //var tilezoomSfx = document.createElement("audio");
  //tilezoomSfx.src = "sound/check.mp3";
  //var laserSfx = document.createElement("audio");
  //laserSfx.src = "sound/laser.mp3";
  //var damageSfx = document.createElement("audio");
  //damageSfx.src = "sound/damage.mp3";

  var boardSize = 0;
  var mslocation = {};
  mslocation.x = boardSize;
  mslocation.y = boardSize;
  
  var selectionLocation = {};
  var selectionFlag = false;
  var selection = 32;
  var last_selected = 32;
  var startFrame = 0;

  //animation control flags
  var animationFlags = {};
  animationFlags.isAnimating = false;
  animationFlags.drawBoard = false;
  animationFlags.drawPieces = false;
  
  
  var movePieceNumber = 32;
  var takenPieceNumber = 32;
  var whiteInCheck = false;
  var blackInCheck = false;
  var computerAI = false;
  var gameEnd = false;

  var turndata = {};
  var turnFlag = "white";
  turndata.side = 0; // 0 for white to move, 1 for black's go
  turndata.whiteclock = 0;
  turndata.blackclock = 0;

  var squares = [];
  var pieces = [];
  var piece_img = [];
  var board_img = [];

  //animation objects - custom routines to simulate CSS easing functionality in JS canvas
  var cvsMoveScale = {};
  var cvs2Opacity = {};
  var cvs3Opacity = {};
  var cvs3PieceMoveX = {};
  var cvs3PieceMoveY = {};

///////////////////////////////////////////////////////////////////////////////////////
piece_img = setupPieceImages(piece_img,["img/connor.png","img/terminator.png", "img/rock.png", "img/rock.png", "img/rock.png", "img/rock.png", "img/rock.png"]);
board_img = setupPieceImages(board_img,["img/arena.jpg", "img/board_tile1.jpg", "img/board_tile2.jpg", "img/board_tile3.jpg", "img/selection_frame.png", "img/selection1.jpg", "img/selection2.jpg"]);
loadBoardData("board.json", squares);

//start game/////////////////////////////////////////////////////////////////////
function setBoardData(bsize, data){
  boardSize = bsize;
  squares = data;
  pieces = setupPieces(pieces,2,8,boardSize);
}  

function startGame(){
 setCanvasSize(boardSize);
 resetBoard();
 cvs2Opacity = setCanvasAnimation(0, 0, 0);
 cvs3Opacity = setCanvasAnimation(1, 0, 1000);
 cvsMoveScale = setCanvasAnimation(0, moveScaleFactor, 490);
 cvs3PieceMoveX = setCanvasAnimation(0, 0, 0);
 cvs3PieceMoveY = setCanvasAnimation(0, 0, 0);
 addEventHandlers();
 animationFlags.drawBoard = true;
 animationFlags.drawPieces = true;
 animationFlags.isAnimating = false;
 requestAnimationFrame(drawGame); 
}

global.$setBoardData = setBoardData;
global.$startGame = startGame;

///end of set up////////////////////////////////////////////////////////////////
//EVENTS
window.addEventListener("resize", function(){
  setCanvasSize(boardSize);
  cvsMoveScale = setCanvasAnimation(0, moveScaleFactor, 490);
  animationFlags.drawBoard = true;
  animationFlags.drawPieces = true;
  animate();
});

function addEventHandlers(){
  canvas.addEventListener("click", boardClick);
  canvas.addEventListener("mousemove", mouseMoveHighlight);
  canvas.addEventListener("mouseout", noHighlight);
}

////////////////////////////////////////////////////////////////////////////////
//Board click events
var boardClick = function(event){
//movePieceNumber is set to 32 once piece animations have ended, don't allow new selection until then
if (movePieceNumber === 32){
  selectionLocation.x = getBoardPosition(event.offsetX, boardSize);
  selectionLocation.y = getBoardPosition(event.offsetY, boardSize);
   //Check that selection is inside the board area 
   if (mslocation.x !== boardSize && mslocation.y !== boardSize){
    last_selected = selection;

    selection = squares[selectionLocation.x][selectionLocation.y].piece;

    //calcAllMoves(); //computer AI player????
    if (selection <= 32 || selection === 50){selectionFlag = false;resetSelection();}
    if (turnFlag === "white" && selection === 0){selectionFlag = true;displayPieceMoves(selection);}
    if (turnFlag === "black" && selection === 1){selectionFlag = true;displayPieceMoves(selection);}
    //>=200 range is for calculated piece moves on board
    if (selection >= 200){ 
      cvs2Opacity = setCanvasAnimation(cvs2Opacity.current, 0, 300);
      selectionFlag = false;
      movePiece();
      if (turnFlag === "white"){turnFlag = "black";}
      else{turnFlag = "white";}
    }
    animationFlags.drawBoard = true;
    animationFlags.drawPieces = true;
    animate();
  }
}
}

////////////////////////////////////////////////////////////////////////////////
//Mousemove event

//add highlight to board
var mouseMoveHighlight = function(event){
  mslocation.lastx = mslocation.x;
  mslocation.lasty = mslocation.y;
  mslocation.x = getBoardPosition(event.offsetX, boardSize);
  mslocation.y = getBoardPosition(event.offsetY, boardSize);
  //if (mslocation.x<(boardSize) && mslocation.x>=0 && mslocation.y<boardSize && mslocation.y>=0){
    if (mslocation.x !== boardSize && mslocation.y !== boardSize){
      if (cvs2Opacity.target === 0){cvs2Opacity = setCanvasAnimation(cvs2Opacity.current, 0.7, 300);}
    }else{
      mslocation.x = mslocation.lastx;
      mslocation.y = mslocation.lasty;
      noHighlight();
    } 
    if (mslocation.lastx !== mslocation.x || mslocation.lasty !== mslocation.y || cvs2Opacity.current !== cvs2Opacity.target){
     animate();
   }
 }

//remove highlight
var noHighlight = function(){
  if (cvs2Opacity.target !== 0){
    cvs2Opacity = setCanvasAnimation(cvs2Opacity.current, 0, 300);
    animate();
  }
}

///////////////////////////////////////////////////////////////////////////////
//SET UP BOARD SQUARES

//Resets the squares to 32 (normal squares no selections) ////////////////////
function resetSelection(){
  var y,x,a;

  for (y=0;y < boardSize; y++){
    for (x=0;x < boardSize; x++){
      if (squares[x][y].tile === 1 || squares[x][y].tile === 2){squares[x][y].piece = 32;}
      if (squares[x][y].tile === 3){squares[x][y].piece = 50;}
    }
  }
  for (a=0;a<pieces.length;a++){
    if (pieces[a].isTaken === false){squares[pieces[a].x][pieces[a].y].piece = a;}
  }
}

//Resets the entire board and re-calculates the checkmaps for each player /////
function resetBoard(){
  var y,x,a;

  for (y=0;y < boardSize; y++){
    for (x=0;x < boardSize; x++){
      if (squares[x][y].tile === 1 || squares[x][y].tile === 2){squares[x][y].piece = 32;}
      else squares[x][y].piece = 50;
      squares[x][y].whiteMoveMap = 0;
      squares[x][y].blackMoveMap = 0;
      squares[x][y].moveMap = 0;
    }
  }

  for (a=0;a<pieces.length;a++){
    if (pieces[a].isTaken === false){
      squares[pieces[a].x][pieces[a].y].piece = a;
      pieces[a].moves = [];
    }
  }
    //calculate all the moves -- for the new promoted pawn too
    calcAllMoves();
  }
  
////////////////////////////////////////////////////////////////////////////////
//CALCULATING MOVES//
function calcAllMoves(){
  var count;

  calcPlayerMoves(0,0);
  calcPlayerMoves(1,0);
}


function displayPieceMoves(p){
  var i;
  var numberOfMoves;
  numberOfMoves = pieces[p].moves.length;
  for (i=0; i < numberOfMoves; i++){
    squares [pieces[p].moves[i].x][pieces[p].moves[i].y].piece = pieces[p].moves[i].moveType;
  }
}


//make sure a square is free i.e code 32
function testSquareForMove(x, y, p, count){
  if (x >= 0 && y >= 0 && x < boardSize && y < boardSize){
    if (squares[x][y].piece === 32){
      pieces[p].moves[count] = {x:x, y:y, moveType:200};
      count++;
    }
  }
  return count;
}

//calculate moves - 1 to 3 squares in up/down/left/right direction
function calcPlayerMoves(p, movecount){
  var MoveInDirection = true;
  var lastMove;
  var i = 1;

  while (pieces[p].x+i < boardSize && MoveInDirection === true && i<=3){
    if (squares[pieces[p].x+i][pieces[p].y].piece !== 32){MoveInDirection = false;}
    movecount = testSquareForMove(pieces[p].x+i, pieces[p].y, p, movecount);
    i++;
  }
  i = 1;
  MoveInDirection = true;
  while (pieces[p].x-i >= 0 && MoveInDirection === true && i<=3){
    if (squares[pieces[p].x-i][pieces[p].y].piece !== 32){MoveInDirection = false;}
    movecount = testSquareForMove(pieces[p].x-i, pieces[p].y, p, movecount);
    i++;
  }
  i = 1;
  MoveInDirection = true;
  while (pieces[p].y+i < boardSize && MoveInDirection === true && i<=3){
    if (squares[pieces[p].x][pieces[p].y+i].piece !== 32){MoveInDirection = false;}
    movecount = testSquareForMove(pieces[p].x, pieces[p].y+i, p, movecount);
    i++;
  }
  i = 1;
  MoveInDirection = true;
  while (pieces[p].y-i >= 0 && MoveInDirection === true && i<=3){
    if (squares[pieces[p].x][pieces[p].y-i].piece !== 32){MoveInDirection = false;}
    movecount = testSquareForMove(pieces[p].x, pieces[p].y-i, p, movecount);
    i++;
  }
  return movecount;
}

///////////////////////////////////////////////////////////////////////////////
//DRAWING Handling 
//MAIN DRAW function called on animationframe - master draw control function
// requestAnimationFrame is asynchronous therefore need to set flags so
// we don't call it twice if a previous call is already waiting to draw
//////////////////////////////////////////////////////////////////////////////
function animate(){
  if (animationFlags.isAnimating === false){requestAnimationFrame(drawGame);}
}


function resetPiece(){
  moveSfx.play();
  animationFlags.isAnimating = false;
  tempPieceNumber = movePieceNumber;
  cvsMoveScale = setCanvasAnimation(0, moveScaleFactor, 490);
  movePieceNumber = 32;
  takenPieceNumber = 32;
  resetBoard();
  animationFlags.drawBoard = true;
}


function drawGame(timestamp){
  var tempPieceNumber = 0;

  if (cvs2Opacity.current !== cvs2Opacity.target){ 
    animationFlags.isAnimating = true;
      cvs2Opacity.current = animateAttribute(cvs2Opacity, timestamp, "ease-in-out"); //add easing method - ease-in-out, linear, ease-in
    }else{
      animationFlags.isAnimating = false;
    }
    if (movePieceNumber !== 32){    
      animationFlags.isAnimating = true;  
      if (cvsMoveScale.target === moveScaleFactor){
        cvsMoveScale.current = animateAttribute(cvsMoveScale, timestamp, "ease-out");
        if (cvsMoveScale.current === cvsMoveScale.target){cvsMoveScale = setCanvasAnimation(moveScaleFactor, 0, 490);}
      }
      else {cvsMoveScale.current = animateAttribute(cvsMoveScale, timestamp, "ease-in");}
      pieces[movePieceNumber].y = animateAttribute(cvs3PieceMoveY, timestamp, "ease-in-out");
      pieces[movePieceNumber].x = animateAttribute(cvs3PieceMoveX, timestamp, "ease-in-out");
      if (pieces[movePieceNumber].x === cvs3PieceMoveX.target && pieces[movePieceNumber].y === cvs3PieceMoveY.target){resetPiece();}
    }

    if (animationFlags.drawPieces === true || animationFlags.drawBoard === true){
      drawBoard(squares, board_img, boardSize, selectionLocation, selectionFlag);
      drawPieces(pieces, piece_img, movePieceNumber);
      animationFlags.drawBoard = false;
      animationFlags.drawPieces = false;
    }

    copyBoardToAnimationBuffer();
    drawHighlight(board_img[4], mslocation.x, mslocation.y, cvs2Opacity.current);
    if (takenPieceNumber !== 32){drawTakenPiece(piece_img[pieces[takenPieceNumber].piece], pieces[takenPieceNumber].x, pieces[takenPieceNumber].y, cvs3Opacity.current);}
    if (movePieceNumber !== 32){drawPieceAnimations(piece_img[pieces[movePieceNumber].piece], pieces[movePieceNumber].x, pieces[movePieceNumber].y, cvsMoveScale.current);}
    drawCanvas();
    
    if (animationFlags.isAnimating === true){requestAnimationFrame(drawGame);}//callback
  }


//Sets the animation for moving a piece and resets the board //////////////////
function movePiece(){
  movePieceNumber = last_selected;
  cvs3PieceMoveX = setCanvasAnimation(pieces[movePieceNumber].x, selectionLocation.x, 1000);
  cvs3PieceMoveY = setCanvasAnimation(pieces[movePieceNumber].y, selectionLocation.y, 1000);
    //reset selection pieces - 32 is the number of piece to use for no piece
    squares[pieces[movePieceNumber].x][pieces[movePieceNumber].y].piece = 32;
    last_selected = 32;
    selection = 32;
    resetSelection();
    animate();
  }

//end of IIFE  
})(window);

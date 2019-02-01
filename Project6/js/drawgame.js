//drawing routines for game and canvas variables
(function(global){

//PUBLIC
global.$setCanvasSize = setCanvasSize;
global.$getBoardPosition = getBoardPosition;
global.$drawHighlight = drawHighlight;
global.$drawBoard = drawBoard;
global.$drawPieces = drawPieces;
global.$drawPieceAnimations = drawPieceAnimations;
global.$drawEnergyBars = drawEnergyBars;
global.$drawWeapons = drawWeapons;
global.$copyBoardToAnimationBuffer = copyBoardToAnimationBuffer;
global.$drawCanvas = drawCanvas;
global.$setObjectScreenXY = setObjectScreenXY;
global.$setCanvasObjects = setCanvasObjects;
global.$drawZapAnimations = drawZapAnimations;


//PRIVATE
var sw;
var board;
var canvas;
var boardBuffer;
var animationBuffer;
var ctxCanvas;
var ctxBoardBuffer;
var ctxAnimationBuffer;
var cvsScale = 0.9;
var cvsOffsetX, cvsOffsetY = 0;


//IMPLEMENTATION

function setCanvasObjects(){
  board = document.getElementById('board_area');
  canvas = document.getElementById("gameCanvas");
  boardBuffer = document.createElement("canvas");
  animationBuffer = document.createElement("canvas");
  ctxCanvas = canvas.getContext("2d");
  ctxBoardBuffer = boardBuffer.getContext("2d");
  ctxAnimationBuffer = animationBuffer.getContext("2d");
}

//sets the canvas size on start and resize
function setCanvasSize(boardSize, weapons){
  var boardWidth, boardHeight;
  boardWidth = Math.round($("#board_area").width());
  boardHeight = Math.round($("#board_area").height());
   //canvas.width = board.clientWidth;
  //canvas.height = board.clientHeight;
  canvas.width = boardWidth;
  canvas.height =  boardHeight;
  boardBuffer.width = boardWidth;
  boardBuffer.height = boardHeight;
  animationBuffer.width = boardWidth;
  animationBuffer.height = boardHeight;
  sw = (boardWidth / boardSize)*cvsScale;
  cvsOffsetX = (boardWidth*(1-cvsScale))/2;
  cvsOffsetY = (boardHeight*(1-cvsScale))/2;
  canvas.style.width = boardWidth + "px";
  canvas.style.height = boardHeight + "px";
  //moveScaleFactor = canvas.width/10;
}

function setObjectScreenXY(gameObject){
  var x,y,i;

  for (i=0;i<gameObject.length;i++){
    //gameObject[i].screenX = gameObject[i].x*sw+cvsOffsetX;
    //gameObject[i].screenY = gameObject[i].y*sw+cvsOffsetY; 
    gameObject[i].centreX = gameObject[i].x*sw+cvsOffsetX + sw/2;
    gameObject[i].centreY = gameObject[i].y*sw+cvsOffsetY + sw/2;
  }
}


//gets the pointer position
function getBoardPosition(coordinate, boardSize){
  var boardXY;

  boardXY = Math.floor((coordinate-cvsOffsetX)/sw);
  if (boardXY<(boardSize) && boardXY>=0){return boardXY;}
  else{boardXY = boardSize;return boardXY;}
}


//Draw the highlight over the pointer
function drawHighlight(image, x, y, opacity){
  ctxAnimationBuffer.globalAlpha = opacity;
  ctxAnimationBuffer.drawImage(image, x*sw+cvsOffsetX, y*sw+cvsOffsetY, sw, sw);
  ctxAnimationBuffer.globalAlpha = 1;
}


//Draws the board on offscreen canvas - only called if there was an update /////
function drawBoard(squares, board_img, boardSize, selectionLocation, selectionFlag){
  var bx,by,x,y,boardIndex;
  var cw = canvas.width / 2;
  var cb = sw /2;
  var rGrad;

  ctxBoardBuffer.save();
  //effectively clears the board as image is full size of board
  ctxBoardBuffer.drawImage(board_img[0],0,0,canvas.width, canvas.height);
  for (y=0;y < boardSize; y++){
    for (x=0;x < boardSize; x++){
      if (squares[x][y].tile < 3){ctxBoardBuffer.drawImage(board_img[squares[x][y].tile], x*sw+cvsOffsetX , y*sw+cvsOffsetY, sw, sw);}
    }
  }
  for (y=0;y < boardSize; y++){
    for (x=0;x < boardSize; x++){
      if (squares[x][y].tile === 3 || squares[x][y].tile === 4){
        ctxBoardBuffer.save();
        ctxBoardBuffer.shadowOffsetX = 5;
        ctxBoardBuffer.shadowOffsetY = 5;
        ctxBoardBuffer.shadowColor = "#000";
        ctxBoardBuffer.shadowBlur = 20;
        ctxBoardBuffer.drawImage(board_img[squares[x][y].tile], x*sw+cvsOffsetX , y*sw+cvsOffsetY, sw, sw);
        ctxBoardBuffer.restore();}
      }
    }  

    if (selectionFlag === true){
      bx = selectionLocation.x*sw+cvsOffsetX;
      by = selectionLocation.y*sw+cvsOffsetY;
      ctxBoardBuffer.drawImage(board_img[5], bx, by, sw, sw);//gold glow behind piece
    }
    for (y=0;y < boardSize; y++){
      for (x=0;x < boardSize; x++){
        if (squares[x][y].piece === 200){ctxBoardBuffer.drawImage(board_img[6], x*sw+cvsOffsetX , y*sw+cvsOffsetY, sw, sw);}
        if (squares[x][y].piece === 250){ctxBoardBuffer.drawImage(board_img[7], x*sw+cvsOffsetX , y*sw+cvsOffsetY, sw, sw);}
      }
    }
    ctxBoardBuffer.restore();
  }


//Draws the pieces on offscreen board - only called if there was a change //
function drawPieces(pieces, piece_img, movePieceNumber, zapFlag){
  var i;

  ctxBoardBuffer.save();
  ctxBoardBuffer.shadowOffsetX = 2;
  ctxBoardBuffer.shadowOffsetY = 2;
  ctxBoardBuffer.shadowColor = "#000";
  ctxBoardBuffer.shadowBlur = 10;
  for (i=0; i<pieces.length; i++){
    if (pieces[i].isTaken === false && i !== movePieceNumber && i !== (zapFlag-1) && zapFlag !== 3){ctxBoardBuffer.drawImage(piece_img[pieces[i].piece], pieces[i].x*sw+cvsOffsetX, pieces[i].y*sw+cvsOffsetY, sw, sw);}
  }
  ctxBoardBuffer.restore();
}


function drawPieceAnimations(imageMove, piece, scale){
  var s,s2,shadowScale;

  s = (sw/2*scale.current);
  s2 = sw*scale.current;
  shadowScale = sw*(scale.current-1);
  piece.centreX = piece.x*sw+cvsOffsetX+sw/2;
  piece.centreY = piece.y*sw+cvsOffsetY+sw/2;
  //always draw the moving piece last so it is on top, fade shadow down as piece scales up
  ctxAnimationBuffer.save();
  ctxAnimationBuffer.shadowOffsetX = 2+ shadowScale; 
  ctxAnimationBuffer.shadowOffsetY = 2+ shadowScale;
  ctxAnimationBuffer.shadowColor = "#000";
  ctxAnimationBuffer.shadowBlur = 10 + shadowScale;
  ctxAnimationBuffer.drawImage(imageMove, piece.centreX-s, piece.centreY-s, s2, s2);
  
  ctxAnimationBuffer.restore();
}


function drawZapAnimations(imageZap, piece, scale, zap){
  var s,s2,shadowScale;

  s = (sw/2*scale.current);
  s2 = sw*scale.current;
  piece.centreX = piece.x*sw+cvsOffsetX+sw/2;
  piece.centreY = piece.y*sw+cvsOffsetY+sw/2;
  //always draw the moving piece last so it is on top, fade shadow down as piece scales up
  ctxAnimationBuffer.save();
  ctxAnimationBuffer.globalAlpha = 1-zap.current; 
  ctxAnimationBuffer.drawImage(imageZap, piece.centreX-s, piece.centreY-s, s2, s2);
  ctxAnimationBuffer.restore();
}


function drawEnergyBars(energyImages, energySquares, opacity){
  var x,y;

  ctxAnimationBuffer.save();
  ctxAnimationBuffer.globalAlpha = opacity;
  for (y=0;y < energySquares.length; y++){
    for (x=0;x < energySquares.length; x++){
      if (energySquares[x][y] === 1){ctxAnimationBuffer.drawImage(energyImages[0], x*sw+cvsOffsetX , y*sw+cvsOffsetY, sw, sw);}
      if (energySquares[x][y] === 2){ctxAnimationBuffer.drawImage(energyImages[1], x*sw+cvsOffsetX , y*sw+cvsOffsetY, sw, sw);}
      if (energySquares[x][y] === 3){ctxAnimationBuffer.drawImage(energyImages[2], x*sw+cvsOffsetX , y*sw+cvsOffsetY, sw, sw);}
    }
  }
  ctxAnimationBuffer.restore();
}

//draws the game weapons to the animation buffer
function drawWeapons(weaponImages, weapons, rotation, timestamp){
  var x,y,i,s,s2;
  
  for (i = 0;i < weapons.length;i++){ 
    if (weapons[i].isTaken === false && weapons[i].underPiece === false){
      s = (sw/2*weapons[i].scale.current);
      s2 = sw*weapons[i].scale.current;
      ctxAnimationBuffer.save(); 
      ctxAnimationBuffer.translate(weapons[i].centreX, weapons[i].centreY);
      ctxAnimationBuffer.rotate(rotation);
      ctxAnimationBuffer.translate(-weapons[i].centreX, -weapons[i].centreY);
      ctxAnimationBuffer.drawImage(weaponImages[i], weapons[i].centreX-s, weapons[i].centreY-s, s2, s2);
      ctxAnimationBuffer.restore();
    }
  }
  
}


//draws the board canvas to the animation buffer 
function copyBoardToAnimationBuffer(){
  ctxAnimationBuffer.drawImage(boardBuffer,0,0,canvas.width, canvas.height);
}

//draws the animation buffer to the screen 
function drawCanvas(){
  ctxCanvas.drawImage(animationBuffer,0,0,canvas.width, canvas.height);
}

})(window);
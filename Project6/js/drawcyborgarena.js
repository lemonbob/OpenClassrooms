//drawing routines for game and canvas variables
var sw;
var board = document.getElementById('board_area');
var canvas = document.getElementById("gameCanvas");
var boardBuffer = document.createElement("canvas");
var animationBuffer = document.createElement("canvas");
var ctxCanvas = canvas.getContext("2d");
var ctxBoardBuffer = boardBuffer.getContext("2d");
var ctxAnimationBuffer = animationBuffer.getContext("2d");
var cvsOffsetX, cvsOffsetY = 0;
var cvsScale = 0.9;
var moveScaleFactor = 0;


//sets the canvas size on start and resize
function setCanvasSize(boardSize){
  canvas.width = board.clientWidth;
  canvas.height = board.clientHeight;
  boardBuffer.width = board.clientWidth;
  boardBuffer.height = board.clientHeight;
  animationBuffer.width = board.clientWidth;
  animationBuffer.height = board.clientHeight;
  sw = (canvas.width / boardSize)*cvsScale;
  cvsOffsetX = (board.clientWidth*(1-cvsScale))/2;
  cvsOffsetY = (board.clientHeight*(1-cvsScale))/2;
  canvas.style.width = canvas.width + "px";
  canvas.style.height = canvas.height + "px";
  moveScaleFactor = canvas.width/10;
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
      if (squares[x][y].tile === 3 ){
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
      }
    }
    ctxBoardBuffer.restore();
  }


//Draws the pieces on offscreen board - only called if there was a change //
function drawPieces(pieces, piece_img, movePieceNumber){
  var i;

  ctxBoardBuffer.save();
  ctxBoardBuffer.shadowOffsetX = 2;
  ctxBoardBuffer.shadowOffsetY = 2;
  ctxBoardBuffer.shadowColor = "#000";
  ctxBoardBuffer.shadowBlur = 10;
  for (i=0; i<pieces.length; i++){
    if (pieces[i].isTaken === false && i !== movePieceNumber){ctxBoardBuffer.drawImage(piece_img[pieces[i].piece], pieces[i].x*sw+cvsOffsetX, pieces[i].y*sw+cvsOffsetY, sw, sw);}
  }
  ctxBoardBuffer.restore();
}

function fadeTakenPiece(imageTaken, takenX, takenY, opacity){
  //fade any taken pieces off the board
  ctxAnimationBuffer.globalAlpha = opacity;
  ctxAnimationBuffer.drawImage(imageTaken, takenX*sw+cvsOffsetX, takenY*sw+cvsOffsetY, sw, sw);
  ctxAnimationBuffer.globalAlpha = 1;
}


function drawPieceAnimations(imageMove, moveX, moveY, scale){
  //always draw the moving piece last so it is on top, fade shadow down as piece scales up
  ctxAnimationBuffer.save();
  ctxAnimationBuffer.shadowOffsetX = 2 + scale * 2;
  ctxAnimationBuffer.shadowOffsetY = 2 + scale * 2;
  ctxAnimationBuffer.shadowColor = "#000";
  ctxAnimationBuffer.shadowBlur = 10 + scale * 4;
  ctxAnimationBuffer.drawImage(imageMove, moveX*sw-scale+cvsOffsetX, moveY*sw-scale+cvsOffsetY, sw+scale*2, sw+scale*2);
  ctxAnimationBuffer.restore();
}


//animation control - sets an attribute from 0 - 1 based on easing equation /////////////
function animateAttribute(attributeObject, timestamp, easing){
  var percentDone;

  if (attributeObject.startFrame == 0){attributeObject.startFrame = timestamp;}
  attributeObject.timestamp = timestamp;
  percentDone = (attributeObject.timestamp - attributeObject.startFrame) / attributeObject.duration;
  if (percentDone >= 1){percentDone = 1;}
  if (easing === "ease-in-out"){attributeObject.current = attributeObject.original + (((3*percentDone*percentDone) - 2*percentDone*percentDone*percentDone) * attributeObject.difference);}
  if (easing === "ease-in"){attributeObject.current = attributeObject.original + ((percentDone*percentDone) * attributeObject.difference);}
  if (easing === "ease-out"){attributeObject.current = attributeObject.original + ((1-(1-percentDone)*(1-percentDone)) * attributeObject.difference);}
  if (easing === "linear"){attributeObject.current = attributeObject.original + (percentDone * attributeObject.difference);}
  return attributeObject.current;
}


//draws the board canvas to the animation buffer 
function copyBoardToAnimationBuffer(){
  ctxAnimationBuffer.drawImage(boardBuffer,0,0,canvas.width, canvas.height);
}

//draws the animation buffer to the screen 
function drawCanvas(){
  ctxCanvas.drawImage(animationBuffer,0,0,canvas.width, canvas.height);
}
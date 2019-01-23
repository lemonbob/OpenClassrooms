//board loader functions AJAX for game
var loadCount = 0;
var totalLoadCount = 0;


//load the board from the external JSON data file, board can be almost any size.
function loadBoardData(url, boardSquares){
  var tempJSON, boardSize;

  $.getJSON(url, function(tempJSON){
    boardSize = getMaxSize(tempJSON);
    boardSquares = setupBoard(tempJSON, boardSize, boardSquares);
    $setBoardData(boardSize, boardSquares);
    isLoaded();
  });
}

//get size of the board
function getMaxSize(boardJSON){
  var i,maxX,maxY;
  var size = {};
  maxX = boardJSON[0].x;
  maxY = boardJSON[0].y;

  for (i=0;i<boardJSON.length;i++){
    if (boardJSON[i].x > maxX){maxX = boardJSON[i].x}
      if (boardJSON[i].y > maxY){maxY = boardJSON[i].y}
    }
  if (maxY > maxX){maxX = maxY};
  maxX ++;
  return maxX;
}

//setup the board tiles using the JSON data
function setupBoard(boardJSON, boardSize, boardSquares){
  var i,x,y,boardIndex;

  for (i=0; i<boardSize; i++){
    boardSquares[i] = new Array(boardSize);
  }
  for (y=0;y<boardSize; y++){
    for (x=0;x<boardSize; x++){
      boardSquares[x][y] = {};
      boardSquares[x][y].tile = 0;
    }
  } 
  for (i=0;i<boardJSON.length;i++){
    x = boardJSON[i].x;
    y = boardJSON[i].y;
    boardSquares[x][y].tile = boardJSON[i].tile; 
  } 
  return boardSquares;
}

//setup the pieces data and attributes
function setupPieces(pieces, numberPieces, numberWeapons, boardSize){
  var i;

  for (i=0; i<numberPieces; i++){
    pieces[i] = {};
    if (i === 0){ 
      pieces[i].x = 0;
      pieces[i].y = Math.floor(Math.random()*boardSize);
      pieces[i].piece = 0;
    }else{
      pieces[i].x = (boardSize-1);
      pieces[i].y = Math.floor(Math.random()*boardSize);
      pieces[i].piece = 1;
    }
    pieces[i].moves = [];
    pieces[i].isTaken = false;
    pieces[i].isMoving = false;
  }
    //setup weapons 
    /*for (i=numberPieces; i<(numberPieces+numberWeapons); i++){
      pieces[i] = {};
      pieces[i].x = Math.floor(Math.random()*(boardSize-2))+1;
      pieces[i].y = Math.floor(Math.random()*(boardSize-2))+1;
      pieces[i].piece = 5;
      pieces[i].moves = [];
      pieces[i].isTaken = false;
      pieces[i].isMoving = false;
    }*/
    return pieces;
  }

//sets up the images and adds the event function for handling the asynchonous load
function setupPieceImages(piece_img, urlArray){
  var index;

  totalLoadCount += urlArray.length;
  for (index=0; index<urlArray.length; index++){
    piece_img[index] = new Image();
    piece_img[index].src = urlArray[index];
    piece_img[index].onload = isLoaded();
  }
  
  return piece_img;
}

function isLoaded(){
  var i;

  wait_for_load = false;
  loadCount++;
  if (loadCount === (totalLoadCount+1)){
    setTimeout(function(){$startGame();},100);
  }else{
    console.log("waiting for load " + loadCount);
  }
}

////////////////////////////////////////////////////////////////////////////////
//set animations - attributes to allow similar easing function of CSS to be used in canvas
function setCanvasAnimation(originalAttribute, target, time){
  var animationObject = {};

  if (animationObject.target != target){
    animationObject.target = target;
    animationObject.original = originalAttribute;
    animationObject.difference = animationObject.target - animationObject.original;
    animationObject.duration = time;
    animationObject.current = originalAttribute;
    animationObject.startFrame = 0;
    return animationObject;
  }
}

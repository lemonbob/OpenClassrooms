//board loader functions and AJAX for game
(function(global){

global.$resetLoadCount  = resetLoadCount;
global.$loadBoardData = loadBoardData;
global.$setupPieces = setupPieces;
global.$setupWeapons = setupWeapons;
global.$resetWeaponExchangeStatus = resetWeaponExchangeStatus;
global.$setupPieceImages = setupPieceImages;
global.$setupEnergyBars = setupEnergyBars;
global.$resetEnergyBars = resetEnergyBars;
global.$setupEnergySquares = setupEnergySquares;
global.$resetEnergySquares = resetEnergySquares;

//PUBLIC
class energyBarObject{
  constructor(){
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.barSize = 0;
    this.timer = 0;
    this.active = false;
  }
  setBarState(){
    this.timer = this.timer-1;
    if (this.timer <= 0){
      if (this.active === true){this.timer = Math.ceil(Math.random()*15)+1;this.active = false;}
      else {this.timer = Math.ceil(Math.random()*7);this.active = true;}
    }
  };
};


//PRIVATE
var loadCount;
var totalLoadCount;
weaponBaseDamage = [10,10,1,10,1,15,20];
weaponBonusDamage= [0,0,29,10,39,15,20];

/////////////////////////////////////////////////////////
//IMPLEMENTATION 

//load the board from the external JSON data file, board can be almost any size.
function resetLoadCount(){
  loadCount = 0;
  totalLoadCount = 0;
}

function loadBoardData(url, squares){
  var tempJSON, boardSize;

  $.getJSON(url, function(tempJSON){
    boardSize = getMaxSize(tempJSON);
    squares = setupBoard(tempJSON, boardSize, squares);
    $setBoardData(boardSize, squares);
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
function setupBoard(boardJSON, boardSize, squares){
  var i,x,y,boardIndex;

  for (i=0; i<boardSize; i++){
    squares[i] = new Array(boardSize);
  }
  for (y=0;y<boardSize; y++){
    for (x=0;x<boardSize; x++){
      squares[x][y] = {};
      squares[x][y].tile = 0;
      squares[x][y].piece = 32;
      squares[x][y].weapon = 32;
    }
  } 
  for (i=0;i<boardJSON.length;i++){
    x = boardJSON[i].x;
    y = boardJSON[i].y;
    squares[x][y].tile = boardJSON[i].tile;
    if (squares[x][y].tile === 3){squares[x][y].piece = 50;} 
  } 
  return squares;
}

//setup the pieces data and attributes
function setupPieces(pieces, numberPieces, squares){
  var x,y,i;

  for (i=0; i<numberPieces; i++){
    pieces[i] = {};
    if (i === 0){ 
      pieces[i].x = 0;
      pieces[i].piece = 0;
    }else{
      pieces[i].x = (squares.length-1);
      pieces[i].piece = 1;
    }
    pieces[i].y = Math.floor(Math.random()*squares.length);
    pieces[i].weapon = i;
    pieces[i].centreX = 0;
    pieces[i].centreY = 0;
    pieces[i].life = 100;
    pieces[i].moves = [];
    pieces[i].isTaken = false;
    pieces[i].isDefending = false;
    pieces[i].isMoving = false;
    squares[pieces[i].x][pieces[i].y].piece = pieces[i].piece;
  }
  return pieces;
}

function setupWeapons(weapons, numberWeapons, squares){
  var x,y,i;

  for (i=0; i<numberWeapons; i++){
    do{
      x = Math.floor(Math.random()*(squares.length-2))+1;
      y = Math.floor(Math.random()*(squares.length-2))+1;
    }while(squares[x][y].piece !== 32 || squares[x][y].weapon !== 32);
    weapons[i] = {};
    weapons[i].x = x;
    weapons[i].y = y;
    weapons[i].weapon = i;
    weapons[i].damage = weaponBaseDamage[i];
    weapons[i].bonusDamage = weaponBonusDamage[i];
    weapons[i].isTaken = false;
    weapons[i].exchange = 0;
    weapons[i].underPiece = false;
    weapons[i].centreX = 0;
    weapons[i].centreY = 0;
    weapons[i].scale = new animationObject();
    if (i < 2){weapons[i].isTaken = true;}
    if (weapons[i].isTaken === false){
      squares[weapons[i].x][weapons[i].y].weapon = weapons[i].weapon;
    }
  }
  resetWeaponExchangeStatus(weapons, squares);
  return weapons;
}


function resetWeaponExchangeStatus(weapons, squares){
  var i;
  
  for (i = 0; i < weapons.length; i++){
    weapons[i].exchange = 0;
    if (weapons[i].isTaken === false){
      squares[weapons[i].x][weapons[i].y].weapon = weapons[i].weapon;
      weapons[i].scale.setAttribute(1, 0.1, 490);
    }else{
      weapons[i].scale.setAttribute(0.1, 1, 490);
    } 
  }
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


//check for load of all images
function isLoaded(){
  var i;
  //wait_for_load = false;
  loadCount++;
  if (loadCount === (totalLoadCount+1)){
    console.log("Loaded all files, start game!");
    setTimeout(function(){$startGame();},100);
  }else{
    //console.log("waiting for load " + loadCount);
  }
}

///////////////////////////////////////////////////////////////////////////////
//game specific functions

//ENERGY BAR SET UP AND CONTROL FUNCTIONS

//correct all tile maps that were set to 4 for energy bar setup back to 2
function correctSquareMap(squares){
  for (y=0;y < squares.length; y++){
    for (x=0;x < squares.length; x++){
      if (squares[x][y].tile === 4){squares[x][y].tile = 2;
      }
    }
  }
}

//set up the engery bar objects for each board tile that is 3 (laser pillar)
function setupEnergyBars(energy_bars, squares){
 var x,y,i,pass,count = 0;
 var barLength;

 energy_bars = new Array;
 //need to calculate x bars and y bars separately, so two passes one in x and one in y direction
 //x and y bars can overlap but don't want same axis overlaps
 for (pass=0;pass<2;pass++){
   for (y=0;y < squares.length; y++){
    for (x=0;x < squares.length; x++){
      if (squares[x][y].tile === 3){
        squares[x][y].piece = 50;
        barLength = calculateBarLength(squares,x,y,pass);
        for (i=0;i<barLength.length;i++){
          if (barLength[i]>0){
            energy_bars[count] = new energyBarObject();
            energy_bars[count].x = x;
            energy_bars[count].y = y;
            if (i === 0){energy_bars[count].dx = -1;}
            if (i === 1){energy_bars[count].dx = 1;}
            if (i === 2){energy_bars[count].dy = -1;}
            if (i === 3){energy_bars[count].dy = 1;}
            energy_bars[count].barSize = barLength[i];
            energy_bars[count].active = false;
            energy_bars[count].timer = Math.ceil(Math.random()*15)+1;
            count++;
          }  
        }
      }
    }
  }
}
correctSquareMap(squares);
return energy_bars;
}

//calculate the bar length, stop xx and yy overlaps by using tile of board as dimmed tile (i.e 2 or 4) 
function calculateBarLength(squares,x,y,pass){
  var i,j;
  var barLength = [0,0,0,0];
  if (pass === 0){
    i=1;
    while (x-i>=0 && (squares[x-i][y].tile === 1)){
      barLength[0] ++;
      squares[x-i][y].tile = 2;
      i ++;
    }
    i=1;
    while (x+i<squares.length && (squares[x+i][y].tile === 1)){
      barLength[1] ++;
      squares[x+i][y].tile = 2;
      i ++;
    }
  }
  if (pass === 1){
    i=1;
    while (y-i>=0 && (squares[x][y-i].tile === 1 || squares[x][y-i].tile === 2)){
      barLength[2] ++;
      squares[x][y-i].tile = 4;
      i ++;
    }

    i=1;
    while (y+i<squares.length && (squares[x][y+i].tile === 1 || squares[x][y+i].tile === 2)){
      barLength[3] ++;
      squares[x][y+i].tile = 4;
      i ++;
    }
  }
  return barLength;
}

//reset the active state of the energy bar objects on each turn. random 1-15 turns off 1-7 on.
function resetEnergyBars(energyBars){
  var x,y,i;

  for (i=0;i<energyBars.length;i++){
    energyBars[i].setBarState();
  }
  return energyBars;
}

//energy bars are used to set up a square map of the board for the bars
function setupEnergySquares(energySquares, boardSize){
  var x,y,i;
  energySquares = new Array;
  for (i=0; i<boardSize; i++){
    energySquares[i] = new Array(boardSize);
  }

  for (y=0;y<boardSize; y++){
    for (x=0;x<boardSize; x++){
      energySquares[x][y] = 0;
    }
  } 
  return energySquares;
}

//reset the energy bar map on each turn
function resetEnergySquares(energySquares, energyBars){
  var x,y,i,n;

  for (y=0;y<energySquares.length; y++){
    for (x=0;x<energySquares.length; x++){
      energySquares[x][y] = 0;
    }
  } 
  for (i=0;i<energyBars.length;i++){
    if (energyBars[i].dx !== 0 && energyBars[i].active === true){
      n = 1;
      while (n<=energyBars[i].barSize){
        energySquares[energyBars[i].x+(n*energyBars[i].dx)][energyBars[i].y] += 2;
        n++;
      } 
    }
    if (energyBars[i].dy !== 0 && energyBars[i].active === true){
      n = 1;
      while (n<=energyBars[i].barSize){
        energySquares[energyBars[i].x][energyBars[i].y+(n*energyBars[i].dy)] += 1;
        n++;
      } 
    }
  }
  return energySquares;
}

})(window);
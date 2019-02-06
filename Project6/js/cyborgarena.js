//Main game event controlling routine, requestanimationframe is an pseudo-event//

(function game(global){

//PUBLIC

global.$setBoardData = setBoardData;
global.$startGame = startGame;
global.$drawSideBarInfo = drawSideBarInfo;
global.$loadGameFiles = loadGameFiles;
global.$removeEventHandlers = removeEventHandlers;

//CLASS


//PRIVATE 

var boardArea;

//game generic variables and objects
var boardSize = 0;
var mslocation = {};
mslocation.x = 0;
mslocation.y = 0;

var selectionLocation = {};
var selectionFlag = false;
var selection = 32;
var last_selected = 32;

//animation control flags
var animationFlags = {};
animationFlags.isAnimating = false;
animationFlags.drawBoard = false;
animationFlags.drawPieces = false;


var movePieceNumber = 32;
var gameEnd = false;

var turnFlag = "white";
var battleFlag = false;
var zapFlag = 0;

var squares = [];
var pieces = [];
var piece_img = [];
var board_img = [];

//animation control flags
var animationFlags = {};
animationFlags.isAnimating = false;
animationFlags.drawBoard = false;
animationFlags.drawPieces = false;  

//animation objects - custom routines to simulate CSS easing functionality in JS canvas
var cvsMoveScale = new animationObject();
var cvs2Opacity = new animationObject();
var cvs3Opacity = new animationObject();
var cvsLaserOpacity = new animationObject();
var cvs3PieceMoveX = new animationObject();
var cvs3PieceMoveY = new animationObject();
var cvsWeaponAnimation = new animationObject();
var cvsZapAnimation = new animationObject();

////////////////////////////////////////////////////////////////////
//game specific variables and objects 
var weapons = [];
var laser_img = [];
var weapon_img = [];
var energy_bars;
var energySquares;
var weaponMoveArray = [];
var weaponExchangeArray = [];


//IMPLEMENTATION

//SETUP - inititate set up call
function loadGameFiles(){
	$resetLoadCount();
	setInitialVariableState();
	piece_img = $setupPieceImages(piece_img,["img/connor.png","img/terminator.png"]);
	board_img = $setupPieceImages(board_img,["img/arenaborder.svg", "img/board_tile1.jpg", "img/board_tile2.jpg", "img/board_tile3.jpg", "img/selection_frame.png", "img/selection1.jpg", "img/selection2.jpg", "img/selection6.jpg"]);
	laser_img = $setupPieceImages(laser_img,["img/laser1.png","img/laser2.png", "img/laser3.png"]);
	weapon_img = $setupPieceImages(weapon_img,["img/weapon1.png", "img/weapon1.png", "img/weapon2.png", "img/weapon3.png", "img/weapon4.png", "img/weapon5.png"]);
	if (formSettingsData.boardType === "pre-defined"){$loadBoardData(formSettingsData.boardNumber, squares);}
	else{$randomBoardData(formSettingsData.boardSize, formSettingsData.beamGenerators, squares);}

}

//start game function calls
function setBoardData(bsize, data){
	boardSize = bsize;
	squares = data;
	mslocation.x = boardSize;
	mslocation.y = boardSize;
	boardArea = document.getElementById("board_area");
	pieces = $setupPieces(pieces, piece_img.length, squares);
	weapons = $setupWeapons(weapons, weapon_img.length, squares);
	energy_bars = $setupEnergyBars(energy_bars, squares);
	energySquares = $setupEnergySquares(energySquares, boardSize);
	$drawSideBarInfo(turnFlag);
}  

function startGame(){
	$hideLoadingDiv();
	$setCanvasObjects();
	$setCanvasSize(boardSize, weapons);
	$setObjectScreenXY(weapons);
	$setObjectScreenXY(pieces);
	$setBoardScreenXY(squares);
	$resetBoard(pieces, squares, energySquares);
	addEventHandlers();
	cvs2Opacity.setAttribute(0, 0, 0);
	cvs3Opacity.setAttribute(1, 0, 1000);
	cvsLaserOpacity.setAttribute(0.5,0.42,200);
	cvsMoveScale.setAttribute(1, 2, 490);
	cvs3PieceMoveX.setAttribute(0, 0, 0);
	cvs3PieceMoveY.setAttribute(0, 0, 0);
	cvsWeaponAnimation.setAttribute(0,0.34,1000);
	cvsZapAnimation.setAttribute(0,1,2000);
	animationFlags.drawBoard = true;
	animationFlags.drawPieces = true;
	animationFlags.isAnimating = false;
	requestAnimationFrame(drawGame); 
	$("#gameWrapper").css({"opacity":"1"});
	setTimeout(function(){$("#cyborgGame").animate({opacity:1},1000);},500);
}

function setInitialVariableState(){
	mslocation = {};
	animationFlags = {};
	animationFlags.isAnimating = false;
	animationFlags.drawBoard = false;
	animationFlags.drawPieces = false; 
	movePieceNumber = 32;
	gameEnd = false; 
	battleFlag = false;
	zapFlag = 0;
	turnFlag = "white";
	selectionFlag = false;
	selection = 32;
	last_selected = 32;
	boardSize = 0;
	squares = [];
	pieces = [];
	piece_img = [];
	board_img = [];
	weapons = [];
    laser_img = [];
    weapon_img = [];
    weaponMoveArray = [];
    weaponExchangeArray = [];
    cvsMoveScale = new animationObject();
	cvs2Opacity = new animationObject();
	cvs3Opacity = new animationObject();
	cvsLaserOpacity = new animationObject();
	cvs3PieceMoveX = new animationObject();
	cvs3PieceMoveY = new animationObject();
	cvsWeaponAnimation = new animationObject();
	cvsZapAnimation = new animationObject();
}

///end of set up


////////////////////////////////////////////////////////////////////
//EVENTS LISTENERS


function windowResized(){
	$setCanvasSize(boardSize);
	$setObjectScreenXY(weapons);
	$setObjectScreenXY(pieces);
	$setBoardScreenXY(squares);
	drawSideBarInfo(turnFlag);
	cvsMoveScale.setAttribute(1, 2, 490);
	animationFlags.drawBoard = true;
	animationFlags.drawPieces = true;
	animate();
}

function addEventHandlers(){
	window.addEventListener("resize", windowResized);
	boardArea.addEventListener("click", function(event){boardClick(event);});
	boardArea.addEventListener("mousemove", function(event){mouseMoveHighlight(event);});
	boardArea.addEventListener("mouseout", noHighlight);
}

function removeEventHandlers(){
	window.removeEventListener("resize", windowResized);
	boardArea.removeEventListener("click", function(event){boardClick(event);});
	boardArea.removeEventListener("mousemove", function(event){mouseMoveHighlight(event);});
	boardArea.removeEventListener("mouseout", noHighlight);
}

////////////////////////////////////////////////////////////////////
//MAIN CONTROL EVENTS
//Board click events
function boardClick(event){
//movePieceNumber is set to 32 once piece animations have ended, don't allow new selection until then
if (movePieceNumber === 32 && zapFlag === 0 && battleFlag === false){
	selectionLocation.x = $getBoardPosition(event.offsetX, boardSize);
	selectionLocation.y = $getBoardPosition(event.offsetY, boardSize);
   //Check that selection is inside the board area 
   if (selectionLocation.x !== boardSize && selectionLocation.y !== boardSize){

   	last_selected = selection;
   	selection = squares[selectionLocation.x][selectionLocation.y].piece;

   	if (selection <= 32 || selection === 50){selectionFlag = false;resetSelection();}
   	if (turnFlag === "white" && selection === 0){selectionFlag = true;displayPieceMoves(selection);}
   	if (turnFlag === "black" && selection === 1){selectionFlag = true;displayPieceMoves(selection);}
    //>=200 range is for calculated piece moves on board
    if (selection >= 200){ 
    	weaponMoveArray = $checkMoveOverWeapons(pieces[last_selected], squares, weapons, selectionLocation.x, selectionLocation.y);
    	if (weaponMoveArray.length>0){weaponExchangeArray = $weaponRemove(weapons, weaponMoveArray, pieces[last_selected]);}
    	$showWeaponUnderPiece(pieces[last_selected], weapons);
    	cvs2Opacity.setAttribute(cvs2Opacity.current, 0, 300);
    	selectionFlag = false;
    	if (selection === 250){battleFlag = true;}
    	movePiece();
    	if (battleFlag === false){changePlayerGo();}
    }
    animationFlags.drawBoard = true;
    animationFlags.drawPieces = true;
    animate();
}
}
}

//MOUSE EVENTS
//add highlight to board
function mouseMoveHighlight(event){
	if (battleFlag === false && zapFlag === 0){
		mslocation.lastx = mslocation.x;
		mslocation.lasty = mslocation.y;
		mslocation.x = $getBoardPosition(event.offsetX, boardSize);
		mslocation.y = $getBoardPosition(event.offsetY, boardSize);

		if (mslocation.x !== boardSize && mslocation.y !== boardSize){
			if (cvs2Opacity.targetV === 0){cvs2Opacity.setAttribute(cvs2Opacity.current, 0.7, 300);}
		}else{
			mslocation.x = mslocation.lastx;
			mslocation.y = mslocation.lasty;
			noHighlight();
		} 
		if (mslocation.lastx !== mslocation.x || mslocation.lasty !== mslocation.y || cvs2Opacity.current !== cvs2Opacity.targetV){
			animate();
		}
	}
}

//remove highlight
function noHighlight(){
	if (battleFlag === false){
		if (cvs2Opacity.targetV !== 0){
			cvs2Opacity.setAttribute(cvs2Opacity.current, 0, 300);
			animate();
		}
	}
}
//end of events////////////////////////////////////////////////////

//RESET BOARD AFTER MOVE COMPLETE
//change player go
function changePlayerGo(){
	if (turnFlag === "white"){turnFlag = "black";}
	else{turnFlag = "white";}
}

//resets the piece animation and flags once piece has finished moving
function resetPiece(timestamp){
	var pieceNum;

	moveSfx.play();
	animationFlags.isAnimating = false;
	cvsMoveScale.setAttribute(1, 2, 490);
	movePieceNumber = 32;
	energy_bars = $resetEnergyBars(energy_bars);
	energySquares = $resetEnergySquares(energySquares, energy_bars);
	$resetWeaponExchangeStatus(weapons, squares);
	$hideWeaponUnderPieces(pieces, weapons, "end");
	$resetBoard(pieces, squares, energySquares);
	if (battleFlag === false && zapFlag === 0){$testForNoMove(pieces, squares, turnFlag);}
	$drawSideBarInfo(turnFlag);
	if (gameEnd === false){zapFlag = $checkPieceEnergyBar(pieces, energySquares);}
	if (zapFlag !== 0){noHighlight();zapSfx.play();}
	if (battleFlag === true && zapFlag === 0){$cyborgBattle(pieces, weapons, turnFlag);}
	animationFlags.drawBoard = true;
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

//canvas requestanimation callback routine 
function drawGame(timestamp){
	animateHighlight(timestamp);
	animatePiece(timestamp);
	redrawBoard();
	$copyBoardToAnimationBuffer();
	animateLaserBars(timestamp);
	//animateWeapons
	cvsWeaponAnimation.animateAttribute(timestamp, "ease-in-out", true);animationFlags.isAnimating = true;
	animateWeapons(timestamp);
	$drawWeapons(weapon_img, weapons, cvsWeaponAnimation.current);
	$drawEnergyBars(laser_img, energySquares, cvsLaserOpacity.current);	
	$drawHighlight(board_img[4], mslocation.x, mslocation.y, cvs2Opacity.current);
	//draw pieces last so on top
	if (movePieceNumber !== 32){
		$drawPieceAnimations(piece_img[pieces[movePieceNumber].piece], pieces[movePieceNumber], cvsMoveScale);
	}
	if ((zapFlag === 1 || zapFlag === 2) && gameEnd === false){
		$drawZapAnimations(piece_img[pieces[zapFlag-1].piece], pieces[zapFlag-1], cvsMoveScale, cvsZapAnimation);
	}
	if (zapFlag === 3 && gameEnd === false){
		$drawZapAnimations(piece_img[pieces[0].piece], pieces[0], cvsMoveScale, cvsZapAnimation);
		$drawZapAnimations(piece_img[pieces[1].piece], pieces[1], cvsMoveScale, cvsZapAnimation);
	}
	$drawCanvas();
	//callback if animations are still going
	if (animationFlags.isAnimating === true){requestAnimationFrame(drawGame);}
}

//redraws the board and floats the piece down to board canvas
function redrawBoard(){
	if (animationFlags.drawPieces === true || animationFlags.drawBoard === true){
		$drawBoard(squares, board_img, boardSize, selectionLocation, selectionFlag);
		$drawPieces(pieces, piece_img, movePieceNumber, zapFlag);
		animationFlags.drawBoard = false;
		animationFlags.drawPieces = false;
	}
}

//draws the sidebar using JQUERY and DOM manipulations
function drawSideBarInfo(turnFlag){
	if (weapons[pieces[0].weapon].bonusDamage > 0){$(".weapon-text:eq(0)").html("<p>Damage<br>" + weapons[pieces[0].weapon].damage + " to " + (weapons[pieces[0].weapon].bonusDamage+weapons[pieces[0].weapon].damage) + "</p>");}
	else {$(".weapon-text:eq(0)").html("<p>Damage<br>" + weapons[pieces[0].weapon].damage + "</p>");}

	if (weapons[pieces[1].weapon].bonusDamage > 0){$(".weapon-text:eq(1)").html("<p>Damage<br>" + weapons[pieces[1].weapon].damage + " to " + (weapons[pieces[1].weapon].bonusDamage+weapons[pieces[1].weapon].damage) + "</p>");}
	else {$(".weapon-text:eq(1)").html("<p>Damage<br>" + weapons[pieces[1].weapon].damage + "</p>");}

	$(".panel-weapon-img:eq(0)>img").attr("src", weapon_img[pieces[0].weapon].src);
	$(".panel-weapon-img:eq(1)>img").attr("src", weapon_img[pieces[1].weapon].src);
	
	if ($(".life-bar:eq(0)").height() > $(".life-bar:eq(0)").width()){
		$(".life-percent-bar:eq(0)").css({height: (100-pieces[0].life) + "%"});
		$(".life-percent-bar:eq(1)").css({height: (100-pieces[1].life) + "%"});
		$(".life-percent-bar:eq(0)").css({width: "100%"});
		$(".life-percent-bar:eq(1)").css({width: "100%"});
	}else{
		$(".life-percent-bar:eq(0)").css({width: (100-pieces[0].life) + "%"});
		$(".life-percent-bar:eq(1)").css({width: (100-pieces[1].life) + "%"});
		$(".life-percent-bar:eq(0)").css({height: "100%"});
		$(".life-percent-bar:eq(1)").css({height: "100%"});
	} 
	if (turnFlag === "white"){
		$(".panel-turn:eq(0)").css({"border": "3px #af3 solid", "box-shadow" :"0 0 20px #af3"});
		$(".panel-turn:eq(1)").css({"border": "3px #333 solid", "box-shadow" :"0 0 0 #af3"});
	}
	if (turnFlag === "black"){
		$(".panel-turn:eq(0)").css({"border": "3px #333 solid", "box-shadow" :"0 0 0 #af3"});
		$(".panel-turn:eq(1)").css({"border": "3px #af3 solid", "box-shadow" :"0 0 20px #af3"});
	}
}

//ANIMATION ROUTINES

//handles the timestamp animation of a piece
function animatePiece(timestamp){
	var playerIndex;

	if (movePieceNumber !== 32){    
		animationFlags.isAnimating = true;  
		if (cvsMoveScale.targetV !== 1){
			cvsMoveScale.animateAttribute(timestamp, "ease-out");
			if (cvsMoveScale.percentDone === 1){cvsMoveScale.setAttribute(2, 1, 490);}
		}
		else {cvsMoveScale.animateAttribute(timestamp, "ease-in");}
		cvs3PieceMoveY.animateAttribute(timestamp, "ease-in-out");
		cvs3PieceMoveX.animateAttribute(timestamp, "ease-in-out");
		pieces[movePieceNumber].centreX = cvs3PieceMoveX.current;
		pieces[movePieceNumber].centreY = cvs3PieceMoveY.current;
		if (cvs3PieceMoveX.percentDone === 1 && cvs3PieceMoveY.percentDone === 1){resetPiece(timestamp);}
	}
	if (zapFlag !== 0 && gameEnd === false){
		cvsZapAnimation.animateAttribute(timestamp, "ease-in-out");
		if (cvsZapAnimation.percentDone === 1){
			gameEnd = true;
			if (zapFlag === 3){playerIndex = 3}
			else {playerIndex = (1-(zapFlag-1))+1;} 
			$gameOver(playerIndex, "YOU WERE FRIED");
		}
	}
}


function animateHighlight(timestamp){
	if (cvs2Opacity.percentDone !== 1){ 
		animationFlags.isAnimating = true;
		cvs2Opacity.animateAttribute(timestamp, "ease-in-out");
	}else{
		animationFlags.isAnimating = false;
	}
}


function animateLaserBars(timestamp){
	var i,barActive;

	barActive = false;
	for (i=0;i<energy_bars.length;i++){
		if (energy_bars[i].active === true){barActive = true;}
	}
	if (barActive === true){
		animationFlags.isAnimating = true;
		cvsLaserOpacity.animateAttribute(timestamp,"linear", true);
	}	
}


function animateWeapons(timestamp){
	var i;

	i = 0;
	while (i<weaponMoveArray.length){
		if (weapons[weaponMoveArray[i].weaponNumber].exchange === 1){
			weapons[weaponMoveArray[i].weaponNumber].scale.animateAttribute(timestamp, "linear", 0, 0);
			if (weapons[weaponMoveArray[i].weaponNumber].scale.percentDone === 1){
				weapons[weaponMoveArray[i].weaponNumber].exchange = 0;
				weapons[weaponMoveArray[i].weaponNumber].isTaken = true;
				$weaponExchange(weapons, weaponExchangeArray);
			}
		}
		i++;
	}
	i=0;
	while (i<weaponExchangeArray.length){
		if (weapons[weaponExchangeArray[i].weaponNumber].exchange === 2){
			weapons[weaponExchangeArray[i].weaponNumber].scale.animateAttribute(timestamp, "linear", 0, 0);
			if (weapons[weaponExchangeArray[i].weaponNumber].scale.percentDone === 1){weapons[weaponExchangeArray[i].weaponNumber].exchange = 0;}
		}
		i++;
	}
}

//SELECTION DISPLAY AND RESET 

//display the moves of the selected piece on the board
function displayPieceMoves(p){
	var i;
	var numberOfMoves;

	numberOfMoves = pieces[p].moves.length;
	for (i=0; i < numberOfMoves; i++){
		squares [pieces[p].moves[i].x][pieces[p].moves[i].y].piece = pieces[p].moves[i].moveType;
	}
}

//Resets the squares to 32 (normal squares no selections) 
function resetSelection(){
	var y,x,i;

	for (y=0;y < squares.length; y++){
		for (x=0;x < squares.length; x++){
			if (squares[x][y].tile === 1 || squares[x][y].tile === 2){squares[x][y].piece = 32;}
			if (squares[x][y].tile === 3){squares[x][y].piece = 50;}
		}
	}
	for (i=0;i<pieces.length;i++){
		if (pieces[i].isTaken === false){squares[pieces[i].x][pieces[i].y].piece = i;}
	}
}

//Sets the animation for moving a piece and resets the board //////////////////
function movePiece(){
	movePieceNumber = last_selected;
	pieces[movePieceNumber].x = selectionLocation.x;
	pieces[movePieceNumber].y = selectionLocation.y;
	//reset selection pieces - 32 is the number of piece to use for no piece
	squares[pieces[movePieceNumber].x][pieces[movePieceNumber].y].piece = 32;
	cvs3PieceMoveX.setAttribute(pieces[movePieceNumber].centreX, $setXYToScreenXY(selectionLocation.x), 1000);
	cvs3PieceMoveY.setAttribute(pieces[movePieceNumber].centreY, $setXYToScreenXY(selectionLocation.y), 1000);
	last_selected = 32;
	selection = 32;
	resetSelection();
	animate();
}

//end of IIFE  
})(window);

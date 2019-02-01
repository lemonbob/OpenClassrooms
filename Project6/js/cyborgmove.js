//CALCULATING MOVES javascript unit IIFE for CYBORG ARENA//
(function (global){
//PUBLIC
global.$resetBoard = resetBoard;
global.$checkMoveOverWeapons = checkMoveOverWeapons;
global.$weaponExchange = weaponExchange;
global.$weaponRemove = weaponRemove;
global.$hideWeaponUnderPieces = hideWeaponUnderPieces;
global.$showWeaponUnderPiece = showWeaponUnderPiece;
global.$checkPieceEnergyBar = checkPieceEnergyBar;

//PRIVATE

//IMPLEMENTATION

function resetBoard(pieces, squares, energySquares){
	var y,x,i;

	for (y=0;y < squares.length; y++){
		for (x=0;x < squares.length; x++){
			if (squares[x][y].tile === 1 || squares[x][y].tile === 2){squares[x][y].piece = 32;}
			if (squares[x][y].tile === 3){squares[x][y].piece = 50;}
			squares[x][y].weapons = 32;
			squares[x][y].whiteMoveMap = 0;
			squares[x][y].blackMoveMap = 0;
			squares[x][y].moveMap = 0;
		}
	}

	for (i=0;i<pieces.length;i++){
		if (pieces[i].isTaken === false){
			squares[pieces[i].x][pieces[i].y].piece = i;
			pieces[i].moves = [];
		}
	}
    //calculate all the moves in cyborbmove.js 
    calcAllMoves(pieces, squares, energySquares);
}


function calcAllMoves(pieces, squares, energySquares){
	var i;

	for (i=0;i<pieces.length;i++){
		calcPlayerMoves(i,0, pieces, squares, energySquares);
	}	
}

//calculate moves - 1 to 3 squares in up/down/left/right direction
function calcPlayerMoves(p, movecount, pieces, squares, energySquares){
	var MoveInDirection, lastmove, i;
	
	i = 1;
	MoveInDirection = true;
	while (pieces[p].x+i < squares.length && MoveInDirection === true && i<=3){
		lastmove = movecount;
		movecount = testSquareForMove(pieces[p].x+i, pieces[p].y, p, movecount, pieces, squares, energySquares);
		if (lastmove === movecount){MoveInDirection = false;}
		else {if (pieces[p].moves[lastmove].moveType === 250){MoveInDirection = false};}
		i++;
	}
	i = 1;
	MoveInDirection = true;
	while (pieces[p].x-i >= 0 && MoveInDirection === true && i<=3){
		lastmove = movecount;
		movecount = testSquareForMove(pieces[p].x-i, pieces[p].y, p, movecount, pieces, squares, energySquares);
		if (lastmove === movecount){MoveInDirection = false;}
		else {if (pieces[p].moves[lastmove].moveType === 250){MoveInDirection = false};}
		i++
	}
	i = 1;
	MoveInDirection = true;
	while (pieces[p].y+i < squares.length && MoveInDirection === true && i<=3){
		lastmove = movecount;
		movecount = testSquareForMove(pieces[p].x, pieces[p].y+i, p, movecount, pieces, squares, energySquares);
		if (lastmove === movecount){MoveInDirection = false;}
		else {if (pieces[p].moves[lastmove].moveType === 250){MoveInDirection = false};}
		i++;
	}
	i = 1;
	MoveInDirection = true;
	while (pieces[p].y-i >= 0 && MoveInDirection === true && i<=3){
		lastmove = movecount;
		movecount = testSquareForMove(pieces[p].x, pieces[p].y-i, p, movecount, pieces, squares, energySquares);
		if (lastmove === movecount){MoveInDirection = false;}
		else {if (pieces[p].moves[lastmove].moveType === 250){MoveInDirection = false};}
		i++;
	}
}

//make sure a square is free i.e code 32
function testSquareForMove(x, y, p, count, pieces, squares, energySquares){
	if (x >= 0 && y >= 0 && x < squares.length && y < squares.length){
		//normal move
		if (squares[x][y].piece === 32 && energySquares[x][y] === 0){
			if (testForBattleMove(x, y, p, squares)){
				pieces[p].moves[count] = {x:x, y:y, moveType:250};
			}else{
				pieces[p].moves[count] = {x:x, y:y, moveType:200};
			}
			count++
		}
	}
	return count;
}

//if piece passes adjacent opposition piece, battle will commence
function testForBattleMove(x, y, p, squares){
	var testpiece;

	if (p === 0){testpiece = 1;}else{testpiece = 0}
	if ((x+1) < squares.length && squares[x+1][y].piece === testpiece){return true;}else
	if ((x-1) >= 0 && squares[x-1][y].piece === testpiece){return true;}else
	if ((y+1) < squares.length && squares[x][y+1].piece === testpiece){return true;}else
	if ((y-1) >= 0 && squares[x][y-1].piece === testpiece){return true;}else
	{return false;}
}

function checkMoveOverWeapons(piece, squares, weapons, selectionX, selectionY){
	var i, count, testSquare;
	var weaponMoveArray = [];

	count = 0;
	if (selectionX !== piece.x){
		if (selectionX - piece.x > 0){
			for (i = 1;i<=selectionX - piece.x;i++){
				weaponNumber = testWeaponOnSquare(weapons, piece.x+i, piece.y);
				if (weaponNumber !== false){weaponMoveArray[count] = {weaponNumber: weaponNumber, distance: i};count++}
			}  
		}else{
			for (i = 1;i<=piece.x - selectionX;i++){
				weaponNumber = testWeaponOnSquare(weapons, piece.x-i, piece.y);
				if (weaponNumber !== false){weaponMoveArray[count] = {weaponNumber: weaponNumber, distance: i};count++}
			} 
		}
	}else{
		if (selectionY - piece.y > 0){
			for (i = 1;i<=selectionY - piece.y;i++){
				weaponNumber = testWeaponOnSquare(weapons, piece.x, piece.y+i);
				if (weaponNumber !== false){weaponMoveArray[count] = {weaponNumber: weaponNumber, distance: i};count++}
			}  
		}else{
			for (i = 1;i<=piece.y - selectionY;i++){
				weaponNumber = testWeaponOnSquare(weapons, piece.x, piece.y-i);
				if (weaponNumber !== false){weaponMoveArray[count] = {weaponNumber: weaponNumber, distance: i};count++}
			} 
		}
	}
	return weaponMoveArray;
}


function testWeaponOnSquare(weapons, x, y){
	var i;

	for (i=0;i<weapons.length;i++){
		if (weapons[i].x === x && weapons[i].y === y && weapons[i].isTaken === false){return i}
	} 
return false;
}

/*example of simple switch function but no animations would be possible
function weaponExchange(weapons, weaponMoveArray, piece){
	var i;
	for (i=0;i<weaponMoveArray.length;i++){
		weapons[weaponMoveArray[i].weaponNumber].isTaken = true;
		weapons[piece.weapon].isTaken = false;
		weapons[piece.weapon].x = weapons[weaponMoveArray[i].weaponNumber].x;
		weapons[piece.weapon].y = weapons[weaponMoveArray[i].weaponNumber].y;
		piece.weapon = weaponMoveArray[i].weaponNumber;
	}
	$setObjectScreenXY(weapons);
}
*/
//weapon switching routines on Move over weapon. 
//set up a removal array on board click for speed and accuracy rather than attempt on the fly
function weaponRemove(weapons, weaponMoveArray, piece){
	var i, weaponExchangeArray;
	
	weaponExchangeArray = [];
	for (i=0;i<weaponMoveArray.length;i++){
		weapons[weaponMoveArray[i].weaponNumber].exchange = 1;
		//set up a new switching array to exchange weapons, need this as the switch can't be done until animation for removing weapon has finished
		weaponExchangeArray[i] = {weaponNumber: piece.weapon, x: weapons[weaponMoveArray[i].weaponNumber].x, y: weapons[weaponMoveArray[i].weaponNumber].y};
		piece.weapon = weaponMoveArray[i].weaponNumber;
	}
	return weaponExchangeArray;
}

//exchanging function that occurs only once the animation of removing weapons have been completed
function weaponExchange(weapons, weaponExchangeArray){
	var i;
	for (i=0;i<weaponExchangeArray.length;i++){
		weapons[weaponExchangeArray[i].weaponNumber].exchange = 2;
		weapons[weaponExchangeArray[i].weaponNumber].x = weaponExchangeArray[i].x;
		weapons[weaponExchangeArray[i].weaponNumber].y = weaponExchangeArray[i].y;
		weapons[weaponExchangeArray[i].weaponNumber].isTaken = false;
		weapons[weaponExchangeArray[i].weaponNumber].scale.setAttribute(0.1,1,490);
	}
	$setObjectScreenXY(weapons);
}

//hides a weapon if a piece lands on top
function hideWeaponUnderPieces(pieces, weapons){
	var i;
	
	for (i=0;i<weapons.length;i++){
		if (pieces[0].x === weapons[i].x && pieces[0].y === weapons[i].y){weapons[i].underPiece = true;}
		if (pieces[1].x === weapons[i].x && pieces[1].y === weapons[i].y){weapons[i].underPiece = true;}
	}   
}

//shows the weapon once a player moves off square with weapon on it
function showWeaponUnderPiece(piece, weapons){
	for (i=0;i<weapons.length;i++){
		if (piece.x === weapons[i].x && piece.y === weapons[i].y){weapons[i].underPiece = false;}
	}   
}

function checkPieceEnergyBar(pieces, energySquares){
	var x,y,returnCode;

	returnCode = 0;
	x = pieces[0].x;
	y = pieces[0].y;
	if (energySquares[x][y] !== 0){returnCode += 1;}
	x = pieces[1].x;
	y = pieces[1].y;
	if (energySquares[x][y] !== 0){returnCode += 2;}
	console.log(returnCode);
	return returnCode;
}

})(window);

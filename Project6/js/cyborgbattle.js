(function(global){


//PUBLIC
global.$cyborgBattle = cyborgBattle;
global.$gameOver = gameOver;

//PRIVATE
var playerTurn;


//IMPLEMENTATION

function cyborgBattle(pieces, weapons, turnFlag){
	playerTurn = turnFlag;

	//$("#board_area").css("pointer-events","none");
	$("#battleZone").show(1000);
	if (turnFlag === "white"){
		$(".battle-buttons:even").addClass("bb-active");
	}else{
		$(".battle-buttons:odd").addClass("bb-active");
	}
	$(".battle-buttons:lt(2)").on("click",function(){playerAttack(pieces, weapons);});
	$(".battle-buttons:gt(1)").on("click",function(){playerDefend(pieces);});
}

function playerAttack(pieces, weapons){
	var damageDone,pIndex;

	if (playerTurn === "white"){pIndex = 0}else{pIndex = 1}
		damageDone = calcWeaponDamage(weapons[pieces[pIndex].weapon]);
	if (pieces[1-pIndex].isDefending === true){damageDone = Math.round(damageDone/2);}
	pieces[1-pIndex].life -= damageDone;
	if (pieces[1-pIndex].life < 1){pieces[1-pIndex].life = 0;gameOver(pIndex+1, "GAME OVER");}
	else{
		$("#gameMessage").text(damageDone.toString());
		$("#gameMessage").show(300, function(){$("#gameMessage").fadeOut(500);});
	}
	pieces[pIndex].isDefending = false;
	pieces[1-pIndex].isDefending = false;
	$(".battle-panel:eq(" + pIndex + ")").css({"filter":"drop-shadow(0 0 0px #000)"}); 
	$(".battle-panel:eq(" + (1-pIndex) + ")").css({"filter":"drop-shadow(0 0 0px #000)"});
	setTimeout(function(){switchActiveButtons();},500);
}

function playerDefend(pieces){
	var pIndex;

	if (playerTurn === "white"){pIndex = 0}else{pIndex = 1}
		pieces[pIndex].isDefending = true;
	$(".battle-panel:eq(" + pIndex + ")").css({"filter":"drop-shadow(0 0 10px #00f)"}); 
	$(".battle-panel:eq(" + (1-pIndex) + ")").css({"filter":"drop-shadow(0 0 0 #000)"}); 
	switchActiveButtons();
}

function switchActiveButtons(){
	if (playerTurn === "white"){
		$(".battle-buttons:even").removeClass("bb-active");
		$(".battle-buttons:odd").addClass("bb-active");
		playerTurn = "black"
		$drawSideBarInfo(playerTurn);
	}else{
		$(".battle-buttons:odd").removeClass("bb-active");
		$(".battle-buttons:even").addClass("bb-active");
		playerTurn = "white"
		$drawSideBarInfo(playerTurn);
	}
}

function calcWeaponDamage(weapon){
	var damage;

	damage = Math.round(Math.random()*weapon.bonusDamage);
	damage += weapon.damage;
	return damage;
}

function gameOver(playerIndex, message){
	$(".battle-buttons").css({"pointer-events":"none"});
	$(".battle-buttons:lt(2)").off("click");
	$(".battle-buttons:gt(1)").off("click");

	$("#gameMessage").html(message);
	$("#gameMessage").show(1000, function(){setTimeout(function(){playerWon(playerIndex);},1000);});
	$("#battleZone").hide(2000);
};

function playerWon(playerIndex){
	if (playerIndex < 3){
		$("#gameMessage").hide(500, function(){
			$("#gameMessage").html("<p>Player " + playerIndex + " wins</p><button id='playAgain'>Play Again</button>");
			$("#gameMessage").show(500);
			$("#playAgain").on("click", restartGame);
		});
	}else{
		$("#gameMessage").hide(500, function(){
			$("#gameMessage").html("<p>DRAW</p><button id='playAgain'>Play Again</button>");
			$("#gameMessage").show(500);
			$("#playAgain").on("click", restartGame);
		});
	}
}

function restartGame(){
	themeSfx.currentTime = 0;
	$("#gameMessage").hide(500);
	$("#gameWrapper").animate({opacity:0},500);
	$("#blackOverlay").fadeIn(1000, function(){
		$loadTitles();
		$displayTitleOptions();
	});
}

})(window);
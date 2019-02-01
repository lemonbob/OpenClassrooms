//title.js control code for title page and loader for main game
(function(global){
	//PUBLIC

	global.$displayTitleOptions = displayTitleOptions;	

	//PRIVATE

	var scriptToLoad = ["js/drawgame.js", "js/boardsetup.js", "js/cyborgmove.js", "js/cyborgbattle.js", "js/cyborgarena.js"]
	var scriptIndex = 0;

	//IMPLEMENTATION
	
	//displayTitleOptions();
	

	function displayTitleOptions(){
		//themeSfx.currentTime = 0;
		themeSfx.play();
		setTimeout(function(){
			$(".play-button:lt(3)").show(1000);
			$(".play-button:eq(0)").on("click", hideTitle);
			$(".play-button:eq(1)").on("click", showInstructions);
			$(".play-button:eq(3)").on("click", hideInstructions);
		},10000);
	}

		
	function showInstructions(){
		$(".play-button:lt(3)").hide(1000,function(){
			$(".play-button:eq(3)").show(1000);
			$("#instructions").show(1000);
		})
	}

	function hideInstructions(){
		$(".play-button:eq(3)").hide(1000);
		$("#instructions").hide(1000, function(){$(".play-button:lt(3)").show(1000)});
	}


	function hideTitle(){
		//$(".play-button:eq(0)").off("click");
		//$(".play-button:eq(1)").off("click");
		//$(".play-button:eq(3)").off("click");
		$("#cyborgGame").animate({opacity:0}, 1000, loadGame);  
	}


	function loadGame(){
		themeSfx.pause();
		$("#blackOverlay").fadeOut(1000, function(){
			$("#cyborgGame").load("gamecode.html", loadScripts);
		});
	}

	//callback to make sure scripts are loaded in order and not loaded again if game is reset
	function loadScripts(){
		if (scriptIndex<scriptToLoad.length){	
			$.getScript(scriptToLoad[scriptIndex], loadScripts);	
			scriptIndex++
		}else{
			$loadGameFiles();
		}
	}
})(window);
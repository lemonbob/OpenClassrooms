//title.js control code for title page and loader for main game
(function(global){
	//PUBLIC

	global.$displayTitleOptions = displayTitleOptions;	

	//PRIVATE

	var scriptToLoad = ["js/drawgame.js", "js/boardsetup.js", "js/cyborgmove.js", "js/cyborgbattle.js", "js/cyborgarena.js"]
	var scriptIndex = 0;
	var lastShownDiv;

	//IMPLEMENTATION
	
	function displayTitleOptions(){
		$hideLoadingDiv();
		setTimeout(function(){
			$(".play-button:lt(3)").show(1000);
			$(".play-button:eq(0)").on("click", hideTitle);
			$(".play-button:eq(1)").on("click", function(){showMenuDiv(".instructions:eq(0)");});
			$(".play-button:eq(2)").on("click", function(){showMenuDiv(".instructions:eq(1)");});
			$(".play-button:eq(3)").on("click", hideMenuDiv);
			$("input[name=boardtype]").on("change", changeFormFocus);
		},10000);
	}

		
	function showMenuDiv(divtoshow){
		lastShownDiv = divtoshow;
		$(".play-button:lt(3)").hide(1000,function(){
			$(".play-button:eq(3)").show(1000);
			$(divtoshow).show(1000);
		})
	}

	function hideMenuDiv(){
		$(".play-button:eq(3)").hide(1000);
		$(lastShownDiv).hide(1000, function(){$(".play-button:lt(3)").show(1000)});
	}


	function hideTitle(){
		decodeFormData();
		$(".play-button").off("click");
		$("input[name=boardtype]").off("change");
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
		$showLoadingDiv();
		if (scriptIndex<scriptToLoad.length){	
			$.getScript(scriptToLoad[scriptIndex], loadScripts);	
			scriptIndex++
		}else{
		$loadGameFiles();
		}
	}

	function changeFormFocus(){
		var boardType;

		boardType = $("input[name=boardtype]:checked").val();
		if (boardType === "pre-defined"){
			$("input[name=boardnumber]").prop("disabled", false);
			$("input[name=boardsize]").prop("disabled", true);
			$("input[name=beamgenerators]").prop("disabled", true);
			$(".instructions legend:eq(1)").removeClass("legend-disabled");
			$(".instructions legend:gt(1)").addClass("legend-disabled");
			$(".instructions fieldset:eq(1)").removeClass("fieldset-disabled");
			$(".instructions fieldset:gt(1)").addClass("fieldset-disabled");
		}else{
			$("input[name=boardnumber]").prop("disabled", true);
			$("input[name=boardsize]").prop("disabled", false);
			$("input[name=beamgenerators]").prop("disabled", false);
			$(".instructions legend:eq(1)").addClass("legend-disabled");
			$(".instructions legend:gt(1)").removeClass("legend-disabled");
			$(".instructions fieldset:eq(1)").addClass("fieldset-disabled");
			$(".instructions fieldset:gt(1)").removeClass("fieldset-disabled");
		}
	}
	
	function decodeFormData(){
		formSettingsData.boardType = $("input[name=boardtype]:checked").val();
		formSettingsData.boardNumber = $("input[name=boardnumber]:checked").val();
		formSettingsData.boardSize = $("input[name=boardsize]:checked").val();
		formSettingsData.beamGenerators = $("input[name=beamgenerators]:checked").val();
	}

})(window);
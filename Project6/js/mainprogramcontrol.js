//mainprogram js 

(function(global){

	//PUBLIC

	global.$loadTitles = loadTitles;
	global.$showLoadingDiv = showLoadingDiv;
	global.$hideLoadingDiv = hideLoadingDiv;

	//PRIVATE

	var scriptToLoad = ["js/title.js"];
	var scriptIndex = 0;
	var canPlayThroughActive = true;

	//IMPLEMENTATION

	$(window).on("load", waitForEnter);

	//all sounds must be individually loaded after a click event to allow Safari 11+ to play sounds
	function waitForEnter(){
		canPlayThroughActive = true;
		$(window).off("load");
		$("#enterScreen").on("click", soundInitilalization);
	}


	//initialize sound with a slient play after click, wait until theme music is loaded before loading title screen
	function soundInitilalization(){
		themeSfx.load();
		moveSfx.load();
		zapSfx.load();
		shieldSfx.load();
		pistolSfx.load();
		uziSfx.load();
		rifleSfx.load();
		grenadeSfx.load();
		laserSfx.load();
		hastalavistaSfx.load();
		if (themeSfx.readystate > 3){loadTitles();}
		else{themeSfx.oncanplaythrough = loadTitles;}
		$("#enterScreen").off("click");
		$("#enterScreen").hide();
	}

	//load the title screen, show the loading wheel so users know it is loading
	function loadTitles(){
		if (canPlayThroughActive === true){themeSfx.oncanplaythrough = null;canPlayThroughActive = false;}
		themeSfx.currentTime = 0;
		themeSfx.play();
		showLoadingDiv();
		$("#cyborgGame").load("titlescode.html", loadScripts);
	}

	//wait until scripts have loaded to start titles, wait until theme music is ready 
	function loadScripts(){
		if (scriptIndex<scriptToLoad.length){	
			$.getScript(scriptToLoad[scriptIndex], loadScripts);
			scriptIndex++	
		}else{
			$displayTitleOptions();
		}
	}

	//show and hide loading wheel functions
	function showLoadingDiv(){
		$("#loading").show();
	}

	function hideLoadingDiv(){
		$("#loading").hide();
	}
/*
	function checkAutoplay(){
		var promise = themeSfx.play();
		if (promise !== undefined) {
			promise.then(_ => {
				loadTitles();
			}).catch(error => {
				console.log("error");
   		// Autoplay was prevented.
   		// Show a "Play" button so that user can start playback.
   	});
		}
	}
*/

})(window);
var themeSfx = document.createElement("audio");
var moveSfx = document.createElement("audio");
themeSfx.autoplay = false;

(function(global){

	//PUBLIC

	global.$loadTitles = loadTitles;
	
	//PRIVATE

	var scriptToLoad = ["js/title.js"];
	var scriptIndex = 0;

	//IMPLEMENTATION
	$(window).on("load", loadTitles);

	themeSfx.oncanplaythrough = loadTheme;
	themeSfx.src = "sound/cyborgtheme.mp3";
	moveSfx.src = "sound/move.mp3";

	function loadTitles(){
		$("#cyborgGame").load("titlescode.html", "data", loadScripts);
	}

	function loadScripts(){
		if (scriptIndex<scriptToLoad.length){	
			$.getScript(scriptToLoad[scriptIndex], loadScripts);	
			scriptIndex++
		}else{
			if (themeSfx.readyState === 4){$displayTitleOptions();}
			//$displayTitleOptions();
		}
	}

	function loadTheme(){
		if (scriptIndex === scriptToLoad.length){$displayTitleOptions();}
	}

})(window);
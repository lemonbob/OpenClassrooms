//control.js - event and program control unit 
//var used rather than ES6 const/let because const only has 84% support at present
//all units are immediate invoked function expressions to ensure that variable are 
//private and not confused if units have the same variable nomenclature

(function(){

	var controlKnobs = document.getElementsByClassName("knob-image");
	var eventController = document.getElementsByClassName("event-controller");
	var button = document.getElementById("button");
	var quoteInput = document.getElementById("quoteInput");
	var outputWindow = document.getElementById("outputWindow");
	var imgDefault = document.getElementsByTagName("img");
	var mouseDownFlag = false;
	var touchEventFlag = false;
	var mouseXPosition = 0;
	var seed = "wisdom";
	var controlNum;
	var i;
	var controlAttributes = [];
	controlAttributes[0] = {};
	controlAttributes[1] = {};
	controlAttributes[2] = {};

	controlAttributes[0].location = 1;
	controlAttributes[0].minlocation = 1;
	controlAttributes[0].maxlocation = 5;
	controlAttributes[0].angle = (-135);
	controlAttributes[0].increment = 70;
	controlAttributes[0].angIncrement = 67.5;


	controlAttributes[1].location = 0;
	controlAttributes[1].minlocation = 0;
	controlAttributes[1].maxlocation = 1;
	controlAttributes[1].angle = 0;
	controlAttributes[1].increment = 70;
	controlAttributes[1].angIncrement = 1;

	controlAttributes[2].location = 50;
	controlAttributes[2].minlocation = 1;
	controlAttributes[2].maxlocation = 100;
	controlAttributes[2].angle = 0;
	controlAttributes[2].increment = 2;
	controlAttributes[2].angIncrement = 270/(controlAttributes[2].maxlocation-1);

	controlKnobs[0].style.transform = "rotate(" + controlAttributes[0].angle + "deg)";
	controlKnobs[2].style.transform = "rotate(" + controlAttributes[2].angle + "deg)";

	//end of variables and objects

	//stop default drag behaviour of images
	for (i=0;i<imgDefault.length;i++){
		imgDefault[i].style.pointerEvents = "none";
		//imgDefault[i].draggable = false;
		//imgDefault[i].addEventListener("mousedown", function(e){e.preventDefault();});
	}

	//add Event Listeners

	//determine if browser supports passive event handler in supportsPassive?? query
	var supportsPassive = false;
	try {
		var opts = Object.defineProperty({}, 'passive', {
			get: function() {
				supportsPassive = true;
			}
		});
		window.addEventListener("testPassive", null, opts);
		window.removeEventListener("testPassive", null, opts);
	}catch(e){}	
	//add Event Listeners
	
	for(i = 0;i<eventController.length;i++){
		addClosureEvent(eventController,i,"mousedown");
		addClosureEvent(eventController,i,"touchstart");
		addClosureEvent(eventController,i,"touchmove");
		addClosureEvent(eventController,i,"mousemove");
	}
	
	quoteInput.addEventListener("keydown", function(e){
		if(e.keycode === 13 || e.which === 13){quoteInputEnter();}
	});		
	button.addEventListener("touchstart",function(){button.style.transform = "scale(1,1)";button.style.boxShadow = "0px 0px 20px #000";}, supportsPassive ? { passive: true } : false);
	button.addEventListener("touchend",function(e){e.preventDefault();button.style.transform = "scale(1.1,1.1)";button.style.boxShadow = "5px 5px 20px #000";quoteButtonClick();}, supportsPassive ? { passive: false } : false);
	button.addEventListener("mousedown",function(){button.style.transform = "scale(1,1)";button.style.boxShadow = "0px 0px 20px #000";});
	button.addEventListener("mouseup",function(e){e.preventDefault();button.style.transform = "scale(1.1,1.1)";button.style.boxShadow = "5px 5px 20px #000";quoteButtonClick();});
	//button.addEventListener("click",function(){quoteButtonClick();});
	document.addEventListener("dblclick",function(e){e.preventDefault();});
	//document.addEventListener("touchmove",function(e){changeKnobPosition(e,controlNum);});
	//document.addEventListener("mousemove",function(e){changeKnobPosition(e,controlNum);});
	document.addEventListener("touchend",function(){resetPointerStatus();});
	document.addEventListener("mouseup",function(){resetPointerStatus();});

	//end of event Listeners

	function addClosureEvent(element,item,event){
		var num = item;
		var el = element; 
		var n;
		if (event === "mousedown" || event === "touchstart"){
			el[num].addEventListener(event,function(e){setMousePosition(e);controlNum = num;}, supportsPassive ? { passive: false } : false);
		}
		if (event === "touchmove" || event === "mousemove"){
			el[num].addEventListener(event,function(e){changeKnobPosition(e,num);}, supportsPassive ? { passive: false } : false);
		}
	}
	
	//Start of default styles on load 
	//(transition is better than using a keyframe animation as transitions can be better controlled)
	blurEffect();

	function blurEffect(){
		outputWindow.style.transition = "none";
		outputWindow.style.opacity = "0";
		outputWindow.style.filter = "blur(50px) drop-shadow(0px 0px 10px rgb(95,255,240))";
		//timeout require to effect reflow
		setTimeout(function(){
			outputWindow.style.transition = "opacity 1s ease-in-out, filter 1s ease-in-out";
			outputWindow.style.filter = "blur(0px) drop-shadow(0px 0px 10px rgb(95,255,240))";
			outputWindow.style.opacity = "1";
		},100);
	}
	//end of default styles

	//Touch and mouse control functions on controls//
	//On first touch or click of knob, get the screen position of pointer
	function setMousePosition(event){
		var touch;

		//event.preventDefault();
		if (event.type === "touchstart"){
			mouseDownFlag = true;
			if (event.targetTouches.length == 1) {
				var touch = event.targetTouches[0];
				mouseXPosition = touch.clientX;
			}
		}
		
		if (mouseDownFlag === false){
			mouseDownFlag = true;
			mouseXPosition = event.clientX;
		}
	}

	//On touchend or mouseup, reset the swipe flag used for controlling swipe functionality
	function resetPointerStatus(index){
		touchEventFlag = false;
		mouseDownFlag = false;
	}

	//If pointer status is true (or active) use horizontal swipe or mouse drag to change control knob location
	function changeKnobPosition(event, index){
		var incLocation, newLocation, touch;

		if (mouseDownFlag === true){
			event.preventDefault();
			if (event.targetTouches !== undefined){

				if (event.targetTouches.length == 1) {
					touch = event.targetTouches[0];
					touch = touch.clientX;
				}
			}else{
				touch = event.clientX;
			}	
			incLocation = Math.round((touch - mouseXPosition)/controlAttributes[index].increment);
			newLocation = controlAttributes[index].location + incLocation;
			if (newLocation > controlAttributes[index].maxlocation){newLocation = controlAttributes[index].maxlocation;incLocation = 0;}
			if (newLocation < controlAttributes[index].minlocation){newLocation = controlAttributes[index].minlocation;incLocation = 0;} 
			//Only modify the DOM if there is a change in position as DOM modification is costly
			if (newLocation !== controlAttributes[index].location){
				controlAttributes[index].location = newLocation;
				//reset the mouse base position for next mousemove/touchmove event
				mouseXPosition = touch;
				if (index === 1){
					controlAttributes[index].angle = (controlAttributes[index].location*37.6)+17;
					controlKnobs[index].style.left = (controlAttributes[index].angle) + "%";	
				}else{
					controlAttributes[index].angle = ((controlAttributes[index].location-1)*controlAttributes[index].angIncrement)-135;
					controlKnobs[index].style.transform = "rotate(" + controlAttributes[index].angle + "deg)";
				}
			}
		}
	}

	//If button is clicked start the simple or advanced version of the quote engine
	function quoteButtonClick(){
		blurEffect();
		if (controlAttributes[1].location === 0){
			$getSimpleQuote(controlAttributes[0].location,outputWindow);
		}
		if (controlAttributes[1].location === 1){
			seed = document.getElementById("quoteInput").value;
			$getAdvancedQuote(controlAttributes[2].location,outputWindow,seed, "sp=", 1);
		}
		/*setTimeout(function(){
			outputWindow.style.transition = "opacity 1s ease-in-out, filter 1s ease-in-out";
			outputWindow.style.filter = "blur(0px) drop-shadow(0px 0px 10px rgb(95,255,240))";
			outputWindow.style.opacity = "1";
		},100);*/
	}

	function quoteInputEnter(){
		quoteInput.blur();
		if (controlAttributes[1].location === 1){
			quoteButtonClick();
		}
	}

	
})();
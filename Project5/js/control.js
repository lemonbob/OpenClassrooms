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
	var isActiveLight = document.getElementsByClassName("is-active-light");
	var mouseDownFlag = false;
	var touchEventFlag = false;
	var mouseXPosition = 0;
	var mouseControlNum = -1;
	var seed;
	var controlNum;
	var i;
	var controlAttributes = [];
	
	controlAttributes[0] = {};
	controlAttributes[1] = {};
	controlAttributes[2] = {};

	controlAttributes[0].location = 1;
	controlAttributes[0].minlocation = 1;
	controlAttributes[0].maxlocation = 5;
	controlAttributes[0].centre = (controlAttributes[0].minlocation+controlAttributes[0].maxlocation)/2;
	controlAttributes[0].angle = (-135);
	controlAttributes[0].angIncrement = 67.5;
	
	controlAttributes[1].location = 0;
	controlAttributes[1].minlocation = 0;
	controlAttributes[1].maxlocation = 1;
	controlAttributes[1].centre = (controlAttributes[1].minlocation+controlAttributes[1].maxlocation)/2;
	controlAttributes[1].angle = 0;
	controlAttributes[1].angIncrement = 1;
	
	controlAttributes[2].location = 50;
	controlAttributes[2].minlocation = 1;
	controlAttributes[2].maxlocation = 49;
	controlAttributes[2].centre = (controlAttributes[2].minlocation+controlAttributes[2].maxlocation)/2;
	controlAttributes[2].angle = 0;
	controlAttributes[2].angIncrement = 270/(controlAttributes[2].maxlocation-1);
	resizeControllerSizes(eventController);
	
	controlKnobs[0].style.transform = "rotate(" + controlAttributes[0].angle + "deg)";
	controlKnobs[2].style.transform = "rotate(" + controlAttributes[2].angle + "deg)";

	//end of variables and objects

	//stop default drag behaviour of images
	for (i=0;i<imgDefault.length;i++){
		imgDefault[i].style.pointerEvents = "none";
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

	//add Event Listeners///////////////////////////////////////////////////////////
	//Controller events, this event gets the number of the controller pressed - it needs a closure to lock in variable
	for(i = 0;i<eventController.length;i++){
		addClosureEvent(eventController,i,"mousedown");
		addClosureEvent(eventController,i,"touchstart");
	}

	function addClosureEvent(element,item,event){
		var num = item;
		var el = element; 
		var n;

		if (event === "mousedown" || event === "touchstart"){
			el[num].addEventListener(event,function(e){setMousePosition(e,num);controlNum = num;}, supportsPassive ? { passive: false } : false);
		}
	}

	window.addEventListener("load", function(){setupInitialState();});
	window.addEventListener("resize", function(){resizeControllerSizes(eventController);});
	quoteInput.addEventListener("keydown", function(e){if(e.keycode === 13 || e.which === 13){quoteInputEnter();}});		
	//quoteButton events
	button.addEventListener("touchstart",function(){button.style.transform = "scale(1,1)";button.style.boxShadow = "0px 0px 20px #000";}, supportsPassive ? { passive: true } : false);
	button.addEventListener("touchend",function(e){e.preventDefault();button.style.transform = "scale(1.1,1.1)";button.style.boxShadow = "5px 5px 20px #000";quoteButtonClick();}, supportsPassive ? { passive: false } : false);
	button.addEventListener("mousedown",function(){button.style.transform = "scale(1,1)";button.style.boxShadow = "0px 0px 20px #000";});
	button.addEventListener("mouseup",function(e){e.preventDefault();button.style.transform = "scale(1.1,1.1)";button.style.boxShadow = "5px 5px 20px #000";quoteButtonClick();});
	//document events
	document.addEventListener("touchmove",function(e){changeKnobPosition(e,mouseControlNum);}, supportsPassive ? { passive: false } : false);
	document.addEventListener("mousemove",function(e){changeKnobPosition(e,mouseControlNum);});
	document.addEventListener("touchend",function(){resetPointerStatus();});
	document.addEventListener("mouseup",function(){resetPointerStatus();});

	//end of event Listeners

	//Start of default styles and sizes on load 
	//transition is better than using a keyframe animation as transitions are more controlable
	
	function setupInitialState(){
		resizeControllerSizes(eventController);
		blurEffect();
		setLights();
	}
	
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

	function setLights(){
		if (controlAttributes[1].location === 0){
			isActiveLight[0].style.background = "radial-gradient(#555, #000)";
			isActiveLight[0].style.boxShadow = "none";
			isActiveLight[1].style.background = "radial-gradient(#0f0, #040)";
			isActiveLight[1].style.boxShadow = "0px 0px 10px #0f0";
			isActiveLight[2].style.background = "radial-gradient(#555, #000)";
			isActiveLight[2].style.boxShadow = "none";
		}else{
			isActiveLight[0].style.background = "radial-gradient(#0f0, #040)";
			isActiveLight[0].style.boxShadow = "0px 0px 10px #0f0";
			isActiveLight[1].style.background = "radial-gradient(#555, #000)";
			isActiveLight[1].style.boxShadow = "none";
			isActiveLight[2].style.background = "radial-gradient(#0f0, #040)";
			isActiveLight[2].style.boxShadow = "0px 0px 10px #0f0";
		}
	}

	//get the new Client screen sizes of the controllers after resize event 
	//this is needed so we can calculte the angle to centre when touch event fires 
	function resizeControllerSizes(element){
		var index,rect;

		for (index=0;index<element.length;index++){
			rect = element[index].getBoundingClientRect();
			controlAttributes[index].centreX = rect.left + element[index].clientWidth/2 + window.pageXOffset;
			controlAttributes[index].centreY = rect.top + element[index].clientHeight/2 + window.pageYOffset;
			if (index === 0 || index === 2){controlAttributes[index].centreY += 30;}	
		}
	}

	//end of default styles

	//Touch and mouse control functions on controls//
	//On first touch or click of knob, get the screen position of pointer
	function setMousePosition(event,index){
		var touch;
		var angle;

		event.preventDefault();
		if (event.type === "touchstart"){
			touchEventFlag = true;
			if (event.targetTouches.length == 1) {
				var touch = event.targetTouches[0];
				angle = getPointerAngle(touch.pageX,touch.pageY,controlAttributes[index].centreX, controlAttributes[index].centreY);
				calculateKnobLocation(angle,index);
				mouseControlNum = index;
			}
		}
		//if the touch event has been triggered, discard any mouse event
		if (touchEventFlag === false){
			angle = getPointerAngle(event.pageX,event.pageY,controlAttributes[index].centreX, controlAttributes[index].centreY);
			calculateKnobLocation(angle,index);
			mouseDownFlag = true;
			mouseControlNum = index;
		}
	}

	//If pointer status is true (i.e. active) use horizontal swipe or mouse drag to change control knob location set by global "mouseControlNum"
	function changeKnobPosition(event,index){
		var angle, touch;
		
		//if the mouseControlNum > 0 then a controller has been pressed, this blocks window default scroll when a controller is being moved
		if (index >=0){event.preventDefault();}
		if (touchEventFlag === true){
			var touch = event.targetTouches[0];
			angle = getPointerAngle(touch.pageX,touch.pageY,controlAttributes[index].centreX, controlAttributes[index].centreY);
			calculateKnobLocation(angle,index);
		}
		if (mouseDownFlag === true){
			angle = getPointerAngle(event.pageX,event.pageY,controlAttributes[index].centreX, controlAttributes[index].centreY);
			calculateKnobLocation(angle,index);
		}
	}

	//get the pointer angle from a click on the viewport to the centre point of div
	//written as separate self conatined function as this could be useful for future projects
	function getPointerAngle(x,y,centreX,centreY){
		var dx,dy,angle;

		dx = x-centreX;
		dy = y-centreY;
		dy = -dy;
		angle=Math.abs((Math.atan(dx/dy)*57.296));
		if (dy < 0){angle = (90) + (90-angle);}
		if (dx < 0){angle = -angle;}
		return angle;
	}

	//use angle to set the location of the control knob
	function calculateKnobLocation(angle,index){
		var newLocation;

		//use the new location variable so that the DOM is not updated unless the knob position is changed
		newLocation = Math.round(angle / controlAttributes[index].angIncrement);
		newLocation = (newLocation + controlAttributes[index].centre);
		if (newLocation < controlAttributes[index].minlocation){newLocation = controlAttributes[index].minlocation;}
		if (newLocation > controlAttributes[index].maxlocation){newLocation = controlAttributes[index].maxlocation;}
		//if (controlAttributes[index].location < controlAttributes[index].minlocation){controlAttributes[index].location = controlAttributes[index].minlocation;}
		//if (controlAttributes[index].location > controlAttributes[index].maxlocation){controlAttributes[index].location = controlAttributes[index].maxlocation;}		
		if (newLocation !== controlAttributes[index].location){
			controlAttributes[index].location = newLocation;
			setLights();
			if (index === 1){
				controlAttributes[index].angle = (controlAttributes[index].location*37.6)+17;
				controlKnobs[index].style.left = (controlAttributes[index].angle) + "%";	
			}else{
				controlAttributes[index].angle = ((controlAttributes[index].location-1)*controlAttributes[index].angIncrement)-135;
				controlKnobs[index].style.transform = "rotate(" + controlAttributes[index].angle + "deg)";
			}
		}
	}

	//On touchend or mouseup, reset the swipe flag used for controlling swipe functionality
	function resetPointerStatus(index){
		touchEventFlag = false;
		mouseDownFlag = false;
		mouseControlNum = -1;
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
	}

	function quoteInputEnter(){
				
		quoteInput.blur();
		if (controlAttributes[1].location === 1){
			quoteButtonClick();
		}
	}
	
})();
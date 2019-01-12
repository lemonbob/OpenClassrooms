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
	var mouseControlNum = 0;
	var seed;
	var controlNum;
	var i;
	var rect;
	var controlAttributes = [];
	controlAttributes[0] = {};
	controlAttributes[1] = {};
	controlAttributes[2] = {};

	controlAttributes[0].location = 1;
	controlAttributes[0].minlocation = 1;
	controlAttributes[0].maxlocation = 5;
	controlAttributes[0].centre = (controlAttributes[0].minlocation+controlAttributes[0].maxlocation)/2;
	controlAttributes[0].angle = (-135);
	controlAttributes[0].increment = 70;
	controlAttributes[0].angIncrement = 67.5;
	var rect = eventController[0].getBoundingClientRect();
	controlAttributes[0].centreX = rect.left+eventController[0].clientWidth/2;
	controlAttributes[0].centreY = rect.top+eventController[0].clientHeight/2+30;

	controlAttributes[1].location = 0;
	controlAttributes[1].minlocation = 0;
	controlAttributes[1].maxlocation = 1;
	controlAttributes[1].centre = (controlAttributes[1].minlocation+controlAttributes[1].maxlocation)/2;
	controlAttributes[1].angle = 0;
	controlAttributes[1].increment = 70;
	controlAttributes[1].angIncrement = 1;
	var rect = eventController[1].getBoundingClientRect();
	controlAttributes[1].centreX = rect.left+eventController[1].clientWidth/2;
	controlAttributes[1].centreY = rect.top+eventController[1].clientHeight/2;


	controlAttributes[2].location = 50;
	controlAttributes[2].minlocation = 1;
	controlAttributes[2].maxlocation = 99;
	controlAttributes[2].centre = (controlAttributes[2].minlocation+controlAttributes[2].maxlocation)/2;
	controlAttributes[2].angle = 0;
	controlAttributes[2].increment = 2;
	controlAttributes[2].angIncrement = 270/(controlAttributes[2].maxlocation-1);
	var rect = eventController[2].getBoundingClientRect();
	controlAttributes[2].centreX = rect.left+eventController[2].clientWidth/2;
	controlAttributes[2].centreY = rect.top+eventController[2].clientHeight/2+30;


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
		addClosureEvent(eventController,i,"resize");
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

	function addClosureEvent(element,item,event){
		var num = item;
		var el = element; 
		var n;
		if (event === "mousedown" || event === "touchstart"){
			el[num].addEventListener(event,function(e){setMousePosition(e,num);controlNum = num;}, supportsPassive ? { passive: false } : false);
		}
		if (event === "touchmove" || event === "mousemove"){
			el[num].addEventListener(event,function(e){changeKnobPosition(e,num);}, supportsPassive ? { passive: false } : false);
		}
		if (event === "resize"){
			el[num].addEventListener(event,function(){
				var rect = controlAttributes[index].getBoundingClientRect();
				controlAttributes[index].centreX = rect.left+eventController[index].clientWidth/2;
				controlAttributes[index].centreY = rect.top+eventController[index].clientHeight/2;
				if (index === 0 || index === 2){controlAttributes[index].centreY += 30;}				
			});
		}
	}
	//end of event Listeners

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
	function setMousePosition(event,index){
		var touch;
		var cx,cy,angle;
		event.preventDefault();
		if (event.type === "touchstart"){
			touchEventFlag = true;
			mouseDownFlag = true;
			if (event.targetTouches.length == 1) {
				var touch = event.targetTouches[0];
				calculateKnobLocation(touch.clientX,touch.clientY,index);
				mouseControlNum = index;
			}
		}
		
		if (touchEventFlag === false){
			calculateKnobLocation(event.clientX,event.clientY,index);
			mouseDownFlag = true;
			mouseControlNum = index;
		}
	}

	function calculateKnobLocation(x,y,index){
		var cx,cy,angle;
		cx = x-controlAttributes[index].centreX;
		cy = y-controlAttributes[index].centreY;
		cy = -cy;
		angle=Math.abs((Math.atan(cx/cy)*57.296));
		if (cy < 0){angle = (90) + (90-angle);}
		if (cx < 0){angle = -angle;}
		controlAttributes[index].location = Math.round(angle / controlAttributes[index].angIncrement);
		controlAttributes[index].location = (controlAttributes[index].location + controlAttributes[index].centre);
		if (controlAttributes[index].location < controlAttributes[index].minlocation){controlAttributes[index].location = controlAttributes[index].minlocation;}
		if (controlAttributes[index].location > controlAttributes[index].maxlocation){controlAttributes[index].location = controlAttributes[index].maxlocation;}	
		//console.log(controlAttributes[index].location);
		if (index === 1){
			controlAttributes[index].angle = (controlAttributes[index].location*37.6)+17;
			controlKnobs[index].style.left = (controlAttributes[index].angle) + "%";	
		}else{
			controlAttributes[index].angle = ((controlAttributes[index].location-1)*controlAttributes[index].angIncrement)-135;
			controlKnobs[index].style.transform = "rotate(" + controlAttributes[index].angle + "deg)";
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
		if (event.type === "touchmove" && mouseDownFlag === true){
			var touch = event.targetTouches[0];
			calculateKnobLocation(touch.clientX,touch.clientY,index);
		}

		if (event.type === "mousemove" && mouseDownFlag === true && touchEventFlag === false){
			calculateKnobLocation(event.clientX,event.clientY,mouseControlNum);
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
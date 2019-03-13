(function(global){
  var carousel = document.getElementById("mlCarousel");
  var carouselControls = document.getElementById("carouselControls");
  var controls = carouselControls.getElementsByClassName("film-controls");
  var film = {};
  film.class = document.getElementsByClassName('film');
  film.count = film.class.length-5;
  film.length = film.class.length;
  film.y = new Array(film.length);
  film.height = 381;
  film.width = 388;
  film.tilt = 50;
  film.loaded = 0;
  film.advance = 1;
  film.animating = false;
  film.noEvent = true;
  film.pauseFlag = false;
  film.pointerLocation = 0;
  film.pointerFirst = 0;
  film.touchFlag = true;
  film.dblTap = 0;
  film.index = 2;
  film.tapFlag = false;
  var animate;
  var baseTransition = "opacity 0.3s ease-in-out";
  var modifiedTransition = "transform 2s ease-in-out, opacity 0.3s ease-in-out";//, box-shadow 0.2s ease-in-out";
  window.addEventListener("resize", setResize);
  document.addEventListener("visibilitychange",visibilityReset);
  carouselControls.addEventListener("mouseenter",filmMouseOver);
  carouselControls.addEventListener("mouseleave",filmMouseOut);

  var supportsPassive = false;
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassive = true;
      }
    });
    window.addEventListener("testPassive", null, opts);
    window.removeEventListener("testPassive", null, opts);
  } catch (e) {}
  carouselControls.addEventListener("touchmove",function(e){preventMove(e);}, supportsPassive ? { passive: false } : false);
  carouselControls.addEventListener("touchend",function(e){touchUp(e);}, supportsPassive ? { passive: true } : false);
  carouselControls.addEventListener("mousedown",function(e){mouseScrollDown(e);});
  carouselControls.addEventListener("mouseup",function(e){mouseScrollUp(e);});

  document.addEventListener("click",documentClick);
  controls[0].addEventListener("click",function(){playNow(-1);});
  controls[1].addEventListener("click",function(){playNow(1);});
  for (var n=0;n<film.length;n++){
    film.class[n].onload = waitForLoad();
  }
  //end of variables and document events set up//

  //wait for pictures to load before starting//
  function waitForLoad(){
    film.loaded++;
    if (film.loaded === film.length){
      console.log("start carousel");
      initialize(0);
      for (var n=0;n<film.length;n++){
        setupFilms(n);
        film.class[n].addEventListener("transitionend",resetFilm);
      }
      setTimeout(function(){film.advance = 0;},2200);
      animate = setInterval(function(){scrollFilm(1);},5000);
    }
  }

  //closure variable for setTimeout - need a timeout as style change
  //won't take effect otherwise
  function setupFilms(i){
    var num = i;
    setTimeout(function(){
      if (film.y[num] <= (film.height*3)){
        film.class[num].style.transition = modifiedTransition;
      }
      film.class[num].style.transform = "rotate3d(0,1,0,-" + film.tilt + "deg) translateY(" + film.y[num] + "px)";
    },10);
  }

  function initialize(tilt){
    //console.log("initialize");
    //first 4 classes are the SVG film mask//
    film.index = 2;
    film.width = film.class[0].clientWidth;
    film.height = Math.round(film.width * 0.9845)-1;
    for (var n=0;n<5;n++){
      film.y[n] = (-film.height*2) + (film.height * n);

      film.class[n].style.transition = baseTransition;
      film.class[n].style.height = film.height + "px";
      film.class[n].style.left = "0px";
      film.class[n].style.opacity = "0.7";
      film.class[n].style.transform = "rotate3d(0,1,0,-" + tilt + "deg) translateY(" + film.y[n] + "px)";
    }
    for (var n=5;n<film.length;n++){
      film.y[n] = (-film.height*2) + (film.height * (n-5));

      film.class[n].style.transition = baseTransition;
      film.class[n].style.height = (film.height*0.9554) + "px";
      film.class[n].style.width = (film.width*0.6675) + "px";
      film.class[n].style.left = film.width*0.1675 + "px";
      film.class[n].style.opacity = "0.9";
      film.class[n].style.transform = "rotate3d(0,1,0,-" + tilt + "deg) translateY(" + film.y[n] + "px)";
      controls[0].style.opacity = "0.6";
      controls[1].style.opacity = "0.6";
    }
  }

  //check if screen resize affected film size then set up film size accordingly
  function setResize(){
    //console.log("resize");
    if (film.width !== film.class[0].clientWidth){
      initialize(film.tilt);
    }
  }

  function scrollFilm(direction){
    film.noEvent = false;
    film.animating = true;

    film.index += direction;
    if (film.index < 0){film.index = film.count-1;}
    if (film.index >= film.count){film.index = 0;}
    for (var n=0;n<film.length;n++){
      film.y[n] -= film.height*direction;
      if (film.y[n] <= (film.height*2)){
        film.class[n].style.transition = modifiedTransition;
      }
      film.class[n].style.transform = "rotate3d(0,1,0,-" + film.tilt + "deg) translateY(" + film.y[n] + "px)";
    }
  }


  function resetFilm(){
    if (film.noEvent === false){
      //console.log("reset(transitionend");
      film.noEvent = true; //so we only call this once not for all transitionend events

      for (var n=0;n<film.length;n++){
        //reset the positions of the films if over the top.
        if (film.y[n] === (-film.height*3) && film.advance !== (-1)){
          film.class[n].style.transition = baseTransition;
          if (n>4){
            film.y[n] = (film.height*(film.count-3));//takes film to bottom of stack
          }
          else{
            film.y[n] = film.height*2;
          }
        }
        if ((n < 5) && (film.y[n] === (film.height*3)) && (film.advance === (-1))){
          film.class[n].style.transition = baseTransition;
          film.y[n] = -(film.height*2);
        }
        if ((n > 4) && (film.y[n] === (film.height*10)) && (film.advance === (-1))){
          film.class[n].style.transition = baseTransition;
          film.y[n] = (film.height*(-2));
        }
        if (film.y[n] > (film.height*2)){
          film.class[n].style.transition = baseTransition;
        }
        film.class[n].style.transform = "rotate3d(0,1,0,-" + film.tilt + "deg) translateY(" + film.y[n] + "px)";
      }
      //add a pause so that the button can't be pressed again too quickly
      setTimeout(function(){film.advance=0;film.animating = false;},100);
      if (animate === 0){
        controls[0].style.opacity = "0.6";
        controls[1].style.opacity = "0.6";
        modifiedTransition = "transform 2s ease-in-out, opacity 0.3s ease-in-out";
      }
    }
  }

  function playNow(i){
    var transformstate;
    //only allow one button click at a time don't want to store a massive stack of click events
    if (film.animating === false){
      pause();
      film.advance = i;
      if (i > 0){controls[1].style.opacity = "1";}
      if (i < 0){controls[0].style.opacity = "1";}
      modifiedTransition = "transform 0.3s ease-in-out, opacity 0.3s ease-in-out";
      scrollFilm(i);
    }
    //if the buttom was clicked during an active interval transition, pause transition and override it with super fast to next frame
    //however we don't want to run the "transitionend" event routine during pause of getPropertyValue, so use noEvent flag
    if (animate !== 0 && film.animating === true){
      pause();
      film.noEvent = true; //noEvents for pause transition
      film.advance = i;
      if (i < 0){film.index += i;}
      modifiedTransition = "transform 0.3s ease-in-out, opacity 0.3s ease-in-out";
      for (var n=0;n<film.length;n++){
        transformstate = window.getComputedStyle(film.class[n],null).getPropertyValue("transform");
        film.class[n].style.transition = modifiedTransition;
        film.class[n].style.transform = transformstate;
        if (i<0){film.y[n] += film.height;}
      }
      film.noEvent = false; //add transitionend events back in
      //set the new position of the films, need a timeout to allow reflow as just did a transform above
      setTimeout(function(){
        for (var n=0;n<film.length;n++){film.class[n].style.transform = "rotate3d(0,1,0,-" + film.tilt + "deg) translateY(" + film.y[n] + "px)";}
      },100);
    }

  }

  function filmMouseOver(){
    film.pauseFlag = true;
  }

  function filmMouseOut(){
    film.pauseFlag = false;
  }

  function documentClick(){
    if (film.pauseFlag === true){
      //pause();
      film.dblTap++;
      if (film.dblTap > 1){
        showTrailer(film.index);
        film.dblTap = 0;
      }
      setTimeout(function(){film.dblTap = 0;},300)
    }else {
      resume();
    }
  }

  function preventMove(event){
    if (film.pauseFlag = true){
      event.preventDefault();
    }
    if (film.touchFlag === true){
      if (event.targetTouches.length == 1) {
        var touch = event.targetTouches[0];
        if (film.pointerFirst !== 0){
          film.pointerLocation = touch.pageY;
          if ((film.pointerFirst - film.pointerLocation) > 5){film.touchFlag = false; playNow(1)};
          if ((film.pointerFirst - film.pointerLocation) < -5){film.touchFlag = false; playNow(-1)};
        }
        if (film.pointerLocation === 0){film.pointerFirst = touch.pageY;}
      }
    }
  }

  function touchUp(event){
    film.pointerLocation = 0;film.pointerFirst = 0;
    film.touchFlag = true;
    film.tapFlag = false;
  }

  function mouseScrollDown(event){
    film.pointerLocation = event.offsetY;
  }

  function mouseScrollUp(event){
    if ((film.pointerLocation - event.offsetY) > 5){playNow(1)};
    if ((film.pointerLocation - event.offsetY) < -5){playNow(-1)};
    film.pointerLocation = 0;
  }

  function showTrailer(index){
    if (film.animating === false && film.advance === 0){
      pause();
      playTrailer(index);
    }
  }

  //pause and resume functions
  function pause(){
    if (animate !== 0){
      clearInterval(animate);
      animate = 0;
    }
  }

  function resume(){
    if (animate === 0){
      animate = setInterval(function(){scrollFilm(1);},5000);}
    }

    //pause animations when not visible//
    function visibilityReset(){
      if (document.visibilityState === "hidden"){
        pause();
      }
      if (document.visibilityState === "visible"){
        //initialize(film.tilt)
        resume();
      }
    }

    var filmPausePlay = {};
    filmPausePlay.pause = pause;
    filmPausePlay.resume = resume;
    global.$filmcontrol = filmPausePlay;

    //"iife" end of immediately invoked function expression
  })(window);

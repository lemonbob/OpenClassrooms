var tabcontainer1 = document.getElementById("infoSection").getElementsByClassName("tab-container");
var tabcontainer2 = document.getElementById("filmsSection").getElementsByClassName("tab-container");
var tabcontainer3 = document.getElementById("contactSection").getElementsByClassName("tab-container");
var tabPane1 = document.getElementById("infoSection").getElementsByClassName("tab-pane");
var tabPane2 = document.getElementById("filmsSection").getElementsByClassName("tab-pane");
var tabPane3 = document.getElementById("contactSection").getElementsByClassName("tab-pane");
var tabs1 = document.getElementById("infoSection").getElementsByClassName("tab");
var tabs2 = document.getElementById("filmsSection").getElementsByClassName("tab");
var tabs3 = document.getElementById("contactSection").getElementsByClassName("tab");
var movieBlock = document.getElementsByClassName("movie-block");
var trailers = document.getElementsByClassName("film-trailer");
var trailerTicket = document.getElementsByClassName("ticket-click");
var trailerFrame = document.getElementsByClassName("trailer-frame");
var movieSelection = document.getElementById("movieSelect1").getElementsByTagName("option");

var menuitems = document.getElementById("mlNavBar").getElementsByTagName("li");
menuitems[10].addEventListener("click",function(){changeMenuTabs(tabs3,tabPane3,0);});
menuitems[11].addEventListener("click",function(){changeMenuTabs(tabs3,tabPane3,1);});
var ticket = document.getElementById("ticketSvg").getElementsByTagName("img");
ticket[0].addEventListener("click", function(){changeMenuTabs(tabs3,tabPane3,0);});

var dropDowns = document.getElementsByClassName("ml-drop-down");
var listItems1 = dropDowns[0].getElementsByTagName("li");
var listItems2 = dropDowns[1].getElementsByTagName("li");
var selectedMovie = 0;
window.addEventListener("resize",setTabWidth);
//events
for (var n=0;n<tabs1.length;n++){
  addClosureEvent(tabs1,n);
  tabs1[n].style.width = (tabcontainer1[0].offsetWidth/tabs1.length) + "px";
}
for (var n=0;n<tabs2.length;n++){
  addClosureEvent(tabs2,n);
  tabs2[n].style.width = (tabcontainer2[0].offsetWidth/tabs2.length) + "px";
}
for (var n=0;n<tabs3.length;n++){
  addClosureEvent(tabs3,n);
  tabs3[n].style.width = (tabcontainer3[0].offsetWidth/tabs3.length) + "px";
}

//use a closure to lock in the element node number with the element instead of using "this" keyword
function addClosureEvent(element, i){
  var num = i;
  var el = element;
  el[num].addEventListener("click",function(){changeTabs(el,num);});
}

for (var n=0;n<movieBlock.length;n++){
  addClosureEventMB(n);
}

for (var n=0;n<listItems1.length;n++){
  addClosureEventLI(n);
}
for (var n=0;n<listItems2.length;n++){
  addClosureEventLI2(n);
}

for (var n=0;n<trailers.length;n++){
  addClosureEventMBClose(n);
}

for (var n=0;n<trailerTicket.length;n++){
  addClosureEventTicket(n);
}

//closure events for above to retain variable in event handler functions
function addClosureEventTicket(i){
  var num = i;
  trailerTicket[num].addEventListener("click",function(){movieSelection[selectedMovie].selected = "true";closeTrailer(num);changeMenuTabs(tabs3,tabPane3,0);});
}

function addClosureEventMB(i){
  var num = i;
  movieBlock[num].addEventListener("click",function(){playTrailer(num);});
}

function addClosureEventLI(i){
  var num = i;
  listItems1[num].addEventListener("click",function(){changeMenuTabs(tabs1,tabPane1,num)}); //changeInfoMenu(num)});
}
function addClosureEventLI2(i){
  var num = i;
  listItems2[num].addEventListener("click",function(){changeMenuTabs(tabs2,tabPane2,num)});//changeFilmsMenu(num)});
}

function addClosureEventMBClose(i){
  var num = i;
  trailers[num].addEventListener("click", function(){closeTrailer(num);});
}
//end of setup

function changeTabs(tabs,i){
  var num = i;
  var fTabs = tabs;
  for (var n=0;n<fTabs.length;n++){
    if (fTabs[n].className === "tab ml-active"){
      fTabs[n].className = "tab";
    }
  }
  fTabs[num].className = "tab ml-active";
}

function playTrailer(i){
  trailers[0].style.display = "flex";
  trailers[0].style.visibility = "visible";
  trailers[0].style.transition = "opacity 0.5s ease-in-out";
  selectedMovie = i;  
  opacityClosure(i); //another closure needed for the Timeout function
}

function opacityClosure(p){
  var num = p;
  setTimeout(function(){trailers[0].style.opacity = "1";$filmcontrol.pause();},100);
  switch (num){
    case 0:
    trailerFrame[0].src = "https://www.youtube.com/embed/8_rTIAOohas";
    break;
    case 1:
    trailerFrame[0].src= "https://www.youtube.com/embed/XUhU3ERigdw";
    break;
    case 2:
    trailerFrame[0].src = "https://www.youtube.com/embed/96LR5Vsag_E";
    break;
    case 3:
    trailerFrame[0].src = "https://www.youtube.com/embed/IsOlj-xpK9Q";
    break;
    case 4:
    trailerFrame[0].src = "https://www.youtube.com/embed/hJ2j4oWdQtU";
    break;
    case 5:
    trailerFrame[0].src = "https://www.youtube.com/embed/sGbxmsDFVnE";
    break;
    case 6:
    trailerFrame[0].src = "https://www.youtube.com/embed/6CKcqIahedc";
    break;
    case 7:
    trailerFrame[0].src = "https://www.youtube.com/embed/hx0_F3I10ws";
    break;
    case 8:
    trailerFrame[0].src = "https://www.youtube.com/embed/EAzGXqJSDJ8";
    break;
    case 9:
    trailerFrame[0].src = "https://www.youtube.com/embed/i5qOzqD9Rms";
    break;
    case 10:
    trailerFrame[0].src = "https://www.youtube.com/embed/10r9ozshGVE";
    break;
    case 11:
    trailerFrame[0].src = "https://www.youtube.com/embed/e3Nl_TCQXuw";
    break;
    default:
    trailerFrame[0].src = "https://www.youtube.com/embed/e3Nl_TCQXuw";
  }
}

function closeTrailer(i){
  trailers[0].style.opacity = "0";
  $filmcontrol.resume();
  hideTrailerClosure(i); //another closure needed for the Timeout function
}

function hideTrailerClosure(p){
  var num = p;
  var filmsrc = trailerFrame[0].src;
  setTimeout(function(){
    trailerFrame[0].src = "";//filmsrc;
    trailers[0].style.visibility = "hidden";
    trailers[0].style.display = "none";
  },550);
}


function changeMenuTabs(tabs,tabPane,i){
  for (var n=0;n<tabs.length;n++){
    if (tabs[n].className === "tab ml-active"){
      tabs[n].className = "tab";
    }
    if (tabPane[n].className === "tab-pane fade container-fluid active in"){
      tabPane[n].className = "tab-pane fade container-fluid"
    }
  }
  tabs[i].className = "tab ml-active";
  tabPane[i].className = "tab-pane fade container-fluid active in"
}


function setTabWidth(){
  for (var n=0;n<tabs1.length;n++){
    tabs1[n].style.width = (tabcontainer1[0].offsetWidth/tabs1.length) + "px";
  }
  for (var n=0;n<tabs2.length;n++){
    tabs2[n].style.width = (tabcontainer2[0].offsetWidth/tabs2.length) + "px";
  }
  for (var n=0;n<tabs3.length;n++){
    tabs3[n].style.width = (tabcontainer3[0].offsetWidth/tabs3.length) + "px";
  }
}

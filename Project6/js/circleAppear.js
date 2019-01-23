
var canvas = document.getElementById('gmCanvas');
var context = canvas.getContext('2d');


var img = new Image(canvas.width, canvas.height);
    //img.onload = function(){requestAnimationFrame(appear);};
    img.src = "../img/logo.svg";
    var dx = canvas.width/6;
    var dy = canvas.height/6;
    var ddx = 0;
    var ddy = 0;
    var incx = dx/100;
    var incy = dy/100;
    var i;
    var PI2 = Math.PI*2; 
    
    //add event listeners
    window.addEventListener("resize", function(){
      canvas.height = window.innerHeight*0.5;
      canvas.width = canvas.height*0.5638;
      canvas.style.width = canvas.width + "px";
      canvas.style.height = canvas.height + "px";
      dx = canvas.width/6;
      dy = canvas.height/6;
      inc = dx/100;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.beginPath();
      for (i = 0;i<36;i++){
        context.moveTo(circleArray[i].x,circleArray[i].y);
        context.arc(circleArray[i].x,circleArray[i].y,ddx,0,PI2, false);
	      //context.rect(circleArray[i].x - dx/2,circleArray[i].y - dy/2,ddx,ddy);
      }
      context.closePath();
      context.clip();
      context.drawImage(img,0,0,canvas.width, canvas.height);
      context.restore();
    };);

    var circleArray = []; 
    for (i=0;i<36;i++){
      circleArray[i] = {};
      circleArray[i].x = (dx * (i%6)) + (dx/2);
      circleArray[i].y = (dy * Math.floor(i/6))+ (dy/2);
    }
    context.fillStyle = "#f00";

    function appear(timestamp){
      ddx += incx;
      ddy += incy;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.beginPath();
      for (i = 0;i<36;i++){
        context.moveTo(circleArray[i].x,circleArray[i].y);
        context.arc(circleArray[i].x,circleArray[i].y,ddx,0,PI2, false);
	//context.rect(circleArray[i].x - dx/2,circleArray[i].y - dy/2,ddx,ddy);
}
context.closePath();
context.clip();
context.drawImage(img,0,0,canvas.width, canvas.height);
context.restore();
if (ddx<(dx*1.2)){requestAnimationFrame(appear);}
}


	//setTimeout(function(){context.clearRect(0, 0, canvas.width, canvas.height);},2000);//context.drawImage(img,0,0,canvas.width, canvas.height);},2000);

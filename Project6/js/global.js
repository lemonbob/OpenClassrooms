//Global Variables and Definitions global.js//

//animation class
class animationObject{
  constructor(){    
    this.original = 0;
    this.targetV = 0;
    this.difference = 0;
    this.current = 0;
    this.duration = 0;
    this.startFrame = 0;
    this.timestamp = 0;
    this.percentDone = 0;
  }
  setAttribute(originalValue, targetValue, time){
    this.original = originalValue;
    this.targetV = targetValue;
    this.difference = targetValue - originalValue;
    this.duration = time;
    this.current = originalValue;
    this.startFrame = 0;
    this.timestamp = 0;
    this.percentDone = 0;
  }
  animateAttribute(timestamp, easing, loop, delay){
    if (delay === undefined){delay = 0;}
    if (this.startFrame === 0){this.startFrame = timestamp+delay;}
    this.timestamp = timestamp;
    if (this.timestamp >= this.startFrame){
      this.percentDone = (this.timestamp - this.startFrame) / this.duration;
      if (this.percentDone >= 1){this.percentDone = 1;}
      if (easing === "ease-in-out"){this.current = this.original + (((3*this.percentDone*this.percentDone) - 2*this.percentDone*this.percentDone*this.percentDone) * this.difference);}
      if (easing === "ease-in"){this.current = this.original + ((this.percentDone*this.percentDone) * this.difference);}
      if (easing === "ease-out"){this.current = this.original + ((1-(1-this.percentDone)*(1-this.percentDone)) * this.difference);}
      if (easing === "linear"){this.current = this.original + (this.percentDone * this.difference);}
      if (this.percentDone === 1){
        if (loop === true){
          this.startFrame = 0;
          this.percentDone = 0;
          this.targetV = this.original;
          this.original = this.current; 
          this.difference = this.targetV - this.original;
          this.timestamp = timestamp;
        } 
      }
    }
  }
}

//sounds
var themeSfx = setupAudioElement(themeSfx, "sound/cyborgtheme.mp3");
var moveSfx = setupAudioElement(moveSfx, "sound/move.mp3");
var zapSfx = setupAudioElement(zapSfx, "sound/zap.mp3");
var shieldSfx = setupAudioElement(shieldSfx, "sound/powerup.mp3");
var pistolSfx = setupAudioElement(pistolSfx, "sound/9mm.mp3");
var uziSfx = setupAudioElement(uziSfx, "sound/uzi.mp3");
var rifleSfx = setupAudioElement(rifleSfx, "sound/rifle.mp3");
var grenadeSfx = setupAudioElement(grenadeSfx, "sound/grenade.mp3");
var laserSfx = setupAudioElement(laserSfx, "sound/laser.mp3");
var hastalavistaSfx = setupAudioElement(hastalavistaSfx, "sound/hastalavista.mp3");
var formSettingsData = {};

function setupAudioElement(audioObject, url){
  audioObject = document.createElement('audio');
  audioObject.autoplay = false;
  audioObject.preload = "auto";
  audioObject.src = url;
  audioObject.style.display = "none";
  return audioObject;
}

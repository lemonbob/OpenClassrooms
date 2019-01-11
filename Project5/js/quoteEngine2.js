//Complex quote engine based on Datamuse API Cross Origin Requests
//var used rather than ES6 const/let because const only has 84% support at present
//all units are immediate invoked function expressions to ensure that variable are 
//private and not confused if units have the same variable nomenclature

(function(global){

var quote;
var quoteWords = new Array(9);
var seedWord;
var rqScope;
var rqNumber;
var rqMode;
var rqOutputWindow;
var quoteStage=0;
var sentenceStart = ["Ones", "When the", "If the"];
var coordinateClause = ["but", "so", "because", "however"];
var searchParam = {};
searchParam.wordType = ["n","adj","v", "adj", "adv","n","adj","v","adj"];
searchParam.searchType = ["ml=","rel_jjb=", "rel_bga=", "ml=", "ml=", "ml=", "rel_jjb=", "rel_bga=", "rel_jjb="];
searchParam.relatedWord = [0,0,0,0,0,0,5,5,5];
searchParam.wordEnd = ["none", "none", "s", "ed", "anything", "none", "none", "s", "ed"];
searchParam.minLength = [4, 4, 1, 4, 4, 4, 4, 1, 4];
var percentComplete;
var wordRequestOK = false;
var checkRequest;
var spellCheckOK;
var getAdvancedQuote;
var xhr = new XMLHttpRequest();

//return a random number within a set length
function getRandomIndex(len) {
  return Math.floor(Math.random() * len);
}
//construct the quote from the words Array, put adjectives before nouns i.e [1] before [0] and [6] before [5]
function constructQuote(){
  var i;
  i = getRandomIndex(sentenceStart.length);
  quote = sentenceStart[i];
  quote += " " + quoteWords[1];
  quote += " " + quoteWords[0];
  quote += " " + quoteWords[2];
  quote += " " + quoteWords[3];
  if (i === 0){quote += ", " + quoteWords[4];}
  quote += ", the";
  quote += " " + quoteWords[6];
  quote += " " + quoteWords[5];
  quote += " " + quoteWords[7];
  quote += " " + quoteWords[8];
  quote += ".";
}

//function to assess words returned by Datamuse and select length and word endings to match desired sentence structure . ie past-participle of verb
function narrowWords(wordType,wordJSON,start,wordEnd,minLength){
  var typedWordList = [];
  var i,j,c = 0;
  var wordToTest;
  var wordLength;
  var wordMatch;

  if (minLength === undefined){minLength = 1;}
  for (i=start;i<wordJSON.length;i++){
    if (wordJSON[i].tags !== undefined){
      for (j=0;j<wordJSON[i].tags.length;j++){
        if (wordJSON[i].tags[j] === wordType){
          wordToTest = wordJSON[i].word;
          wordLength = wordToTest.length;
          wordMatch = false;
          if (wordToTest.includes(wordEnd,(wordLength-wordEnd.length))){wordMatch = true;}
          if (wordToTest.includes("ss", (wordLength-2))){wordMatch = false;}
          if ((wordEnd === "none") && (wordToTest.includes("ed", (wordLength-2)) === false) && (wordToTest.includes("s", (wordLength-1)) === false )){wordMatch = true;}
          if (wordEnd === "anything" || wordEnd === undefined){wordMatch = true;}
          if (wordMatch === true && wordLength>minLength){
            typedWordList[c] = wordJSON[i].word;
            c++;
          }
        }
      }
    }
  }
  return typedWordList;
}


//////////////////////////////////////////////////////////////////////////////////////////////////
function initiateAdvancedQuote(scope,outputElement, word, task, searchNumber){
  spellCheckOK=false;
  quoteStage=0;
  rqScope = scope;
  rqOutputWindow = outputElement;
  rqOutputWindow.innerHTML = "<h1>0%</h1>";
  wordLookUp(word,task,searchNumber);
}



//look up a word from the Datamuse API through a PHP POST request to avoid CORS problems with Datamuse.
//Datamuse API codes work as follows
//ml= means like sp= spelled like sl= sounds like
//rel_[code] related words codes trg= triggers jja= popular nouns modified by the given adjective jjb= popular adjectives modified by the noun syn= synonyms bga= frequent followers
//rhy= rhymes par= part of eg tree-trunk gen= more general than ant= antonyms
//topics= hints to the system
//max= maximum number returned

function wordLookUp(word, task, number){
  //flag to check for API failure, leave 5seconds before logging error.
  wordRequestOK = false;
  checkRequest = setTimeout(function(){
    if (wordRequestOK === false){rqOutputWindow.innerHTML = "<h1>ERROR, please try again!</h1>";}
  },5000);
  //if (word.includes(" "), word.length){word = word.replace(" ", "+");}
  var params = 'word=' + word + '&task=' + task + '&max=' + number.toString();
  if (number<1 || number == undefined){
    number = 10;
  }
  if (task === "ml="|| task === "sp="|| task === "sl="|| task === "rel_trg="|| task === "rel_jja="|| task === "rel_jjb="||
    task === "rel_syn="|| task === "rel_ant="|| task === "rel_bga="|| task === "rel_rhy="|| task === "rel_par="|| task === "rel_gen="){
    xhr.open('POST', "php/postRequest.php", true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.onload = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      handleResponse(xhr.responseText);
    }else{
      //output an error to the window if the request fails
      rqOutputWindow.innerHTML = "<h1>ERROR, please try again!</h1>";
    }
  }
  xhr.send(params);
}
}

//Handle the returned JSON text from Datamuse
function handleResponse(response) {
  var mlJSON = JSON.parse(response);
  var JSONlen = mlJSON.length;
  var narrowWordList;
  var i = false;
  wordRequestOK = true;
  clearTimeout(checkRequest);
  if (quoteStage === 0){
        //if can correct spelling of seedword, do first. Then get a synonym narrow search of 20
        if (mlJSON.length === 0){
          //if the spelling can't be corrected, just get a random word
          wordLookUp("thing", searchParam.searchType[quoteStage], 100);//try a random word
        }
        if (mlJSON.length === 1 && spellCheckOK === false){
          spellCheckOK = true;
          //get a broader word from the orignial seedword
          wordLookUp(mlJSON[0].word, searchParam.searchType[quoteStage], rqScope);
        }else if (mlJSON.length >= 1 &&  spellCheckOK === true){
          narrowWordList = narrowWords(searchParam.wordType[quoteStage],mlJSON,0,searchParam.wordEnd[quoteStage]);
          if(narrowWordList.length>0){
            i = getRandomIndex(narrowWordList.length);
            quoteWords[quoteStage] = narrowWordList[i];
            //console.log("QuoteStage " + quoteStage + " " + searchParam.wordType[quoteStage] + " " + searchParam.searchType[quoteStage] + " " + quoteWords[searchParam.relatedWord[quoteStage]]);
            quoteStage=1;
            wordLookUp(quoteWords[searchParam.relatedWord[quoteStage]], searchParam.searchType[quoteStage], 900);
          }else{
          //get a synonym with a wide search of 900 if the above search didn't match a noun
          wordLookUp("thing", searchParam.searchType[quoteStage], 100);//try a basic noun as a last resort
        }
      }
    }
      //Get the rest of the words
      if (quoteStage > 0 && quoteStage < quoteWords.length && i === false){
      //narrow the words to the desired types
      narrowWordList = narrowWords(searchParam.wordType[quoteStage], mlJSON,0,searchParam.wordEnd[quoteStage],searchParam.minLength[quoteStage]);
      //if the narrowed list contains at least one word
      if (narrowWordList.length != 0){
      //pick a word from the narrowed list (top 40 words only)
      if (narrowWordList.length>rqScope){
        i = getRandomIndex(rqScope);
      }else{
        i = getRandomIndex(narrowWordList.length);
      }
      //special case for verbs related to noun - always pick top word
      if(quoteStage === 2 || quoteStage === (quoteWords.length-2)){quoteWords[quoteStage] = narrowWordList[0];
      }else{
        //pick any random word from list
        quoteWords[quoteStage] = narrowWordList[i];
      }
      //increment and setup next word search
      //console.log("QuoteStage " + quoteStage + " " + searchParam.wordType[quoteStage] + " " + searchParam.searchType[quoteStage] + " " + quoteWords[searchParam.relatedWord[quoteStage]]);
      quoteStage++;
      if (quoteStage < quoteWords.length){
        if (quoteStage === 4){
          i = getRandomIndex(coordinateClause.length);
          wordLookUp(coordinateClause[i], searchParam.searchType[quoteStage], 7);
        }
        //special case for verbs, need a massive list to find related verbs from DataMuse API
        else if (quoteStage === 2 || quoteStage === 3 || quoteStage === (quoteWords.length-2)){
          wordLookUp(quoteWords[searchParam.relatedWord[quoteStage]], searchParam.searchType[quoteStage], 900);
        }else{
          wordLookUp(quoteWords[searchParam.relatedWord[quoteStage]], searchParam.searchType[quoteStage], 100);
        }
      }
    }else{
      //look up a different word with a broader scoping method and redo
      tryAgain = true;
      wordLookUp("wisdom", searchParam.searchType[quoteStage], 900);
    }
  }
  percentComplete = quoteStage/quoteWords.length*100;
  percentComplete = percentComplete.toFixed(0);
  rqOutputWindow.innerHTML = "<h1>" + percentComplete + "%</h1>";
  if (quoteStage === quoteWords.length){constructQuote();rqOutputWindow.innerHTML = "<p>" + quote + "</p>";}
}

getAdvancedQuote = initiateAdvancedQuote;
global.$getAdvancedQuote = getAdvancedQuote; 


})(window);
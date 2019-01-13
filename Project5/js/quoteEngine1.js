//simple quote engine based on three arrays of sentence fragments
//var used rather than ES6 const/let because const only has 84% support at present
//all units are immediate invoked function expressions to ensure that variable are 
//private and not confused if units have the same variable nomenclature

(function(global){

var sentencePart1 = ["The intelligent child", "The slothly glutton", "The wise person", "The most successful person", "Everyone", "Luke Skywalker", "Even the stupidest person"];
var sentencePart2 = ["knows that Father Christmas", "finds the key to good health", "understands that the meaning of life", "realises that the key to success", 
"appreciates that the best thing in the world", "recognises that what is most important", "knows that Darth Vader", "understands that the worst thing"];
var sentencePart3 = ["isn't real.", "comes from a hearty diet.", "is happiness.", "comes from hard work.", "is watching football.", 
"is eating chocolate.", "is drinking <em>Pepsi</em> not <em>Coca-Cola.</em>", "comes from the <em>Dark Side!</em>", "is regretting decisions."];

var quote
var getSimpleQuote;


function getRandomIndex(len) {
  return Math.floor(Math.random() * len);
}


function initiateSimpleQuote(number,outputElement){
	var n,i;
	
	quote = "";
	for (i=0;i<number;i++){
		quote += (i+1) + ". "; 
		n = getRandomIndex(sentencePart1.length);
		quote += sentencePart1[n] + " ";
		n = getRandomIndex(sentencePart2.length);
		quote += sentencePart2[n] + " ";
		n = getRandomIndex(sentencePart3.length);
		quote += sentencePart3[n] + " ";
		if ((i+1) !== (number)){
			quote += "<br>"
		}
	}
	outputElement.innerHTML = "<p>" + quote + "</p>";
}

getSimpleQuote = initiateSimpleQuote;
global.$getSimpleQuote = getSimpleQuote; 

})(window);

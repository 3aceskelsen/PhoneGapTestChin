var isiPad 					= navigator.userAgent.indexOf('iPad') != -1;
var clickEvents 			= (isiPad)?"touchstart":"click";
var questions				= [];	//this is filled below
var questionIndex 			= 0;
var correctStatusCounter	= 0;
var incorrectStatusCounter	= 0;


$(document).ready(function() {
	displayAnswerCounter();
	//questions[questionIndex].init();
	
	//	Forward and back handlers!
	$("#back").bind(clickEvents,function(e) {
		if(questionIndex > 0)
			questionIndex--;
		init(questionIndex);
	});
	$("#forward").bind(clickEvents,function(e) {
		if(questionIndex < questions.length-1)
			questionIndex++;
		init(questionIndex);
	});
});


// Display methods
var answerClick = function() {
	questions[questionIndex].answerClick(this);
};
var displayAnswerCounter = function() {
	var correctStatus = $("#correct-status");
	correctStatus.html("Correct "+ correctStatusCounter);
	var incorrectStatus = $("#incorrect-status");
	incorrectStatus.html("Incorrect "+ incorrectStatusCounter);
};

var init = function(i) {
	questions[i].displayCharacter();
	questions[i].displayAnswers();
	questions[i].displayCounter(i,questions.length);
};




var getDistractors = function(distractorNum, correctIndex, sourceArray, valueKey) {
	//sourceArray = shuffle(sourceArray);
	var retArray = new Array();
	var minUseCount = 1000;
	for(var loopIndex in sourceArray) {
		if(sourceArray[loopIndex].useCount < minUseCount)
			minUseCount = sourceArray[loopIndex].useCount;
	}
	var maxLoops = 100;
	var loopCount = 0;
	while(maxLoops > loopCount && retArray.length < distractorNum && sourceArray.length-1 > retArray.length) {
		for(var loopIndex in sourceArray) {
			if(sourceArray[loopIndex].useCount == minUseCount && loopIndex != correctIndex) {
				retArray.push(sourceArray[loopIndex][valueKey]);
			}
			/*if(retArray.length >= distractorNum)
				break;*/
		}
		minUseCount++;
		loopCount++;
	}
	retArray = shuffle(retArray).slice(0,distractorNum);
	
	return retArray;
}

var jsonConfigFile = "includes/assets/characters.json";
$.getJSON(jsonConfigFile, function(jsonAjaxResult){
	
	// Create a question by generating the following:
	//	1. The "correct" option(s)
	//	2. The "incorrect" options (distractors)
	//		2.1. Assign zero "uses" on each element in the "config" object.
	//		2.2. Create a function that returns a specific number of distractors (which receives 2
	//			 parameters, 1-the number of distractors needed, 2-the index of the "correct" answer
	//			 (so it doesn't show up as the "right" answer and the distractor... that would be silly)
	//		2.3. Inside that function iterate the "uses" each time they are returned.
	//		2.4. Update the function to build into it's "valid returns" only the lowest set of "uses"
	//			 (obviously you need to fill the requested quota, so you may have to grab more than
	//			 just the minumum "uses" group.
	//	3. all the other information (which is already available at this point)
	//	Initialize!!!

	var quiz = getParameterByName("Q");
	if(quiz) {
		for(var jsonFirstLevelKey in jsonAjaxResult){
			if(quiz != jsonFirstLevelKey){
				//jsonAjaxResult[jsonFirstLevelKey] = null;
				delete jsonAjaxResult[jsonFirstLevelKey];
			}
		}
	}
	
	//assign zero uses to each element in the "config" object.
	for(var jsonFirstLevelKey in jsonAjaxResult){
		for(var i=0; i < jsonAjaxResult[jsonFirstLevelKey].length; i++) {
			jsonAjaxResult[jsonFirstLevelKey][i].useCount = 0;
		}
	}
	
	for(var jsonFirstLevelKey in jsonAjaxResult){
		for(var objNumber=0; objNumber < jsonAjaxResult[jsonFirstLevelKey].length; objNumber++){
			var correct = new Answer({"answer":jsonAjaxResult[jsonFirstLevelKey][objNumber]["translation"], "correct":true});
			var distractors = [];
			var distractorNum = 3;
			var pickDistractors = getDistractors(distractorNum, objNumber, jsonAjaxResult[jsonFirstLevelKey], "translation");
			for(var d in pickDistractors) {
				distractors.push(new Answer({"answer":pickDistractors[d], "correct":false}))
			}
			
			questions.push(new Question({"question-stem":jsonAjaxResult[jsonFirstLevelKey][objNumber]["chinese-character"], "correct-answer-array":[correct], "distractor-answer-array":distractors}));
			//IsLog.c("Pushed onto Questions!");
		}
	}
	shuffle(questions);
	questionIndex = 0;
	init(0);
}).fail(function(){
	IsLog.c("Error: Failed to retrieve data!!!");
	alert("Error: Failed to load! Please try again.");
});
function getParameterByName(name)
{
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.search);
	if(results == null)
		return "";
	else
		return decodeURIComponent(results[1].replace(/\+/g, " "));
}
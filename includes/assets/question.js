
//	This object will store each question.

function Question (initVariable) {
	this.soundFile;
	this.stemObject;
	this.answersArray = new Array();
	this.correctIndex;
	this.questionIndex = 0;
	this.answerIsChosen = false;
	
	// soundFile
	this.getSoundFile = function() {
		return this.soundFile;
	};
	this.setSoundFile = function(file) {
		this.soundFile = file;
		return (this.soundFile === file);
	};
	
	// stem
	this.getStem = function() {
		return this.stemObject;	
	};
	this.setStem = function(i) {
		this.stemObject = i;
		return (this.stemObject === i);
	};

	// rightAnswer
	this.getRightAnswer = function() {
		for(var i=0; i < this.answersArray.length; i++) {
			if(this.answersArray[i].getCorrectBool() == true) {
				this.correctIndex = i;
				return this.answersArray[i];
			}
		}
		return false;
	};
	this.setRightAnswer = function(i) {
		if(this.getRightAnswer() != false)						//if there is a correct answer already, replace it
			this.answersArray[correctIndex].setAnswer(i);
		else{													//if there was not a correct answer, add it and randomize if array > 1
			this.answersArray.push(i);
			if(this.answersArray.length > 1)
				this.answersArray = shuffle(this.answersArray);
				
			for(var j=0; j<this.answersArray.length; j++){		//find the index of the correct answer, and update correctIndex
				if(this.answersArray[j] == i)
					this.correctIndex = j;
			}
		}
	};
	
	// distractors	
	this.getQuestion = function(position) {
		return this.answersArray[position];
	};
	this.setQuestion = function(i) {
		this.answersArray.push(i);
		return (this.answersArray[this.answersArray.length-1] === i)
	};
	
	this._init = function(initVariable) {
		//IsLog.c(initVariable);
		//set sound file
		if(typeof initVariable == "undefined")
			initVariable = {};
		if(typeof initVariable["file-path"] == "undefined")
			this.setSoundFile("default-path");
		else
			this.setSoundFile(initVariable["sound-file-path"]);
		//set stem
		if(typeof initVariable["question-stem"] == "undefined")
			this.setStem("default-path");
		else
			this.setStem(initVariable["question-stem"]);
		//set correct answer
		if(typeof initVariable["correct-answer-array"] == "undefined")
			this.setRightAnswer("default-path");
		else
			this.setRightAnswer(initVariable['correct-answer-array'][0]);
		//set distractors
		if(typeof initVariable["distractor-answer-array"] == "undefined")
		{
			this.setQuestion("default-path");
			this.setQuestion("default-path");
			this.setQuestion("default-path");
			//this.setQuestion("default-path");
		}
		else
		{
			this.setQuestion(initVariable['distractor-answer-array'][0]);
			this.setQuestion(initVariable['distractor-answer-array'][1]);
			this.setQuestion(initVariable['distractor-answer-array'][2]);
			//this.setQuestion(initVariable['distractor-answer-array'][3]);
		}
		this.answersArray = shuffle(this.answersArray);
		//init all answer elements and html strings
		for(var k=0; k < this.answersArray.length; k++) {
			this.answersArray[k].setAnswerElement(("#answer"+(k+1)));
			this.answersArray[k].setAnswerHTML("<span>@</span><i class=\"status-marker-check\" style=\"display:none\">%</i><i class=\"status-marker-x\" style=\"display:none\">X</i><h3>"+this.answersArray[k].getAnswer()+"</h3>");
		}
	};
	this._init(initVariable);
	
	return this;
};

Question.prototype.displayCharacter = function() {
	this.characterElement = $("#chinese-character");
	this.characterElement.text(this.stemObject);
};
Question.prototype.displayAnswers = function() {
	for(var k=0; k < this.answersArray.length; k++) {
		this.answersArray[k].display();
	}
	$("#answer1").bind(clickEvents, answerClick);
	$("#answer2").bind(clickEvents, answerClick);
	$("#answer3").bind(clickEvents, answerClick);
	$("#answer4").bind(clickEvents, answerClick);
	//$("#answer5").bind(clickEvents, answerClick);
};
Question.prototype.displayCounter = function(current, total) {
	this.counterElement = $("#counter");
	this.counterElement.html("<h1>"+(current+1)+"/"+total+"</h1>");	
};
Question.prototype.answerClick = function(clickedElement) {
	//If the answer has already been clicked, return. Else mark it as clicked.
	for(var j=0; j<this.answersArray.length; j++) {
		if(this.answersArray[j].getAnswerElement() == "#"+$(clickedElement).attr("id")) {
			if(this.answersArray[j].getClicked() == true) {return;}
			else {this.answersArray[j].setClicked(true);}
		}
	}
	
	$("#status-holder").css("display","block");
	this.incorrectIndicator = $("#status-correct-prompt");
	this.incorrectIndicator.removeClass("hidden");
	this.incorrectIndicator.addClass("visible");
	window.setTimeout("$(\"#status-correct-prompt\").removeClass(\"visible\");$(\"#status-correct-prompt\").addClass(\"hidden\");", 500);
	window.setTimeout("$(\"#status-holder\").css(\"display\",\"none\");",750);
	
	if ("#"+$(clickedElement).attr("id") == this.getRightAnswer().answerElement) {
		this.correctnessDivs = $(".correct,.incorrect");
		this.correctnessDivs.removeClass("incorrect");
		this.correctnessDivs.addClass("correct");
		this.correct = "Correct!";
		$(clickedElement).find(".status-marker-check").css("display","inline");
		if(!this.answerIsChosen)
			correctStatusCounter++;
		this.answerIsChosen = true;
	}
	else {
		this.correctnessDivs = $(".correct,.incorrect");
		this.correctnessDivs.removeClass("correct");
		this.correctnessDivs.addClass("incorrect");
		this.correct = "Incorrect!";
		$(clickedElement).find(".status-marker-x").css("display","inline");
		if(!this.answerIsChosen)
			incorrectStatusCounter++;
		this.answerIsChosen = true;
	}
	$("#status-correct-display").text(this.correct);
	displayAnswerCounter();
};


function Answer (initVariable) {
	this.answer;
	this.answerElement;
	this.answerHTML;
	this.correct = new Boolean();
	this.clicked = false;
	
	this.getAnswer = function() {return this.answer;}
	this.setAnswer = function(i) {
		this.answer = i;
		return (this.answer === i);
	}
	this.getAnswerElement = function() {return this.answerElement;}
	this.setAnswerElement = function(i) {
		this.answerElement = i;
		return (this.answerElement === i);
	}
	this.getAnswerHTML = function() {return this.answerHTML;}
	this.setAnswerHTML = function(i) {
		this.answerHTML = i;
		this.display();
		return (this.answerHTML === i);
	}
	this.getCorrectBool = function() {return this.correct;}
	this.setCorrectBool = function(i) {
		this.correct = i;
		return (this.correct === i);
	}
	this.getClicked = function() {return this.clicked;}
	this.setClicked = function(i) {
		this.clicked = i;
		return (this.clicked === i);
	}
	this.display = function() {
		if(this.getClicked() == true) {
			if(this.getCorrectBool() == true)
				$(this.answerElement).html("<span>@</span><i class=\"status-marker-check\" style=\"display:inline\">%</i><i class=\"status-marker-x\" style=\"display:none\">X</i><h3>"+this.answer+"</h3>");
			else
				$(this.answerElement).html("<span>@</span><i class=\"status-marker-check\" style=\"display:none\">%</i><i class=\"status-marker-x\" style=\"display:inline\">X</i><h3>"+this.answer+"</h3>");
		}
		else {
			$(this.answerElement).html(this.answerHTML);
			return true;
		}
	}
	
	this._init = function(initVariable) {
		if(typeof initVariable == "undefined")
			initVariable = {};
		//set answer
		if(typeof initVariable["answer"] == "undefined")
			this.setAnswer("default-path");
		else
			this.setAnswer(initVariable["answer"]);
		//set bool
		if(typeof initVariable["correct"] == "undefined")
			this.setCorrectBool("default-path");
		else
			this.setCorrectBool(initVariable["correct"]);
	}
	this._init(initVariable);
}


var shuffle = function(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

/*//	These should be set to the ID of their corresponding elements.
var jplayerElementId = "#jPlayer";
var playButtonId = "#playMe";
var clickableElementHolder = "#character-list";
var clickableElementType = "span";
var clickableElementContentKey = "chinese-character";
var clickableElementTitleKey = "translation";
var addWhiteSpaceToOutput = true;
//	This should be the path to your "default" mp3 file.
var singleAudioFile = "audio/All-Chinese.mp3";
//	This should be the path to your config json file.
var jsonConfigFile = "includes/assets/characters.json";
*/
//IsLog.c("The current width is "+$(window).width() + "px");
//IsLog.c("v=1.1.5");
//var playNotReady = $("<span>Files not ready: "+cacheProperties.filesDownloaded+ "</span>");
//playNotReady.attr("id", "play-not-ready");


var bindEvents = (isiPad || isiPhone)?"touchstart":"click";
//	This is set here so it can be removed and re-added appropriately.
var timeupdateHandler = function(event) {
	if($(this).attr("stop-time")) {
		if(parseFloat($(this).attr("stop-time")) <= event.jPlayer.status.currentTime) {
			IsLog.c("Reached the end of the intended sound. Stopping jPlayer.");
			$(this).jPlayer("stop");
		} else {
			IsLog.c("Current time index: "+event.jPlayer.status.currentTime+" has not yet reached the end: "+parseFloat($(this).attr("stop-time")));
		}
	} else {
		IsLog.c("Can't play a part of the file because no stop time has been set.");
		$(this).jPlayer("stop");
	}
};

if(jplayerElementId != undefined) {
var playButtonHandler = function(event) {
	//	First, detect if there is a start time. If there isn't, then we don't know which section to play!
	if($(jplayerElementId).attr("start-time")) {
		//	Detect if the path to the mp3 has changed. If not, then there's no need to reload anything, simply play it.
		//		If it has, then load the new file.
		if($(jplayerElementId).data("jPlayer").status.src != $(jplayerElementId).attr("audio-file-path")) {
			//	This debug shows us the actual path jPlayer will be loading. This allows us to make sure that it had changed appropriately.
			IsLog.c("New mp3 file requested. ("+$(jplayerElementId).attr("audio-file-path")+")");
			//	This step is REQUIRED. If you don't unbind the timeupdate handler the browser gets stuck in an infinite loop.
			$(jplayerElementId).unbind($.jPlayer.event.timeupdate);
			//	This step is only required because we don't want to accidentally play the wrong file.
			$(jplayerElementId).jPlayer("clearMedia");
			//	Here's where the heavy lifting comes in. This line does everything else, setMedia > bind timeupdate > play
			$(jplayerElementId).jPlayer("setMedia",
				{"mp3":	 $(jplayerElementId).attr("audio-file-path") }
			).bind($.jPlayer.event.timeupdate, timeupdateHandler).jPlayer( "play", parseFloat($(jplayerElementId).attr("start-time")) );
		} else {
			//	Else!? play it, nothing significant has changed!
			$(jplayerElementId).jPlayer( "play", parseFloat($(jplayerElementId).attr("start-time")) );
		}
		//	Now for final debug. This provides us with enough information to see everything that could or should have happened.
		IsLog.c(
			"MP3 should now be playing \"" + $(jplayerElementId).data("jPlayer").status.src + "\" " +
			"from:"		+	$(jplayerElementId).attr("start-time") + " " + 
			"to:"		+	$(jplayerElementId).attr("stop-time")
		);
	} else {
		IsLog.c("failed to play \"" + $(jplayerElementId).data("jPlayer").status.src + "\" because there was no start time set.");
	}
}
//need these variable to be global to access from the application cache
var percentLoadedHolder = $("<div></div>");
percentLoadedHolder.attr("id", "percent-loaded-holder");
var percentLoaded = $("<div>&nbsp;</div>");
percentLoaded.attr("id", "percent-loaded");

var playButton = $("<span>2</span>");
playButton.attr("id", "play-button");

var displayLesson = function(displayArray){
	var targetHolder = $(clickableElementHolder);
	for(var objNumber=0; objNumber < displayArray.length; objNumber++) {
		//	Now create an element based on that data, grabbing the element type and the intended content from the keys defined at the top of the page.
		var newElement = $("<"+clickableElementType+"><"+contentElementType+">"+displayArray[objNumber][clickableElementContentKey]+"</"+contentElementType+"></"+clickableElementType+">");
		//	Just for fun, lets add a title based on the value of the object at the key defined at the top of the page. (and let's remove any HTML tyle formatting from it.)
		newElement.attr("title", $("<div></div").html(displayArray[objNumber][clickableElementTitleKey]).text());
		//	Store the audio file path in the new element, so that when it is clicked that data can be set to our jPlayer element.
		newElement.attr("audio-file-path", displayArray[objNumber]["mp3"]);
		//	Also store the start and end times for the same reason.
		newElement.attr("start-time", displayArray[objNumber]["start-time"]);
		newElement.attr("stop-time", displayArray[objNumber]["stop-time"]);
		//	I've added white-space here optionally, it can help keep the output spaced out if you're not adding any space with CSS
		if(addWhiteSpaceToOutput)
			newElement.append(document.createTextNode(" "));
			
		//	This section is specific for the vocab page...
		newElement.attr("lesson", displayArray[objNumber]["lesson"]);
		newElement.attr("chinese-character", displayArray[objNumber]["chinese-character"]);
		newElement.attr("pronunciation", displayArray[objNumber]["pronunciation"]);
		newElement.attr("translation", displayArray[objNumber]["translation"]);
		newElement.addClass(defaultElementClasses);
		
		//	Now that we have an element with all the data loaded into it... append it.
		targetHolder.append(newElement);
		//	Now that it is on the document, add the click handler
		
		newElement.bind(bindEvents, function(event){
			$(jplayerElementId).jPlayer("clearMedia");
			//	Begin custom logic for the vocab page.
			$("#lesson-title").html($(this).attr("lesson"));
			var cc = $("#chinese-character");
			cc.html($(this).attr("chinese-character"));
			cc.removeClass("Char4");
			cc.removeClass("Char3");
			cc.removeClass("Char2");
			cc.removeClass("Char1");
			if($(this).attr("chinese-character").length >= 4) {
				cc.addClass("Char4");
			} else if($(this).attr("chinese-character").length >= 3) {
				cc.addClass("Char3");
			} else if($(this).attr("chinese-character").length >= 2) {
				cc.addClass("Char2");
			} else {
				cc.addClass("Char1");
			}
			$("#pronunciation").html($(this).attr("pronunciation"));
			$("#translation").html($(this).attr("translation"));
			
			$(".click_background").removeClass("click_background");
			$(this).addClass(clickableElementClasses);
			IsLog.c("this: "+this);
			IsLog.c("$(this): "+$(this));
			IsLog.c("this class: "+$(this).attr("class"));
			
			IsLog.c($("#chinese-character").parent());
			$("#chinese-character").parent().unbind();
			if($(this).attr("audio-file-path") != undefined && $(this).attr("audio-file-path") != "undefined") {
				IsLog.c("jPlayer muted:");
				IsLog.c($("#jPlayer").jPlayer("unmute"));
				IsLog.c("clicked thumbnail has mp3=\""+$(this).attr("audio-file-path")+"\"");
				
				playButton.css("display", "inline-block");
				/*var playNotReady = $("<span>X</span>");
				playNotReady.attr("id", "play-not-ready");*/
				IsLog.c("mp3 url: \""+$(this).attr("audio-file-path")+"\"");
				$("#chinese-character").append(playButton);
				/*$("#chinese-character").append(playNotReady);*/
				$("#chinese-character").parent().bind(bindEvents, playButtonHandler);
				//these perecent holders are for the cache loading display.
				if (appCache.status != appCache.IDLE) {
					
					percentLoadedHolder.css({
						'background-color':	'white',
						'height':			'0.25em',
						'width':			'1.25em',
						'margin':			'0',
						'padding':			'0',
						'display':			'block',
						'border':			'1px solid black'
					});
					percentLoaded.css({
						"background-image":	"url(images/backgrounds/click-background3.png)",
						'width':			(typeof cacheProperties == "object" && !isNaN(cacheProperties.filesDownloaded / cacheProperties.totalFiles))?parseInt((cacheProperties.filesDownloaded / cacheProperties.totalFiles)*100)+"%":"0%",
						'height': 			'inherit',
						'margin':			'0',
						'padding':			'0',
						'font-family':		"'Helvetica', 'Arial'",
						'font-size':		'7.5pt',
						'text-align':		'center',
						'vertical-align':	'middle',
						'overflow':			'hidden'
					});
					if(typeof cacheProperties == "object" && !isNaN(cacheProperties.filesDownloaded / cacheProperties.totalFiles))
						percentLoaded.text(parseInt((cacheProperties.filesDownloaded / cacheProperties.totalFiles)*100)+"% ready");
					
					percentLoadedHolder.append(percentLoaded);
					playButton.append(percentLoadedHolder);
				} else {
					percentLoadedHolder.remove();
				}
			}
			if (appCache.status == appCache.IDLE) {
				percentLoadedHolder.remove(); //not sure that its necessary to have this.
				//playButton.remove(percentLoadedHolder);
				IsLog.c('removed the loader');
			}
			//	End custom logic for the vocab page.
			$(jplayerElementId).attr("audio-file-path", $(this).attr("audio-file-path"));
			//	The start time and end times will change each time we "load" a new character. The mp3 should remain and the file should play immediately (if it hasn't changed).
			if($(this).attr("audio-file-path").indexOf("audio/All-Chinese.mp3") > -1) {
				$(jplayerElementId).attr("start-time", $(this).attr("start-time"));
				$(jplayerElementId).attr("stop-time", $(this).attr("stop-time"));
			} else {
				$(jplayerElementId).attr("start-time", 0);
				$(jplayerElementId).attr("stop-time", 100);
			}
			//	Here we detect if the file path has changed, if it has we pre-load the new mp3.
			if($(jplayerElementId).data("jPlayer").status.src != $(jplayerElementId).attr("audio-file-path")) {
				IsLog.c("New mp3 file requested. ("+$(jplayerElementId).attr("audio-file-path")+")");
				//	This step is REQUIRED. If you don't unbind the timeupdate handler the browser gets stuck in an infinite loop.
				$(jplayerElementId).unbind($.jPlayer.event.timeupdate);
				//	Now we clear the media so we won't end up playing the wrong file.
				$(jplayerElementId).jPlayer("clearMedia");
				//	Here's where the heavy lifting comes in. This line does everything else, setMedia > bind timeupdate > load
				$(jplayerElementId).jPlayer("setMedia",
					{"mp3":	 $(jplayerElementId).attr("audio-file-path") }
				).bind($.jPlayer.event.timeupdate, timeupdateHandler).jPlayer( "load" );
				//	It may be important to note I've added some redundancy here. The same effect is produced in the "play" element click handler.
				//	If for any reason this one fails and doesn't produce an infinite loop which brings down javascript, then that handler will still function and the effect will be as intended.
			} else {
				//	If there is no change, then still load the mp3. This may save us a brief moment of lag if the mp3 was not yet cued for download. If it was, then this will simply return complete immediately.
				$(jplayerElementId).jPlayer( "load" );
			}
			//IsLog.c("charactersObject has been selected: \""+$(this).attr("audio-file-path")+"\"");
		});
	}
};
var displayLessons = function(charactersObject, selectedLesson) {
	var targetHolder = $(clickableElementHolder);
	IsLog.c(targetHolder.find(">:first-child"));
	//	Empty the holder
	targetHolder.html("");
	if(typeof selectedLesson != "undefined" && typeof charactersObject == "object" && selectedLesson != "All Characters") {
		//IsLog.c("Selected Lesson is: " + selectedLesson);
		//	This if statemet is not fuctioning the way we hoped. we expected it to make all characters show on without scrolling when different lessons are selected.
		//	We will add this functionality at the end if we decide that it is necessary
		/*if (screen.width > 767) {
			IsLog.c("We came into the width if statement");
				$(".vocab_vocab").css({
					'width':'60%'
				});
		}*/
		if(typeof charactersObject[selectedLesson] != "undefined")
			displayLesson(charactersObject[selectedLesson]);
		else{
			IsLog.c("error: charactersObject[\""+selectedLesson+"\"] is undefined");	
		}
	} else if (typeof charactersObject == "object") {
		for(var jsonFirstLevelKey in charactersObject) {
			//	Iterate through the lesson items (each is an object)
			displayLesson(charactersObject[jsonFirstLevelKey]);
			//IsLog.c(jsonFirstLevelKey);
			//creates the lesson title for the dropdown menu
		}
	} else if (typeof charactersObject != "object") {
		IsLog.c("error: charactersObject invalid \""+(typeof characterObject)+"\"")
	}
		
};
	//	When the document is ready, load the jPlayer.
	$(document).ready(function() {
		/*This if statement is do display only the home nav on the iPhone while still displaying all on the iPad*/
		if ($(window).width() < 569) {  
			//IsLog.c(isiPhone + " is iPhone");
		} else {
			var ipadNav = $("nav");
			ipadNav.html("<a href=\"index.html\">Home</a><a href=\"vocab.html\">Vocabulary</a><a href=\"Quiz_Menu.html\">Quiz</a><a href=\"contact_us.html\">Contact Us</a><a href=\"help_page.html?v=1\">Help Page</a>");
			//IsLog.c(ipadNav);
			//IsLog.c(isiPad + " is iPad");
		}
		/*This is used for the drop-up menu on iphone*/
		for(var i=0; i < $(".iPhoneMenu").length; i++) {
			var menu= $($(".iPhoneMenu")[i]);
			menu.click(function() {
				if($("#"+$(this).attr("showId")).css("display") != "block")	
					$("#"+$(this).attr("showId")).css("display", "block");
				else
					$("#"+$(this).attr("showId")).css("display", " none");
			});
		}
		$(jplayerElementId).jPlayer({
			"ready": function () {
				IsLog.c("jPlayer ready event fired. Loading mp3: \""+singleAudioFile+"\"");
				//	Set the media and load it (so we're ready to play it as soon as the "play" element is clicked.
				$(this).jPlayer("setMedia", {"mp3":	singleAudioFile } ).jPlayer("load");
				//	Set the timeupdateHandler so the sound is stopped before it plays everything.
				$(jplayerElementId).bind($.jPlayer.event.timeupdate, timeupdateHandler);
			},
			//	An error handler is handy in case there are problems.
			"error": function(event) {
				IsLog.c("Error: jPlayer error \""+event.jPlayer.error.message+"\"");
			},
			//	Sometimes you like to know when the download is finished. This provides that (mostly, it doesn't exactly tell you when it's done. It only alerts you that it is either done or not when the sound is played).
			"progress": function(event) {
				if(parseInt(event.jPlayer.status.readyState) != 4) {
					IsLog.c("download still in progress! "+event.jPlayer.status.readyState);
				}
			},
			//	I have personally never seen this event fire. I don't know when it would, since I have seen the player stall without firing this event.
			"stalled": function(event) {
				IsLog.c("Error: jPlayer stalled!");
				IsLog.c(event.jPlayer.status);
			},
			//	We're only working with mp3 files...
			"supplied": "mp3"
		});
		
		//	It's always safer to first unbind events when you want a clean environment - if there are none, then none will be unbound
		$(playButtonId).unbind();
		//	We only need to set this click once because the same event will work even after files change.
		//$(playButtonId).bind("click touch touchstart", playButtonHandler);
	});
	
	//	Here we request our page data.
	var characters = {};
	$.getJSON(jsonConfigFile, function(jsonAjaxResult){
		characters = jsonAjaxResult;
		$("#lesson-select").append($("<option id=\"all-characters-option\">All Characters</option> "));
		for(var jsonFirstLevelKey in jsonAjaxResult) {
			$("#lesson-select").append($("<option>"+jsonFirstLevelKey+"</option>"));
		}
			//	Iterate through our data - it has 2 basic levels 1) the "lesson" and 2) the lesson item in an object
		//	First we loop through the lessons (lessonName is the jsonFirstLevelKey
		$("#lesson-select").bind("change", function(){
			var selectedIndex = ($("<b></b>").html($(this).val())).html();
			displayLessons(characters, selectedIndex);
		});
		
		displayLessons(characters);
		//IsLog.c("THis is the lesson select");
		//IsLog.c($("#lesson-select"));
		//IsLog.c($("#all-characters-option"));
		/*if(!$("#all-characters-option")){
			IsLog.c("WE CAME INTO THE STATEMENT");
			if (screen.width > 767) {
				$(".vocab_vocab").css({
					'width':'100%'
				});
			}
		}*/
	
		//$(jplayerElementId).unbind($.jPlayer.event.timeupdate);
	window.setTimeout("$(\""+clickableElementHolder+"\").find(\">:first-child\").trigger('"+bindEvents+"');",250);
	}).error(function(jqXHR, textStatus, errorThrown) { IsLog.c("error getting .json "+ textStatus+": \""+errorThrown+"\""); });
	
}

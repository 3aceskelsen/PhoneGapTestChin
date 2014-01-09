
var isiPad   = navigator.userAgent.indexOf('iPad')   != -1;
var isiPhone = navigator.userAgent.indexOf('iPhone') != -1;


$(document).ready(function() {							
	$(function() {
		$.stayInWebApp();		
		displayAddToHomescreen();
	});
	
	/*The left scroll is only needed on iPad because of the break in display upon rotation. But if used on iPhone, scrolling don't function vertically.*/
	if(window.isiPad) {
		$(window).bind('orientationchange resize', function(event){
			$(window).scrollTop(0);
			IsLog.c('scrolling on iPad');
			//$(window).scrollLeft(0);
		});
	}
});


/*if it isn't an iOS device, a message will be displayed saying to visit on an iOS device*/	
function visitIOSDevice(){
	if(window.isiPad || window.isiPhone) {
	}else{
		$('.page').css('display','none');
		$('body').css('background-color','#fff').append('<a href="mailto:?subject=Check%20out%20this%20Chinese%20Web%20App%20for%20iPad%20and%20iPhone&amp;body=Email%20yourself%20this%20link%20and%20open%20it%20in%20your%20iPad%20or%20iPhone%20to%20add%20this%20Web%20App%20to%20your%20iDevice"><img src="images/backgrounds/byu_no_ipad.png"/></a>');
	}
}


function displayAddToHomescreen(){			/*if iPad is in a navigator, will show video saying add to home screen*/
	if(window.navigator.standalone == false) {
		$('.page').css('display','none');
		$('body').css('background-color','#fff').append('<video width="100%" height="100%" controls> <source src="images/Final-.mov"/> type="video/mov "')
	}
	else if(!(/loading_screen\.html/i).test(window.location.href)){
		// We're ready to load the cache!
		//window.setTimeout("window.location = 'loading_screen.html';", 500);
	}
}


function updateSite(event) {
    window.applicationCache.swapCache();
}


window.applicationCache.addEventListener('updateready',
    updateSite, false);
	// on page load.
window.addEventListener('load', function(e) {
  //Check if a new cache is available 
  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      // Swap it in and reload the page to get the new version.
      window.applicationCache.swapCache();
      if (confirm('A new version of this site is available. Load it?')) {
        window.location.reload();
      }
    } else {
      // Manifest has not changed. Nothing new yet.
    }
  }, false);

}, false);


function logEvent(event) {
      IsLog.c(event);
  } 
  window.applicationCache.addEventListener('checking',logEvent,false);
  window.applicationCache.addEventListener('noupdate',logEvent,false);
  window.applicationCache.addEventListener('downloading',logEvent,false);
  window.applicationCache.addEventListener('cached',logEvent,false);
  window.applicationCache.addEventListener('updateready',logEvent,false);
  window.applicationCache.addEventListener('obsolete',logEvent,false);
  window.applicationCache.addEventListener('error',logEvent,false);
  
  
function showLoc() {
	var oLocation = window.location, aLog = ["Property (Typeof): Value", "window.location (" + (typeof oLocation) + "): " + oLocation ];
	for (var sProp in oLocation){
		aLog.push(sProp + " (" + (typeof oLocation[sProp]) + "): " +  (oLocation[sProp] || "n/a"));
	}
	alert(aLog.join("\n"));
}
  
  
  
  
  
  
  
  
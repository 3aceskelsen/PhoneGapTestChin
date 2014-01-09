$(document).ready(function() {
	//var appCacheThing = new ApplicationCachePreloader(function() { IsLog.c("Cache completed?"); }, new ProgressMonitor, true);
	//IsLog.c(appCacheThing);
	//IsLog.c("Page loaded!!! 4.1.5");
	// Check if a new cache is available on page load.
	window.addEventListener('load', function(e) {
	
		window.applicationCache.addEventListener('updateready', function(e) {
			if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
			// Browser downloaded a new app cache.
			// Swap it in and reload the page to get the new hotness.
			window.applicationCache.swapCache();
			if (confirm('A new version of this site is available. Load it?')) {
				window.location.reload();
			}
		} else {
			// Manifest didn't changed. Nothing new to server.
		}
		}, false);
		
	}, false);
	function handleCacheEvent(e) {
	//write code needed to execute below also create new functions that wil be needed.
		if (appCache.status == appCache.UNCACHED) {
			//IsLog.c("cache is uncached");
			displayAddToHomescreen();
		}
		if(appCache.status == appCache.IDLE){
			//IsLog.c("Cache is IDLE");
			//IsLog.c(percentLoadedHolder);
			//IsLog.c(playButton);
			percentLoadedHolder.remove();
			//IsLog.c('removed the load indicator');
		}
		if(appCache.status == appCache.CHECKING){
			IsLog.c("Cache is CHECKING");
		}
		if(appCache.status == appCache.DOWNLOADING){
			IsLog.c("Cache is DOWNLOADING");
			//$("#chinese-character").append(playNotReady);
		}
		if(appCache.status == appCache.UPDATEREADY){
			//IsLog.c("there is an UPDATEREADY");
		}
		if(appCache.status == appCache.OBSOLETE){
			//IsLog.c("cache is OBSOLETE");
		}
	}
	function handleCacheError(e) {
		//	Code a if statement that allows this alert to work, but only when the iOS device is connected to the internet
		//alert('Error: Cache failed to update! May not work offline');
	};
	
	// Fired after the first cache of the manifest.
	appCache.addEventListener('cached', handleCacheEvent, false);
	
	// Checking for an update. Always the first event fired in the sequence.
	appCache.addEventListener('checking', handleCacheEvent, false);
	
	// An update was found. The browser is fetching resources.
	appCache.addEventListener('downloading', handleCacheEvent, false);
	
	// The manifest returns 404 or 410, the download failed,
	// or the manifest changed while the download was in progress.
	appCache.addEventListener('error', handleCacheError, false);
	
	// Fired after the first download of the manifest.
	appCache.addEventListener('noupdate', handleCacheEvent, false);
	
	// Fired if the manifest file returns a 404 or 410.
	// This results in the application cache being deleted.
	appCache.addEventListener('obsolete', handleCacheEvent, false);
	
	// Fired for each resource listed in the manifest as it is being fetched.
	appCache.addEventListener('progress', handleCacheEvent, false);
	
	// Fired when the manifest resources have been newly redownloaded.
	appCache.addEventListener('updateready', handleCacheEvent, false);
	/*window.applicationCache.addEventListener('checking', function() {
		IsLog.c('is currently checking');	
	});*/
});
var appCache = window.applicationCache;
var checkCache = function() {
	switch (appCache.status) {
	  case appCache.UNCACHED: // UNCACHED == 0
		return 'UNCACHED';
		break;
	  case appCache.IDLE: // IDLE == 1
		return 'IDLE';
		break;
	  case appCache.CHECKING: // CHECKING == 2
		return 'CHECKING';
		break;
	  case appCache.DOWNLOADING: // DOWNLOADING == 3
		return 'DOWNLOADING';
		break;
	  case appCache.UPDATEREADY:  // UPDATEREADY == 4
		return 'UPDATEREADY';
		break;
	  case appCache.OBSOLETE: // OBSOLETE == 5
		return 'OBSOLETE';
		break;
	  default:
		return 'UKNOWN CACHE STATUS';
		break;
	};
	return 'ERROR: THIS SHOULDN\'T HAPPEN';
}

appCache.update();
if (appCache.status == window.applicationCache.UPDATEREADY) {
	//IsLog.c("Swapping in the new cache...");
	appCache.swapCache();  // The fetch was successful, swap in the new cache.
	
}
/*var intervalId = window.setInterval("//IsLog.c(\"Cache status: '\"+checkCache()+\"'\");", 1000);
window.setTimeout("window.clearInterval(intervalId);",10000);*/
var cacheProperties = {
	filesDownloaded: 0,
	totalFiles: 0,
	files: []
};

// I get the total number of files in the cache manifest.
// I do this by manually parsing the manifest file.
cacheProperties.filesDownloaded = 0;
cacheProperties.totalFiles = 0;
function getTotalFiles(){
	// First, reset the total file count and download count.
	// Now, grab the cache manifest file.
	$.ajax({
		type: "get",
		url: "offline/cache.manifest",
		dataType: "text",
		cache: false,
		success: function( content ){
			// Strip out the non-cache sections.
			// NOTE: The line break here is only to prevent
			// wrapping in the BLOG.
			content = content.replace(/(NETWORK|FALLBACK):((?!(NETWORK|FALLBACK|CACHE):)[\w\W]*)/gi,"");
			 
			// Strip out all comments.
			content = content.replace(
			new RegExp( "#[^\\r\\n]*(\\r\\n?|\\n)", "g" ),
			""
			);
			 
			// Strip out the cache manifest header and
			// trailing slashes.
			content = content.replace(
			new RegExp( "CACHE MANIFEST\\s*|CACHE:[^\\r\\n]*|\\s*$", "g" ),
			""
			);
			 
			// Strip out extra line breaks and replace with
			// a hash sign that we can break on.
			content = content.replace(
			new RegExp( "[\\r\\n]+", "g" ),
			"#"
			);
			 
			// Get the total number of files.
			var totalFiles = content.split( "#" ).length;
			 
			// Store the total number of files. Here, we are
			// adding one for *THIS* file, which is cached
			// implicitly as it points to the manifest.
			cacheProperties.totalFiles = (totalFiles + 1);
			//IsLog.c("Manifest file contained "+totalFiles+" file entries in the \"CACHE:\" section.");
		}
	});
}

$( appCache ).bind("downloading", function( event ){
	IsLog.c( "Downloading cache" );	 
	// Get the total number of files in our manifest.
	getTotalFiles();
	displayProgress();
});
	// I display the download progress.
	IsLog.c(appCache.DOWNLOADING +" Is downloading");

function displayProgress(){
	var playNotReady = $("#play-not-ready");
	if(playNotReady.length == 0) {
		playNotReady = $("<span></span>");
		playNotReady.attr('id','play-not-ready').appendTo($('#chinese-character').parent());
	}
	var progressDisplay = $("#percent-loaded");
	//	 Increment the running total.
	cacheProperties.filesDownloaded++;
	IsLog.c("running total= " + cacheProperties.filesDownloaded); 
	//var playNotReady = $("#play-not-ready");
	// Check to see if we have a total number of files.
	if (cacheProperties.totalFiles){	 
		// We have the total number of files, so output the
		// running total as a function of the known total.
		//playNotReady.text(cacheProperties.filesDownloaded +" of "+ cacheProperties.totalFiles + " files downloaded.");
		//cacheProgress.text(cacheProperties.filesDownloaded +" of " +cacheProperties.totalFiles +" files downloaded.");
		if(progressDisplay) {
			progressDisplay.text(parseInt((cacheProperties.filesDownloaded / cacheProperties.totalFiles)*100)+"%");
			progressDisplay.css("width",((cacheProperties.filesDownloaded / cacheProperties.totalFiles)*100)+"%");
		}
		//IsLog.c('we came into the if statement');	 
	} else {
	 
		// We don't yet know the total number of files, so
		// just output the running total.
		//playNotReady.text(cacheProperties.filesDownloaded +" files downloaded");
		//IsLog.c('We entered the else statement');
		//cacheProgress.text(cacheProperties.filesDownloaded +" files downloaded.");	 
	}
}
$( appCache ).bind("progress",function( event ){
	IsLog.c( "File downloaded" );
	// Show the download progress.
	displayProgress();
});
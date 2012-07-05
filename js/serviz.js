(function() {
    var loadMe = function() {
		if ("Serviz" in window) {
            return;
        }
        
        window.Serviz = new Object();
        
        window.Serviz.fromLogToTimeline = function(logObj) {
        	var tlObj = new Object();
        	tlObj['wiki-url'] = "http://simile.mit.edu/shelf/";
        	tlObj['wiki-section'] = "Simile JFK Timeline";
        	tlObj.dateTimeFormat = "Gregorian";
        	tlObj.events = [];
        	
			jQuery.each(logObj, function(i, val) {
				var eventObj = new Object();
				
				eventObj.start = new Date(parseInt(i));
				eventObj.durationEvent = false;
				eventObj.title = "Configuration changed";
				eventObj.description = "<input type=\"button\" value=\"Load Configuration\" onclick=\"loadStaticConfig("+val[0][val[0].length-1]+")\"/>";
				
				tlObj.events.push(eventObj);
			});
			
			return tlObj;
        }
	}
	
	loadMe();
})();


// { 
  // "wiki-url":"http://simile.mit.edu/shelf/", 
  // "wiki-section":"Simile JFK Timeline", 
  // "dateTimeFormat": "Gregorian",
  // "events": [
    // {
       // "start":"Sat May 20 2012 00:00:00 GMT-0600",
       // "title":"'Bay of Pigs' Invasion",
       // "durationEvent":false
     // }, {
       // "start":"Wed May 01 2012 00:00:00 GMT-0600" ,
       // "end":"Sat Jun 01 2012 00:00:00 GMT-0600" ,
       // "durationEvent":true,
       // "title":"Oswald moves to New Orleans",
       // "description":"Oswald moves to New Orleans, and finds employment at the William B. Riley Coffee Company. ref. Treachery in Dallas, p 320"
     // } ] 
// }
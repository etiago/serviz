(function() {
	if ("Serviz" in window) {
        return;
    }

	window.Serviz = new Object();  
					  
    window.Serviz.load = function() {
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
	        
	    window.Serviz.onDateChanged = function() {
				// Housekeeping to make sure the user sets correct dates
				if (this.id == "datestart") {
					var start = $(this).datetimepicker('getDate');
				    $('#dateend').datetimepicker('option', 'minDate', new Date(start.getTime()));
				} else if (this.id == "dateend") {
					var end = $(this).datetimepicker('getDate');
				    $('#datestart').datetimepicker('option', 'maxDate', new Date(end.getTime()) );
				}
	
	            var dateStart = new Date($("#datestart").val());
	            var dateEnd = new Date($("#dateend").val());
	            
	            // Make sure the dates are valid (i.e. the user didn't mess them manually')
	            if ( Object.prototype.toString.call(dateStart) === "[object Date]" ) {
					  if ( isNaN( dateStart.getTime() ) ) {  // d.valueOf() could also work
					  	return;
					  }
				} else {
					return;
				}
				
				if ( Object.prototype.toString.call(dateEnd) === "[object Date]" ) {
					  if ( isNaN( dateEnd.getTime() ) ) {  // d.valueOf() could also work
					  	return;
					  }
				} else {
					return;
				}
				
				// Should not happen, preventing user from doing it
				if (dateStart > dateEnd) {
					return;
				}
				
	
				// Create a theme for the highlight
				var theme = Timeline.ClassicTheme.create();
	            theme.event.bubble.width = 250;
	
				// If both decorators are null, it's the first time, create them
	            if (window.Serviz.decoratorUp == null || window.Serviz.decoratorDown == null) {
		            window.Serviz.decoratorUp = new Timeline.SpanHighlightDecorator({
					                        startDate:  dateStart,
					                        endDate:    dateEnd,
					                        color:      "#FFC080", // set color explicitly
					                        opacity:    50,
					                        startLabel: "Start",
					                        endLabel:   "End",
					                        theme:      theme
					                   });
					
					window.Serviz.decoratorDown = jQuery.extend(true, {}, window.Serviz.decoratorUp);
	
					tl.getBand(0).addDecorator(window.Serviz.decoratorUp);
					tl.getBand(1).addDecorator(window.Serviz.decoratorDown);
				} else {
					window.Serviz.decoratorUp._startDate = dateStart;
					window.Serviz.decoratorUp._endDate = dateEnd;
					window.Serviz.decoratorUp.paint();
					
					window.Serviz.decoratorDown._startDate = dateStart;
					window.Serviz.decoratorDown._endDate = dateEnd;
					window.Serviz.decoratorDown.paint();
				}
				reloadTimeline(dateStart, dateEnd);
				window.Serviz.Graffle.reloadGraph(dateStart, dateEnd);
			}
	    window.Serviz.initializeDateTimePickers = function() {
			// Configure the datepickers
			$('#datestart').datetimepicker({
			    onClose: function(dateText, inst) {
			        var endDateTextBox = $('#dateend');
			        if (endDateTextBox.val() != '') {
			            var testStartDate = new Date(dateText);
			            var testEndDate = new Date(endDateTextBox.val());
			            if (testStartDate > testEndDate)
			                endDateTextBox.val(dateText);
			        }
			        else {
			            endDateTextBox.val(dateText);
			        }
			    },
			    onSelect: window.Serviz.onDateChanged
			});
			$('#dateend').datetimepicker({
			    onClose: function(dateText, inst) {
			        var startDateTextBox = $('#datestart');
			        if (startDateTextBox.val() != '') {
			            var testStartDate = new Date(startDateTextBox.val());
			            var testEndDate = new Date(dateText);
			            if (testStartDate > testEndDate)
			                startDateTextBox.val(dateText);
			        }
			        else {
			            startDateTextBox.val(dateText);
			        }
			    },
			    onSelect: window.Serviz.onDateChanged
			});
			
			
			
						// Fix for the datepicker weirdness at the bottom of the page
			$('#ui-datepicker-div').css('display','none');
	
		}
			
		window.Serviz.callbacks = new Object();
		
		window.Serviz.callbacks.loadLatestStatic = function() {
			if (window.Serviz.Graffle.elements == null) {
				alert("First select a period, then you can load static configurations")
				return;
			}
			var d1 = new Date("January 1, 1970 00:00:00");
			var d2 = new Date();
			
			var url = window.location.origin+"/logdump/logdump?timestart="+d1.getTime()+"&timeend="+d2.getTime()+"&static=true";
	  
	  		var latestElement = null;
	  		var latestTime = 0;
	  		
		    $.getJSON(url, function(data) {
		    	
		    	jQuery.each(data, function(i, val) {
					if (i>=latestTime) {
						latestElement = val;
						latestTime = i;
					}
				});
				
				loadStaticConfig(latestElement[0][latestElement[0].length-1]);
			});  
			
			
		}
		
		window.Serviz.Graffle = new Object();
		window.Serviz.Graffle.elements = new Object();
		window.Serviz.Graffle.staticElements = new Object();
		window.Serviz.Graffle.connections = [];
		window.Serviz.Graffle.paper = Raphael("holder", 1024, 768);
			
		window.Serviz.Graffle.reloadGraph = function (dateStart, dateEnd) {
			var paperDom = window.Serviz.Graffle.paper.canvas;
	    	paperDom.parentNode.removeChild(paperDom);
			window.Serviz.Graffle.paper = Raphael("holder", 1024, 768);		
			
			var posX = 290;
			var posY = 180;
			var width = 60;
			var height = 40;
			var url = window.location.origin+'/logdump/logdump?timestart='+dateStart.getTime()+'&timeend='+dateEnd.getTime();
			
			$.getJSON(url, function(doc) {
				  window.Serviz.Graffle.elements = new Object();
				  window.Serviz.Graffle.staticElements = new Object();
				  
				  window.Serviz.availableUsernames.length = 0;
				  
				  window.Serviz.availableUsernames = doc.stats.usernames;
				  
				  $.each(doc.data, function(key, pair) {
					  //var ratio = pair.CNT / doc.stats.totalCalls
					  //var red = (ratio * 255).toString(16).substr(0,2)
					  //var green = ((1-ratio) * 255).toString(16).substr(0,2)
					  var color = Raphael.getRGB("#098009");
					  
					  //alert(pair.CONSUMER+"=>"+pair.SERVICE);
					  
					  var consumer;
					  if (pair.consumer in window.Serviz.Graffle.elements) {
					  	consumer = window.Serviz.Graffle.elements[pair.consumer];
					  } else {
						  consumer = window.Serviz.Graffle.paper.boxWithText(posX, posY, width, height, pair.consumer+"\nInvoked #"+pair.cnt+" times");
						  //consumer.move(100,100);
						  consumer.drag(onmove, onstart, onend);
						  consumer.attr({fill: color, "fill-opacity": 100, "stroke-width": 2, cursor: "move"});
						  
						  window.Serviz.Graffle.elements[pair.consumer] = consumer;
					  }
					  
					  var consMeth = consumer.addMethod(pair.consumer_method);
					  
					  var service;
					  if (pair.service in window.Serviz.Graffle.elements) {
						service = window.Serviz.Graffle.elements[pair.service];  
					  } else {
						  service = window.Serviz.Graffle.paper.boxWithText(posX+150, posY, width, height, pair.service+"\nInvoked #"+pair.cnt+" times");
						  //service.move(100,100);
		
						  service.drag(onmove, onstart, onend);
						  service.attr({fill: color, "fill-opacity": 100, "stroke-width": 2, cursor: "move"});
						  
						  window.Serviz.Graffle.elements[pair.service] = service;
					  }
					  var servMeth = service.addMethod(pair.service_method);
					  
					  var thickness = pair.cnt/doc.stats.totalCalls * 10;
					  window.Serviz.Graffle.connections.push(window.Serviz.Graffle.paper.connection(consMeth, servMeth, "#fff", "#fff|"+thickness));
				  });
			});
		
			$("#holder").qtip("destroy");
		}
	
		window.Serviz.status = new Object();
		
		// FIx static elements
		window.Serviz.status.staticVisible = false;
		window.Serviz.callbacks.toggleStatic = function() {
			if (window.Serviz.status.staticVisible) {
				$.each(window.Serviz.Graffle.staticElements, function(key, el) {
					el.hide();
					el.text.hide();
					window.Serviz.status.staticVisible = false;
				});
			} else {
				$.each(window.Serviz.Graffle.staticElements, function(key, el) {
					el.show();
					el.text.show();
					window.Serviz.status.staticVisible = true;
				});
			}
		}
			
		// Fix elements
		window.Serviz.callbacks.fullReset = function () {
			window.Serviz.Graffle.elements = null;
			var paperDom = window.Serviz.Graffle.paper.canvas;
			paperDom.parentNode.removeChild(paperDom);
			window.Serviz.Graffle.paper = Raphael("holder", 1024, 768);
			
			tl.dispose();
			loadTimeline();
			
			$('#datestart').val("");
			$('#dateend').val("");
		}
		
		$("#btnReset").click(window.Serviz.callbacks.fullReset);
		$("#btnLatestConfig").click(window.Serviz.callbacks.loadLatestStatic);
		$("#btnStaticToggle").click(window.Serviz.callbacks.toggleStatic);
		
		$("#period").click(function(){$("#periodMenu").slideToggle(function(){$("#menu").qtip('reposition');})});
		$("#users").click(function(){$("#usersMenu").slideToggle(function(){$("#menu").qtip('reposition');})});
		
		window.Serviz.QTip = new Object();
		window.Serviz.QTip.initialize = function() {
			$('#menu')
				.removeData('qtip') 
				.qtip({
					content: {
						text: 'Please select a start and end dates', 
						title: {
							text: 'Hint',
							button: true
						}
					},
					position: {
						my: 'top center', // Use the corner...
						at: 'bottom center' // ...and opposite corner
					},
					show: {
						event: false, // Don't specify a show event...
						ready: true // ... but show the tooltip when ready
					},
					hide: false, // Don't specify a hide event either!
					style: {
						classes: 'ui-tooltip-shadow ui-tooltip-green'
					}
				});
			$('#holder')
				.removeData('qtip') 
				.qtip({
					content: {
						text: 'Here you can visualize the relationships between services', 
						title: {
							text: 'Hint',
							button: true
						}
					},
					position: {
						my: 'middle left', // Use the corner...
						at: 'middle right' // ...and opposite corner
					},
					show: {
						event: false, // Don't specify a show event...
						ready: true // ... but show the tooltip when ready
					},
					hide: false, // Don't specify a hide event either!
					style: {
						classes: 'ui-tooltip-shadow ui-tooltip-green'
					}
				});
				
			$('#holder')
				.removeData('qtip') 
				.qtip({
					content: {
						text: 'You can go ahead and pick a date range in order to load some data...', 
						title: {
							text: 'By the way...',
							button: true
						}
					},
					position: {
						my: 'center', // Use the corner...
						at: 'center' // ...and opposite corner
					},
					show: {
						event: false, // Don't specify a show event...
						ready: true // ... but show the tooltip when ready
					},
					hide: false, // Don't specify a hide event either!
					style: {
						classes: 'ui-tooltip-shadow ui-tooltip-blue'
					}
				});
		}
		
		window.Serviz.initializeDateTimePickers();
		window.Serviz.QTip.initialize();
		
		window.Serviz.status.lastUser = 1;
		window.Serviz.status.lastVersion = 1;
		
		window.Serviz.callbacks.addVersion = function() {
			if (window.Serviz.status.lastVersion == 10) return;
			
			window.Serviz.status.lastVersion++;
			$("#addVersion").before('<div id="divVersion'+window.Serviz.status.lastVersion+'" class="versionPair" style="display:none;"> <select id="service'+window.Serviz.status.lastVersion+'"><option>Service</option></select> <select id="version'+window.Serviz.status.lastVersion+'"><option>Version (*)</option></select></div>');
			
			$("#divVersion"+window.Serviz.status.lastVersion).slideDown();
			
			$("#menu").qtip("reposition");
		};
		window.Serviz.callbacks.removeVersion = function() {
			if (window.Serviz.status.lastVersion == 1) return;
			
			$("#divVersion"+window.Serviz.status.lastVersion).slideUp(function() {
				$("#divVersion"+window.Serviz.status.lastVersion).remove();
				
				window.Serviz.status.lastVersion--;
				$("#menu").qtip("reposition");
			});
		}
		
		window.Serviz.callbacks.addUser = function() {
			if (window.Serviz.status.lastUser == 10) return;
			
			window.Serviz.status.lastUser++;
			$("#addUser").before('<div id="divUser'+window.Serviz.status.lastUser+'" style="display:none;">User #'+window.Serviz.status.lastUser+' <input name="user'+window.Serviz.status.lastUser+'" /><button type="submit"><img src="img/icon-magnifying-glass.png" alt="Search" /></button><br /></div>');
			
			$("#divUser"+window.Serviz.status.lastUser).slideDown();
			$("#menu").qtip("reposition");
		};
		window.Serviz.callbacks.removeUser = function() {
			if (window.Serviz.status.lastUser == 1) return;
			
			$("#divUser"+window.Serviz.status.lastUser).slideUp(function() {
				$("#divUser"+window.Serviz.status.lastUser).remove();	
				window.Serviz.status.lastUser--;
				
				$("#menu").qtip("reposition");
			});
		}
		
		$("#addVersionBtn").click(window.Serviz.callbacks.addVersion);
		$("#delVersionBtn").click(window.Serviz.callbacks.removeVersion);
		
		$("#addUserBtn").click(window.Serviz.callbacks.addUser);
		$("#delUserBtn").click(window.Serviz.callbacks.removeUser);
	}

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
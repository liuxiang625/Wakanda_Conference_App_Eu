
var pageNotInit = true;
$(document).live('pageinit',function(event){//Force the app to go home after force refresh the page on browser
	if(pageNotInit){
		$.mobile.changePage($('#page0'));
		pageNotInit = false;
	}	
});

		// Init golobal variables		
		var allEventsCollection = {
			eventCollections:{},
			available:false
		};

		var sesssionCollection = {
			sessionEntityCollection:{},
			available:false
		};
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
				Array.prototype.removeByValue = function(val) {
				    for (var i = 0; i < this.length; i++) {
				        if (this[i] == val) {
				            this.splice(i, 1);
				            break;
				        }
				    }
	};// @lock


	var CookieDate = new Date;
	CookieDate.setFullYear(CookieDate.getFullYear( ) +10);
	if(document.cookie.indexOf("SummitAPPID") == -1) {
		document.cookie = 'SummitAPPID = ' + uniqueid() + ';expires=' + CookieDate.toGMTString() + ';';
	}
	var beginIndex = document.cookie.indexOf("SummitAPPID")+12;
	var endIndex = beginIndex + 32;
	var cookieID = document.cookie.substring(beginIndex,endIndex);
	
		$('#searchInput').live('keyup',function(event) {
			//alert(this.value);
			ds.Event.searchSessionsAndSpeakesByString(this.value,{
				onSuccess: function(searchEvent) {
					var searchResult = searchEvent.result;
					var sessionsFound = searchResult['sessionsFound'];
					$('#searhResultListView').empty();
					$('#searhResultListView').append('<li role="heading" data-role="list-divider">'+ sessionsFound.length +' Sessions found</li>');
					sessionsFound.forEach(function(element){
		                 if(!element.isActivity)$('#searhResultListView').append('<li data-theme="c"><a  id="'+element.ID +'" class="loadSessionDetail" data-transition="slide"><p style="font-family:Arial;font-size: 18;">'+ element.startTime +'- ' + element.endTime +', '+ formatDate(new Date(element.sessionDate)) +'</p><h1>'+ element.name + '</h1><p style="font-family:Arial;font-size: 18;">Room: ' + element.room +  '</p></a></li>');
					}) 
					//if ($('#searhResultListView').hasClass('ui-listview')) $('#searhResultListView').listview('refresh');
					var speakersFound = searchResult['speakersFound'];
					$('#searhResultListView').append('<li role="heading" data-role="list-divider">'+ speakersFound.length +' Speakers found</li>');
					speakersFound.forEach(function(element){
		                 if(!element.isActivity)$('#searhResultListView').append('<li data-theme="c"><a  id="'+element.name +'" class="loadSpeakerProfile" data-transition="slide"><h1>'+ element.name + '</h1><p style="font-family:Arial;font-size: 18;">' + element.title +  ',    ' + element.company + '</p></a></li>');
					}) 
					if ($('#searhResultListView').hasClass('ui-listview')) $('#searhResultListView').listview('refresh');
				},
				onError: function(error) {
		        	alert(error['error'][0].message + "  Please refresh page");
		        }
			})
		});

		var dayDescription = {
			'10/23/2012':'4D Summit Pre-Class',
			'10/24/2012':'4D Summit keynotes  breakout sessions',
			'10/25/2012':'4D Summit keynotes  breakout sessions',
			'10/26/2012':'JS.everyWhere(2012)',
			'10/27/2012':'Wakanday 2012'	
		}


		var localStorageAvailable = true;
		if (typeof(localStorage) =='undefined') {
    		Console.log('Local storage not supported by this browser.');
    		localStorageAvailable = false;
  		}

		//preload all sponsor pics:
		var allSponsorsImageArray = ['styles/images/Sponsors/sponsor-logo-hm.png','styles/images/Sponsors/sponsor-logo-paypal.png',  'styles/images/Sponsors/sponsor-logo-objsys.png', 'styles/images/Sponsors/ebay.png', 'styles/images/Sponsors/redhat.png', 'styles/images/Sponsors/openshift.png','styles/images/Sponsors/pubnub.png','styles/images/Sponsors/logo-mozilla-firefox.png', 'styles/images/Sponsors/logo-mongolab.png', 'styles/images/Sponsors/logo-telerik.png', 'styles/images/Sponsors/logo-kendo.png', 'styles/images/Sponsors/oreilly.png', 'styles/images/Sponsors/qcon-transparent-background.png', 'styles/images/Sponsors/looprecur.png', 'styles/images/Sponsors/logo-agile-diagnosis.png', 'styles/images/Sponsors/logo-cue.png', 'styles/images/Sponsors/logo-W3C.png',   ];// Array of images:
		var summitSponsorsImageArray = ['styles/images/Sponsors/ebay.png', 'styles/images/Sponsors/redhat.png', 'styles/images/Sponsors/openshift.png','styles/images/Sponsors/pubnub.png','styles/images/Sponsors/logo-mozilla-firefox.png', 'styles/images/Sponsors/logo-mongolab.png', 'styles/images/Sponsors/logo-telerik.png', 'styles/images/Sponsors/logo-kendo.png', 'styles/images/Sponsors/oreilly.png', 'styles/images/Sponsors/qcon-transparent-background.png', 'styles/images/Sponsors/looprecur.png', 'styles/images/Sponsors/logo-agile-diagnosis.png', 'styles/images/Sponsors/logo-cue.png', 'styles/images/Sponsors/logo-W3C.png'];
		$.each(allSponsorsImageArray, function (i, val) {
  			$('<img/>').attr('class','allSponsorImage').attr('src', val).attr('width',150).attr('height',60).appendTo('#allSponsors');
		});
//		$.each(summitSponsorsImageArray, function (i, val) {
//  			$('<img/>').attr('src', val).attr('width',150).attr('height',60).appendTo('#eventSponsors');
//		});
//		$('#eventSponsors').cycle();


		var sessionIDSet = {};
		ds.Event.all({
		    autoExpand: "sessions",
		    onSuccess: function(eventsCollectionEvent) {
		    	allEventsCollection.eventCollections = eventsCollectionEvent.entityCollection;
		        allEventsCollection.available= true;		            
		    }
		});
		
		var likedSessions = [];		
		//Retrive data from local storage;
		if (localStorage.getItem('likedSessions') != null) likedSessions = JSON.parse(localStorage.getItem('likedSessions')) ;
		if (!$.isArray(likedSessions)) likedSessions = [];
		
		var sessionSurveyArrayForSubmission = {};
		
		
		//Load days for tapped event
		$(".loadDays").live('tap', function() { //tap event handler of Event listitem
		    var clickedButton = $(this);
		    clickedButton.addClass("ui-btn-active");
		    $.blockUI({
		    	 message: null,
		    	  overlayCSS: {
		    	  	 opacity: 0
		    	  }
		    });
		    if (allEventsCollection.available && allEventsCollection.eventCollections.length > 0) {
		        allEventsCollection.eventCollections.query("name = :1 | name %% :1", this.id, {
		            autoExpand: "sessions, sponsors",
		            onSuccess: function(event) {
		                event.entityCollection.forEach({
		                    onSuccess: function(eventItemEvent) {
		                        var startDate = eventItemEvent.entity.startDate.getValue();
		                        var endDate = eventItemEvent.entity.endDate.getValue();
		                        $('#eventPageHead h3').text(this.id);
		                        $('#daysListView').empty();
		                        $('#daysListView').append('<li data-theme="c">' + '<a id="' + formatDate(startDate) + '" class="loadTimsSlots" href="#" data-transition="slide">' + '<h3>' + getTheDay(startDate) + " " + formatDate(startDate) + '</h3><p>'+dayDescription[formatDate(startDate)] +'</p>' + '</li>');
		                        while (startDate < endDate) {
		                            startDate.setDate(startDate.getDate() + 1);
		                            $('#daysListView').append('<li data-theme="c"><a id="' + formatDate(startDate) + '" class="loadTimsSlots" href="#" data-transition="slide">' + '<h3>' + getTheDay(startDate) + " " + formatDate(startDate) + '</h3><p>'+dayDescription[formatDate(startDate)] +'</p></li>');
		                        }
		                        //Get Sponsors collection watch for performance
		                        $('#eventSponsors').empty();
		                        if (eventItemEvent.entity.name.getValue().indexOf('4D') != -1){
		                        	summitSponsorsImageArray = ['styles/images/Sponsors/sponsor-logo-hm.png','styles/images/Sponsors/sponsor-logo-paypal.png',  'styles/images/Sponsors/sponsor-logo-objsys.png'];
		                        //var sponsorsCollectionRel = eventItemEvent.entity.sponsors.relEntityCollection;
		                        
//		                        sponsorsCollectionRel.forEach({  //toArray() returns all 19 instead of 3 wile  sponsorsCollectionRel.length us 3, need verification
//		                        	onSuccess: function(sponsorEvent) {
//		                        		//console.log(sponsorEvent.entity);
//		                        		$('<img/>').attr('src', sponsorEvent.entity.imageURL.getValue()).attr('width',150).attr('height',60).appendTo('#eventSponsors');
//		                        	},
//		                        	atTheEnd: function(end) {
//		                        		$('#eventSponsors').cycle();
//		                        	}
//		                        	
//		                        });
		                        }
		                        else {
		                        	summitSponsorsImageArray = ['styles/images/Sponsors/ebay.png', 'styles/images/Sponsors/redhat.png', 'styles/images/Sponsors/openshift.png','styles/images/Sponsors/pubnub.png','styles/images/Sponsors/logo-mozilla-firefox.png', 'styles/images/Sponsors/logo-mongolab.png', 'styles/images/Sponsors/logo-telerik.png', 'styles/images/Sponsors/logo-kendo.png', 'styles/images/Sponsors/oreilly.png', 'styles/images/Sponsors/qcon-transparent-background.png', 'styles/images/Sponsors/looprecur.png', 'styles/images/Sponsors/logo-agile-diagnosis.png', 'styles/images/Sponsors/logo-cue.png', 'styles/images/Sponsors/logo-W3C.png'];
		                        }
		         				$.each(summitSponsorsImageArray, function (i, val) {
  								$('<img/>').attr('class','allSponsorImage').attr('src', val).attr('width',150).attr('height',60).appendTo('#eventSponsors');
								});
								$('#eventSponsors').cycle();
		                        
		                        //if (localStorageAvailable) localStorage.setItem("page1", $('#daysListView').html());
		                        var sessionsCollectionRel = eventItemEvent.entity.sessions.relEntityCollection;
		                        sessionsCollectionRel.orderBy("startTime", {
		                            onSuccess: function(event) { // handle anything special here
		                                sesssionCollection.sessionEntityCollection = event.entityCollection;
		                                sesssionCollection.available = true;
		                            },
									onError: function(error) {
		        						alert(error['error'][0].message + "      Please refresh page");
		        						clickedButton.removeClass("ui-btn-active ui-state-persist");
		        						$.unblockUI();
		        					}
		                        });
		                        if ($('#daysListView').hasClass('ui-listview')) $('#daysListView').listview('refresh');
		                    },
							onError: function(error) {
		        				alert(error['error'][0].message + "      Please refresh page");
		        				clickedButton.removeClass("ui-btn-active ui-state-persist");
		        				$.unblockUI();
		       				}
		                });
		                clickedButton.removeClass("ui-btn-active ui-state-persist");
		                $.mobile.changePage("#page1", {
		                    transition: "slide"
		                });
		                $.unblockUI();
		               
		            },
					onError: function(error) {
		        		alert(error['error'][0].message + "  Please refresh page");
		        	}
		        });
		    }
		});
		
		    $(".loadTimsSlots").live('tap', function() {
		    	$.blockUI({
		    		message: null,
		    	  		overlayCSS: {
		    	  	 	opacity: 0
		    	  	}
		   		});
		        var currentDate = this.id;
		        var clickedButton = $(this);
		    	clickedButton.addClass("ui-btn-active");
		        if ( sesssionCollection.available && sesssionCollection.sessionEntityCollection.length > 0) {
		            $('#timSlotListView').empty();
		            var sessionTimes = [];
		            var tagsSet = {};
		            var sessionsSet = {};
		            $('#dayPageHead h3').text(currentDate);
		            sesssionCollection.sessionEntityCollection.forEach({
		                onSuccess: function(sessionRelevent) {
		                    var sessionItem = sessionRelevent.entity;
		                    var sessionDate = formatDate(sessionItem.sessionDate.getValue());
		                    var sessionTime = sessionItem.startTime.getValue() + "- " + sessionItem.endTime.getValue();
		                    var sessionFirstTag = "";
		                    sessionsSet[sessionItem.ID.getValue()] = sessionItem.name.getValue();
		                    if (sessionItem.tags.getValue()) {
		                        sessionFirstTag = sessionItem.tags.getValue().match(/,/) ? sessionItem.tags.getValue().split(',')[0] : sessionItem.tags.getValue();
		                        if (sessionTimes.indexOf(sessionTime) != -1) {
		                            if (typeof sessionIDSet[sessionTime] === "undefined") sessionIDSet[sessionTime] = [];
		                            sessionIDSet[sessionTime].push(sessionItem.ID.getValue());
		                            var seperator;
		                            tagsSet[sessionTime].length > 0 ? seperator = ',' : seperator = "";
		                            (typeof tagsSet[sessionTime] === "undefined") ? tagsSet[sessionTime] = "" : tagsSet[sessionTime] = tagsSet[sessionTime].concat(seperator + ' ' + sessionFirstTag);
		                        }
		                    }
		                    if (sessionDate == currentDate & sessionTimes.indexOf(sessionTime) == -1) {
		                        sessionTimes.push(sessionTime);
		                        if (sessionItem.isActivity.getValue()) {
		                            $('#timSlotListView').append('<li role="heading" data-role="list-divider" ><h3 style="white-space:normal">' + sessionTime + '  ' + sessionItem.name.getValue() + ' at ' + sessionItem.room.getValue() + '</h3></li>');
		                        }
		                        else {
		                            $('#timSlotListView').append('<li data-theme="c" ><a class="loadSessions" id="' + sessionItem.ID.getValue() + '" class=""  data-transition="slide" >' + '<h3>' + sessionTime + '</h3><p class="' + sessionTime + '">' + sessionFirstTag + '</p></a></li>');
		                            if (typeof tagsSet[sessionTime] === "undefined") tagsSet[sessionTime] = "";
		                            var seperator;
		                            tagsSet[sessionTime].length > 0 ? seperator = ',' : seperator = "";
		                            tagsSet[sessionTime] = tagsSet[sessionTime].concat(seperator + ' ' + sessionFirstTag);
		                            tagsSet[sessionItem.ID.getValue()] = sessionTime;
		                            sessionIDSet[sessionItem.ID.getValue()] = sessionTime;
		                            if (typeof sessionIDSet[sessionTime] === "undefined") sessionIDSet[sessionTime] = [];
		                            sessionIDSet[sessionTime].push(sessionItem.ID.getValue());
		                        }
		                    }
		                },
		                atTheEnd: function(end) {
		                    //Replace the tag paragraph in displayed li item with concated all sessions tags
		                    for (var key in tagsSet) {
		                        if (key.match(/\d{1,2}[:-]\d{2}([:-]\d{2,3})*/)) {
		                            var idToAddTags = getKeyForValue(tagsSet, key);
		                            if(tagsSet[key].indexOf(",") != -1) {// check if there is only one tage available, if so show session name instead.
		                            	$('#' + idToAddTags + " p").text(tagsSet[key]);
		                            }
		                            else {
		                            	$('#' + idToAddTags + " p").text(sessionsSet[idToAddTags]);
		                            }
		                        }
		                    }
		                    //if (localStorageAvailable) localStorage.setItem("page3", $('#timSlotListView').html());
		                    if ($('#timSlotListView').hasClass('ui-listview')) $('#timSlotListView').listview('refresh');
		                    clickedButton.removeClass("ui-btn-active ui-state-persist");
		                    $.unblockUI();
		                    $.mobile.changePage("#page3", {transition: "slide"});

		                },
						onError: function(error) {
		        			alert(error['error'][0].message + "  Please refresh page");
		        		}
		            });

		        }
		    });
		$(".loadSessions").live('tap', function() {
			$.blockUI({
		    	 message: null,
		    	  overlayCSS: {
		    	  	 opacity: 0
		    	  }
		    });
			var clickedButton = $(this);
		    clickedButton.addClass("ui-btn-active");
			if ( sesssionCollection.available && sesssionCollection.sessionEntityCollection.length > 0 && sessionIDSet.hasOwnProperty(this.id)) {
		                $('#sessionsPageHead h3').text(sessionIDSet[this.id]);
		                sesssionCollection.sessionEntityCollection.query("ID in :1", sessionIDSet[sessionIDSet[this.id]], {
		                	autoExpand: "allSpeakers",
		                    onSuccess: function(sessionsInTimeEvent) {
		                        $('#sessionsListView').empty();
		                        var sessionsInTimeCollection = sessionsInTimeEvent.entityCollection;
		                        sessionsInTimeCollection.forEach({
		                            onSuccess: function(sessionsEvent) {
		                            	entity = sessionsEvent.entity;
		                            	var sessionSpeakerName = " "; 
		                            	var speakersCollection = entity.allSpeakers.relEntityCollection;
										if(speakersCollection.length > 0){
											speakersCollection.forEach({
	               							 onSuccess: function(speakerEvent) {
	                    						(sessionSpeakerName == "")?sessionSpeakerName += ( speakerEvent.entity.name.getValue()):sessionSpeakerName += (', ' + speakerEvent.entity.name.getValue());
	                						 },
	                 						atTheEnd: function(end) {
	                 							$('#sessionsListView').append('<li data-theme="c"><a  id="'+entity.ID.getValue() +'" class="loadSessionDetail" data-transition="slide"><h1>'+ entity.name.getValue() + '</h1><p style="font-family:Arial;font-size: 18;">Presenter: ' + sessionSpeakerName + '<br/>Room: ' + entity.room.getValue() + '<br/>Tags: ' + entity.tags.getValue() + '<br/>Description: '+ entity.description.getValue() +'</p></a></li>');
	                 						},
											onError: function(error) {
		        								alert(error['error'][0].message + "  Please refresh page");
		        							}
	            						});
									}
		                                //$('#sessionsListView').append(constructSessionListItem(sessionsEvent.entity));
		                            },
				onError: function(error) {
		        	alert(error['error'][0].message + "  Please refresh page");
		        }
		                        });
		                        if ($('#sessionsListView').hasClass('ui-listview')) $('#sessionsListView').listview('refresh');
		                        //if (localStorageAvailable) localStorage.setItem("page5", $('#sessionsListView').html());
		                        clickedButton.removeClass("ui-btn-active ui-state-persist");
		                        $.unblockUI();
		                        $.mobile.changePage("#page5", {transition: "slide"});
		                    },
		                    onError: function(error) {
		                    	alert(error['error'][0].message + "  Please refresh page");
		                    }
		                });
		     }
		});
		
		$(".loadSessionDetail").live('tap', function() { //on() is not working in this context
			if ($('#sessionsListView').children().size() == 0 | $('#sessionsListView li div div a').toArray().indexOf(this) == -1) {
				 $("#backToSessions").removeAttr('href');
 				 $('#backToSessions').addClass('goPrevious');

			}
			else {
				$("#backToSessions").removeClass('goPrevious');
				$("#backToSessions").attr("href", '#page5');
			}
			$.blockUI({
		    	 message: null,
		    	  overlayCSS: {
		    	  	 opacity: 0
		    	  }
		    });
			var clickedButton = $(this);
		    clickedButton.addClass("ui-btn-active");
		    ds.Session.find("ID = :1", this.id, {
		    	autoExpand: "allSpeakers, sessionSurvey.questions, sessionSurvey.answers",
		        onSuccess: function(sessionDetailEvent) {
		        	clickedButton.removeClass("ui-btn-active ui-state-persist");
		            var session = sessionDetailEvent.entity;
		            var sessionName = session.name.getValue();
		            var speakersCollection = session.allSpeakers.relEntityCollection;
		            var sessionSurvey = session.sessionSurvey.relEntity;
		            var sessionDetail = formatDate(session.sessionDate.getValue()) + ", " + session.startTime.getValue() + "- " + session.endTime.getValue() + ", " + session.room.getValue();
		   			var surveyQuestionsCollection = sessionSurvey.questions.relEntityCollection;
		   			var surveyAnswersCollection = sessionSurvey.answers.relEntityCollection;         
					//$('#sessionDetailPageHead h3').text(sessionName);
		            $('#sessionDetail h3').text(sessionName);
		            $('#sessionDetail p').text(sessionDetail);
		            var $starButton = $('<a id="' + session.ID.getValue() + '" data-role="button" data-inline="true" data-iconpos="notext" data-icon="star" class="likeCurrentSession" ></a>');
		            //if (likedSessions.indexOf($('#' + session.ID.getValue())[0].outerHTML) != -1) 

		            for (var starredSessionsCount in likedSessions) {
		            		if ($(likedSessions[starredSessionsCount])[0].id == session.ID.getValue()) {
		            		$starButton.addClass("ui-btn-active ui-state-persist");//star session if alreay prevoiusly stared 
		            		break
		            	}
		            }
		            
		            $('.sessionDetailParagraph').append($starButton).trigger('create');
		            //Star session if is already liked
		            
		            $('#sessionDetail #sessionDescription ').text(session.description.getValue());
		            $('#speakersListView').empty();
		            
		   			//Apppend speakers to the listview
		   			 speakersCollection.forEach({
		   			     onSuccess: function(speakerEvent) {
		   			         var speaker = speakerEvent.entity;
		   			         $('#speakersListView').append('<li data-theme="c">' + '<a id="' + speaker.name.getValue() + '"  class="loadSpeakerProfile"  data-transition="slide">Speaker: ' + speaker.name.getValue() + '</a > </li>');
		   			     },
		   			     onError: function(error) {
		   			         alert(error['error'][0].message + "  Please refresh page");
		   			     }
		   			 });
		   			
		   			// Load session survey
		   			//Needs further work on query with quote in name, hardcode for now.(might be bug as well)
//					if(sessionName.indexOf("'")) sessionName = sessionName.replace(/'/g, "\\\'");
					ds.Answer.query("userCookieID = :1 and sessionName = :2",{params:[cookieID, sessionName],
						onSuccess: function(answersEvent) {
		   			         if(answersEvent.entityCollection.length == 0){
		   			         	$('#surveyListView').empty();
					   			$('#surveyListView').attr('sessionID', session.ID.getValue());
					   			$('#loadEvaluation').show();
					   			surveyQuestionsCollection.forEach({
					   				onSuccess: function(questionEvent) {
				                    	var questionEntity = questionEvent.entity;
				                    	var questionID = questionEntity.ID.getValue();
										if(questionEntity.isRating.getValue()) $('#surveyListView').append('<li><div style="margin-left:auto;margin-right:auto;align:center;text-align:center;"><h3>' + questionEntity.question.getValue() + '</h3><div id="'+ questionID +'" data-rateit-starwidth="32" data-rateit-starheight="32" data-inline="false" class="rateit bigstars"></div></div></li>');
										if(questionEntity.needsTextInput.getValue()) $('#surveyListView').append('<li><div style="margin-left:auto;margin-right:auto;align:center;text-align:center;"><h3 style="white-space:normal">' + questionEntity.question.getValue() + '</h3><textarea id="answerInText" placeholder="Comments" name="" id="'+ questionID +'" data-mini="false"></textarea></div></li>');

				                	},
				                	atTheEnd: function(end) {
										if ($('#surveyListView').hasClass('ui-listview')) $('#surveyListView').listview('refresh');
										$('.rateit').rateit();
										$('.rateit').rateit('resetable',false)
										
				                 	},
				                	onError: function(error) {
					        			alert(error['error'][0].message + "  Please refresh page");
					        		}
					        	});
		   			         }
		   			         else {
		   			         	$('#loadEvaluation').hide();
		   			         }
		   			     },
		   			     onError: function(error) {
		   			         alert(error['error'][0].message + "  Please refresh page");
		   			     }	
					});
					
		   			
//		        	}
//		        	else {
//		        		
//		        	}
		   			         
		            if($('#speakersListView').hasClass('ui-listview')) $('#speakersListView').listview('refresh');
		            $.unblockUI();
		            $.mobile.changePage("#page6", {transition: "slide"});

		        },
				onError: function(error) {
		        	alert(error['error'][0].message+ "  Please refresh page");
		        }
		    });
		});
		
		$('.loadSpeakerProfile').live('tap', function() {
				var clickedButton = $(this);
		    clickedButton.addClass("ui-btn-active");
			var speakerName = this.id;
	    ds.Speaker.find("name = :1", speakerName, {
	        autoExpand: "allSessions",
	        onSuccess: function(speakerEvent) {
	            $.blockUI({
	                message: null,
	                overlayCSS: {
	                    opacity: 0
	                }
	            });
	            var speaker = speakerEvent.entity;
	            $('#speakerName').text(speaker.name.getValue());
	            $('#speakerTitle').text(speaker.title.getValue() + ', ' + speaker.company.getValue());
	            (speaker.speakerBio.getValue()) ? $('#speakerBio').text(speaker.speakerBio.getValue()) : $('#speakerBio').hide();
	            (speaker.speakerPicURL.getValue()) ? $('#speakerPic').attr("src", speaker.speakerPicURL.getValue()) : $('#speakerPic').attr("src", "styles/images/profilePicPlaceHolder.gif");
	            $('#speakerSessionsList').empty();
	            $('#speakerSessionsList').append('<li role="heading" data-role="list-divider">Sessions</li>');
	            sessionsCollectionRel = speaker.allSessions.relEntityCollection;
	            sessionsCollectionRel.forEach({
	                onSuccess: function(sessionEvent) {
	                    var sessionOfCurrentSpeaker = sessionEvent.entity;
	                    $('#speakerSessionsList').append('<li data-theme="c">' + '<a id="' + sessionOfCurrentSpeaker.ID.getValue() + '" class="loadSessionDetail" href="#page6" data-transition="slide">' + '<h3>' + sessionOfCurrentSpeaker.name.getValue() + '</h3></a></li>');
	                },
				onError: function(error) {
		        	alert(error['error'][0].message + "  Please refresh page");
		        }
	            })
	            if ($('#speakerSessionsList').hasClass('ui-listview')) $('#speakerSessionsList').listview('refresh');
	            clickedButton.removeClass("ui-btn-active ui-state-persist"); 
	            $.mobile.changePage("#page7", {
	                transition: "slide"
	            });
	            $.unblockUI();
	        },
				onError: function(error) {
		        	alert(error['error'][0].message + "  Please refresh page");
		        }

	    });
	});
		
		$(".likeCurrentSession").live('tap', function() {
			var clickedButton = $(this);
			var sessionButtonsList = $('.loadSessionDetail');
			var buttonItemForLikedSession;
			var buttonID = (this.id)?this.id:clickedButton.attr("mid");
			for (var sessionCount in sessionButtonsList) {//find button of target session in the saved liked session list 
				if (sessionButtonsList.hasOwnProperty(sessionCount) && sessionButtonsList[sessionCount].id == buttonID) {
					
					buttonItemForLikedSession = sessionButtonsList[sessionCount].outerHTML;
				}
			}
			//var buttonItemForLikedSession = $('#' + this.id).parent().html();
			if (clickedButton.hasClass("ui-btn-active") | clickedButton.attr("mid")) { //check if session is already starred
				clickedButton.removeClass("ui-btn-active ui-state-persist");
		    	likedSessions.removeByValue(buttonItemForLikedSession);
		    	if (localStorageAvailable) localStorage.setItem("likedSessions", JSON.stringify(likedSessions));
		    	if (clickedButton.attr("mid")) {
		    		$("#starredSessionsListView li a ").each(function(n,item){
		    			if (item.id == clickedButton.attr("mid")) {
		    				$(item).effect("fade", {}, 500, function(){
                    		$(item).remove();
                			});
		    			}
		    		})
		    	}
		    }
		    else {
		    	clickedButton.addClass("ui-btn-active ui-state-persist");
		    	if (likedSessions.indexOf(buttonItemForLikedSession) == -1)likedSessions.push(buttonItemForLikedSession);
		    	if (localStorageAvailable) localStorage.setItem("likedSessions", JSON.stringify(likedSessions));
		    }
		    
		    //Sync likedsessions with server
		    var likedSessionItemArray = [];
		    for (var likedSessionID in likedSessions) {
		    	if(typeof likedSessions[likedSessionID] != 'function') {
		    		likedSessionItemArray.push($(likedSessions[likedSessionID])[0].id);
		    	}
		    }
		    ds.Session.syncSessionFavoritedItems(likedSessionItemArray, cookieID);
		});
		
		
		$('#page9').live('pagebeforeshow',function(event, ui){
			$('#starredSessionsListView').empty();
		        for (var starredElement in likedSessions) {
		        	if (likedSessions.hasOwnProperty(starredElement)) {
						$('#starredSessionsListView').append('<li data-theme="c">'+ likedSessions[starredElement]+' <a mID="'+ $(likedSessions[starredElement])[0].id +'" href="#" class="likeCurrentSession"></a></li>');
		        	}
		        }
		    if ($('#starredSessionsListView').hasClass('ui-listview')) $('#starredSessionsListView').listview('refresh');

		});
	
	function getKeyForValue(jsonObjet, value) {
		    for (var key in jsonObjet) {
		        if (jsonObjet.hasOwnProperty(key) && typeof(key) !== 'function') {
		            if (jsonObjet[key] == value) return key;
		        }
		    }
		}
		
		$('#loadEvaluation').live('tap',function(){
			
		});
		
		$(".allSponsorImage").live('click', function() {
			$.mobile.changePage("#page8", {
		            transition: "slide",
		            reverse: false
		        });
		});
		
		$(".sponsorImage").live('click', function() {
			var imageName = this.src.match(/(styles\/images\/Sponsors\/[^.]*\S*)/);
			ds.Sponsor.find('imageURL = :1)', imageName[1],{
				onSuccess: function(sponsorEvent) {
					//console.log(sponsorEvent.entity);
					window.location.href = sponsorEvent.entity.contactInfo.getValue();
				}
			});
		});
		
		
		$(".goPrevious").live('tap', function() {//go to previous page in history
				history.back();
				return false;
		});

		 function formatDate(date) { // ultility to formate date to mm/dd/yyyy
		 
		    if (date) return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
		};

		function getTheDay(date) {
		    weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
		    return weekday[date.getDay()];
		}
		
		function generateSurveyQuestion (questionEntity) {
			var questionID = questionEntity.ID.getValue();
			if(questionEntity.isRating.getValue()) $('#surveyListView').append('<li><div style="margin-left:auto;margin-right:auto;align:center;text-align:center;"><h3>' + questionEntity.question.getValue() + '</h3><div id="'+ questionID +'" data-rateit-starwidth="32" data-rateit-starheight="32" data-inline="false" class="rateit bigstars"></div></div></li>');
			if(questionEntity.needsTextInput.getValue()) $('#surveyListView').append('<li><div style="margin-left:auto;margin-right:auto;align:center;text-align:center;"><h3 style="white-space:normal">' + questionEntity.question.getValue() + '</h3><textarea class="answerInText" placeholder="Comments" name="" id="'+ questionID +'" data-mini="false"></textarea></div></li>');
			//$('#surveyListView li div div').rateit();
		}
		
		//Cancel and clear survey
		$('#cancelSurveySubmit').live('tap',function(){
			sessionSurveyArrayForSubmission = {};
			$('.rateit').rateit('value',0);
		});
		
		//Submit Survey by calling server side datastore class and pass the survey result object;
		$('#submitSurvey').live('tap',function(event){
			var sessionSurveyArrayForSubmissionLength = 0;
			if($('#answerInText').val()) sessionSurveyArrayForSubmission[18] = $('#answerInText').val();	
			$.each(sessionSurveyArrayForSubmission, function(k, v) { sessionSurveyArrayForSubmissionLength++; });
			
			if (sessionSurveyArrayForSubmissionLength > 11 ) {// all 10 required questions are answered.
				ds.SessionSurvey.submitSurveryAnswers(sessionSurveyArrayForSubmission,{
					onSuccess:function(result){
						$('#loadEvaluation').hide();
						sessionSurveyArrayForSubmission = {};
						$('.rateit').rateit('value',0);
						$.mobile.changePage("#page6", {
		                    transition: "slidedown"
		        		});
					},
					onError: function(error) {
		        		alert(error['error'][0].message);
		        	}
				});
		     }
		     else {
		     	alert('Please complete all questions to sumbit!');
		     	event.preventDefault();	
		     }
		});
		
		
		$(".rateit").live('rated', function (event, value) {
			sessionSurveyArrayForSubmission.sessionID = $('#surveyListView').attr('sessionID');
			sessionSurveyArrayForSubmission.userCookieID = cookieID;
			sessionSurveyArrayForSubmission[this.id] = value;
		});
		$('#allSponsors').cycle();
		
		
		//Utility: Generates UniqueID for cookie and localstorage
		function uniqueid(){
		    // always start with a letter (for DOM friendlyness)
		    var idstr=String.fromCharCode(Math.floor((Math.random()*25)+65));
		    do {                
		        // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
		        var ascicode=Math.floor((Math.random()*42)+48);
		        if (ascicode<58 || ascicode>64){
		            // exclude all chars between : (58) and @ (64)
		            idstr+=String.fromCharCode(ascicode);    
		        }                
		    } while (idstr.length<32);

		    return (idstr);
		}
	};

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
//Error code: 801
//xtoolbox
//task 36611, name: 'HTTP connection handler'
//  Please refresh page
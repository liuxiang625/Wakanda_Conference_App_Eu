
guidedModel =// @startlock
{
	SessionSurvey :
	{
		methods :
		{// @endlock
			submitSurveryAnswers:function(sessionSurveyArrayForSubmission)
			{// @lock
				for (var obj in sessionSurveyArrayForSubmission) {
					if (obj != 'sessionID' & obj != 'userCookieID') { 
						var questionID = obj;
						try {
							var newAnswer = ds.Answer.createEntity();
							newAnswer.question = ds.Question.find('ID = :1',questionID);
							newAnswer.sessionSurvey = newAnswer.question.sessionSurvey;
							newAnswer.session = ds.Session.find('ID = :1',sessionSurveyArrayForSubmission['sessionID']);
							newAnswer.userCookieID = sessionSurveyArrayForSubmission['userCookieID'];
							newAnswer.question.isRating?newAnswer.rate = sessionSurveyArrayForSubmission[obj]:newAnswer.answer = sessionSurveyArrayForSubmission[obj];
							newAnswer.save();
						}
						catch (e) {     //if you cannot create it, then error out
                			return {error: 5, errorMessage: ' Evaluation submittion failed'};
            			}
					}
				}
				console.log(newAnswer.userCookieID);
			}// @startlock
		}
	},
	Speaker :
	{
		uniqueID :
		{
			events :
			{
				onLoad:function(attributeName)
				{// @endlock
					this.uniqueID =  directory.computeHA1(this.name, this.event);
				}// @startlock
			}
		},
		methods :
		{// @endlock
			searchSpeakerByString:function(queryString)
			{// @lock
				var speakersFound = ds.Speaker.query("name = :1", queryString);
				return speakersFound;
			}// @startlock
		}
	},
	Event :
	{
		methods :
		{// @endlock
			searchSessionsAndSpeakesByString:function(queryString)
			{// @lock
				 var searchResult = {
					'sessionsFound':ds.Session.searchSessionByString('*' + queryString + '*'),
					'speakersFound':ds.Speaker.searchSpeakerByString('*' + queryString + '*')
				};
				return searchResult;
			}// @startlock
		}
	},
	Session :
	{
		averageRates :
		{
			events :
			{
				onLoad:function(attributeName)
				{// @endlock
					if(this.answersInputedCount !== 0 ) {
						var ratesSum = 0;
						var rateAnswerItemCount = 0;
						var answers = this.allSurveyAnswerItems;
						answers.forEach(function( answerItem ) {
	    					if(answerItem.rate > 0) {
	    						ratesSum += answerItem.rate;
	    						rateAnswerItemCount += 1;
	    					}
				    	});
						this.averageRates = ratesSum/ rateAnswerItemCount;
					}
				}// @startlock
			}
		},
		answersInputedCount :
		{
			events :
			{
				onLoad:function(attributeName)
				{// @endlock
					this.answersInputedCount = this.allSurveyAnswerItems.length;
				}// @startlock
			}
		},
		methods :
		{// @endlock
			syncSessionFavoritedItems:function(favoritedSessionIDArray, userCookieID )
			{// @lock
				//Delete all items that exist for this userCookieID
				var sessionFavoritedItemsToDelete =  ds.SessionFavoritedItem.query("userCookieID = :1",userCookieID);
				sessionFavoritedItemsToDelete.forEach(
    				function( item ) {
    				console.log("item to remove: " + item.favoritedSessionName);
        			item.remove();
			    });
			    
			    //Create new items with new array of sessionIDs
				for ( var favoritedSessionID in favoritedSessionIDArray) {
					//console.log("Session going to save" + favoritedSessionIDArray[favoritedSessionID]);
					var newSessionFavoritedItem = ds.SessionFavoritedItem.createEntity();
					var favoritedSession  = ds.Session.find("ID = :1" , favoritedSessionIDArray[favoritedSessionID]);
					var session = currentSession();
					var token = session.promoteWith("Admin");
					//if (!favoritedSession.allSessionFavoritedItems.query("userCookieID = :1 & favoritedSessionName = :2",userCookieID,favoritedSession.name)) {
						//if(favoritedSession.allSessionFavoritedItems.find("userCookieID = :1",userCookieID))favoritedSession.allSessionFavoritedItems.find("userCookieID = :1",userCookieID).remove();
						newSessionFavoritedItem.userCookieID = userCookieID;
						newSessionFavoritedItem.favoritedSession = favoritedSession;
						newSessionFavoritedItem.save();
					//}
					favoritedSession.sessionsFavoritedCount = favoritedSession.allSessionFavoritedItems.count();
					favoritedSession.save();
					console.log(favoritedSession.name + ": " + favoritedSession.allSessionFavoritedItems.count());
					session.unPromote(token);					
				}

			},// @lock
			searchSessionByString:function(queryString)
			{// @lock
				var sessionsFound = ds.Session.query("name = :1", queryString);
				return sessionsFound;
			}// @startlock
		}
	}
};// @endlock


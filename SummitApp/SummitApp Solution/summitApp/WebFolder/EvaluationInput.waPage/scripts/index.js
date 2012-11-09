
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var button3 = {};	// @button
	var button4 = {};	// @button
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	button3.click = function button3_click (event)// @startlock
	{// @endlock
		$('#errorDiv2').html("");
		var sessionSurveyArrayForSubmission = {};
		sessionSurveyObjForSubmission.sessionID = waf.sources.session.ID;
		sessionSurveyObjForSubmission.userCookieID = 'Paper Evaluation';
		sessionSurveyObjForSubmission[12] = $$('combobox1').getValue();
		sessionSurveyObjForSubmission[11] = $$('combobox2').getValue();
		sessionSurveyObjForSubmission[10] = $$('combobox3').getValue();
		sessionSurveyObjForSubmission[9] = $$('combobox4').getValue();
		sessionSurveyObjForSubmission[8] = $$('combobox5').getValue();
		sessionSurveyObjForSubmission[7] = $$('combobox6').getValue();
		sessionSurveyObjForSubmission[13] = $$('combobox7').getValue();
		sessionSurveyObjForSubmission[14] = $$('combobox8').getValue();
		sessionSurveyObjForSubmission[15] = $$('combobox9').getValue();
		sessionSurveyObjForSubmission[16] = $$('combobox10').getValue();
		if($$('textField1').getValue())sessionSurveyObjForSubmission[18] = $$('textField1').getValue();
		var sessionSurveyArrayForSubmissionLength = 0;
		$.each(sessionSurveyObjForSubmission, function(key, value) {
			if (value != 'Rate' & value != null)sessionSurveyArrayForSubmissionLength++;
			 });
			
		if (sessionSurveyArrayForSubmissionLength > 11 ) {// all 10 required questions are answered.
			ds.SessionSurvey.submitSurveryAnswers(sessionSurveyObjForSubmission,{
				onSuccess:function(result){
					$$('textField1').setValue('');
					sources.session.serverRefresh();
					$('#errorDiv2').html("Answers Saved");
				},
				onError: function(error) {
		       		alert(error['error'][0].message);
		        }
			});
		}
	    else {
		   	$('#errorDiv2').html('Please complete all rate questions');
	     }

	};// @lock

	button4.click = function button4_click (event)// @startlock
	{// @endlock
		var userName = $('#userNameFiled').val();
		var password = $('#passwordField').val();
		$('#errorDiv1').html("");
		
		WAF.directory.login(userName, password , {
			onSuccess: function(result){
				if(result.result) {
					$$('container2').hide();
					$$('dataGrid1').show();
					$$('container1').show();
				}
				else {
					$('#errorDiv1').html("Username or password is incorrect");
				}
			},
			onError: function(result){$('#errorDiv1').html("Something is wrong, please try it again");}
			});
	};// @lock

	
	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
//		sessionSurveyObjForSubmission = {};
//		sessionSurveyObjForSubmission.sessionID = waf.sources.session.ID;
//		sessionSurveyObjForSubmission.userCookieID = 'Paper Evaluation';
//		sessionSurveyObjForSubmission.sync();
		//waf.sources.session.query('event.name = "4D*" & (isActivity =false | isActivity = null)');
//		rateArray = [];
//		rateArray = [{rate:" "}, {rate:"0.5"}, {rate:"1"}, {rate:"1.5"}, {rate:"2"}, {rate:"2.5"}, {rate:"3"}, {rate:"3.5"}, {rate:"4"}, {rate:"4.5"}, {rate:"5"}, ];
//		sources.rateArray.sync();
		if (WAF.directory.currentUser() === null) {
			$$('container2').show();
			$$('dataGrid1').hide();
			$$('container1').hide();
		}
		else {
			$$('container2').hide();
			$$('dataGrid1').show();
			$$('container1').show();
		}
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("button3", "click", button3.click, "WAF");
	WAF.addListener("button4", "click", button4.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock

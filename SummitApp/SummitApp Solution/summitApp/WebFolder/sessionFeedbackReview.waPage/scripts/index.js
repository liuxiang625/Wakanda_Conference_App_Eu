
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var dataGrid1 = {};	// @dataGrid
	var documentEvent = {};	// @document
// @endregion// @endlock
	var QueryString = function () {
		  // This function is anonymous, is executed immediately and 
		  // the return value is assigned to QueryString!
		  var query_string = {};
		  var query = window.location.search.substring(1);
		  var vars = query.split("&");
		  for (var i=0;i<vars.length;i++) {
		    var pair = vars[i].split("=");
		    	// If first entry with this name
		    if (typeof query_string[pair[0]] === "undefined") {
		      query_string[pair[0]] = pair[1];
		    	// If second entry with this name
		    } else if (typeof query_string[pair[0]] === "string") {
		      var arr = [ query_string[pair[0]], pair[1] ];
		      query_string[pair[0]] = arr;
		    	// If third or later entry with this name
		    } else {
		      query_string[pair[0]].push(pair[1]);
		    }
		  } 
		    return query_string;
		} ();
		
		console.log(QueryString.speakerName + '*');
		var speakerNameArray = QueryString.speakerName.split('.');
		var stringForDatasourceQuery = speakerNameArray[0] + " " + speakerNameArray[1];
		if (stringForDatasourceQuery === 'Ron DellAquila') stringForDatasourceQuery = "Ron Dell"; //workaround for ron's name format;
		console.log(stringForDatasourceQuery);
		sources.presenters.query("speakerName = :1 ",
		//sources.presenters.query("uniqueID = :1 ",
			{
				onSuccess: function(event)
        		{
        			if(event.dataSource.length > 0 & event.dataSource.uniqueID == QueryString.key ){
	        			$$('dataGrid1').show();
	        			$$('container').show();
	        			//$$('richText15').show();
        			}
        			else {
        				//alert('No session found! Please use the URL from your email!');
        				$('#errorDiv1').html('No session found! Please use the URL from your email!');
        				$$('dataGrid1').hide();
	        			$$('container').hide();
        			}
        		},params: [stringForDatasourceQuery + '*']
        		//},params: [QueryString.key + '*']
        	}
        );
// eventHandlers// @lock

	dataGrid1.onCellClick = function dataGrid1_onCellClick (event)// @startlock
	{// @endlock
		if (event.data.cell.value.length > 80) {
			$('#dataGrid1').bt(event.data.cell.value, {
				trigger: 'none',
				positions: 'top',
				cssStyles: {fontSize: '16px', fontWeight: 'bold'},
				width:'800px'
				});
			$('#dataGrid1').btOn();
		} 
		else {
			$('#dataGrid1').btOff();
		}
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock

		if($(window).width() > $$('container1').getWidth())$$('container1').setWidth($(window).width());
		if($(window).height() > $$('container1').getHeight())$$('container1').setHeight($(window).height());
	};// @lock
	
// @region eventManager// @startlock
	WAF.addListener("dataGrid1", "onCellClick", dataGrid1.onCellClick, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock

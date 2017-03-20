(function (){
	'use strict';
	var overviewOutput = document.getElementById('overview'),
    	resultsDetail = document.getElementById('detail'),
    	autoSuggest = document.getElementById('autosuggest');


	var app = {
		init: function() {
			routes.create();
			collection.get();
			search.submitEvent();
		},
	};

	var routes = {
		create: function() {
			routie({
			    'residences/:GroupByObjectType': function(GroupByObjectType) {
			    	collection.getResidence(GroupByObjectType);
		        },
			});
		},
		goBack: function(backButton) {
			backButton = document.getElementById("back-button").innerHTML;
			window.history.back(backButton);
		},
		homeButton: function(){
			var homeButton = document.getElementById("home");
			homeButton.addEventListener("click", function(){
				overviewOutput.classList.add("hide");
          		resultsDetail.classList.add("hide");
			});
		}
	};

	// searchfield
	var search = {
		submitEvent: function() {
			document.getElementById("search-field").addEventListener("submit", this.field);
		},
		field: function() {
			var query = document.getElementById("user-input").value.replace(/ /g, "-");
			var minimum = document.getElementById('minimum').value;
			var maximum = document.getElementById('maximum').value;
			var building = document.getElementById('building').value;
						
			collection.get(query, minimum, maximum, building);
			// collection.getAutoSuggest(query);


			if (query.length > 0) {
				overviewOutput.classList.remove("hide");
          		resultsDetail.classList.add("hide");
          		// autoSuggest.classList.remove("hide");

          		document.getElementById("search-userinput").innerHTML = "U zocht op " + "'" + query + "'";

          	} else {
          		document.getElementById("search-userinput").innerHTML = "U heeft het zoekveld leeggelaten.";
          		overviewOutput.classList.add("hide");
          		// autoSuggest.SlassList.add("hide");
          	}	
		},
		focusfield: function() {
			var focus = document.getElementById("user-input").focus();
			if(focus){
				// autoSuggest.classList.remove("hide");
			} else {
				// autoSuggest.classList.add("hide");
			}
		},
	};

	// Get data from API
	var collection = {
		get: function(query, minimum, maximum, building) {
			var request = new window.XMLHttpRequest();
			var userInput = query;
			var pageNumber = "1";
			var resultSize = "25"; //max 25 possible in this API
			
			var url = "http://funda.kyrandia.nl/feeds/Aanbod.svc/json/" + app.config.apiKey + "/?type=koop&zo=/" + userInput + "/" + minimum + "-" + maximum + "/" + building + "/&page=" + pageNumber + "&pagesize="+ resultSize +"";
			request.open("GET", url, true);
			request.onload = function() {
			   if (request.status >= 200 && request.status < 400) {
			       // Success!
			       var data = JSON.parse(request.responseText);

			       templates.overview(data);
			       console.log(data);
			       // filter.residences(data);

			   } else {
			       // We reached our target server, but it returned an error

			   }

			};

			request.onerror = function() {
			   // There was a connection error of some sort
			};

			request.send();

			templates.overview(query);
		},
		getResidence: function (GroupByObjectType) {
			var request = new window.XMLHttpRequest();
			var url = "http://funda.kyrandia.nl/feeds/Aanbod.svc/json/detail/" + app.config.apiKey + "/koop/" + GroupByObjectType + "/";

			request.open("GET", url, true);
			request.onload = function() {
			   if (request.status >= 200 && request.status < 400) {
			       	// Success!
			       	var data = JSON.parse(request.responseText);

					templates.detail(data);
					console.log(data);

			   } else {
			       // We reached our target server, but it returned an error
			   }

			};

			request.onerror = function() {
			   // There was a connection error of some sort
			};

			request.send();

			templates.detail(GroupByObjectType);
		},
	};

	// Templating
	var templates = {
		overview: function(data) {
			var rawTemplating = document.getElementById("overview-template").innerHTML;
			var compiledTemplate = Handlebars.compile(rawTemplating);
			var ourGeneratedHTML = compiledTemplate(data);

			var outputArt = document.getElementById("overview");
			outputArt.innerHTML = ourGeneratedHTML;

		},
		detail: function(data) {
			var rawTemplating = document.getElementById("detail-template").innerHTML;
			var compiledTemplate = Handlebars.compile(rawTemplating);
			var ourGeneratedHTML = compiledTemplate(data);

			var outputArt = document.getElementById("detail");
			outputArt.innerHTML = ourGeneratedHTML;

			overviewOutput.classList.add("hide");
          	resultsDetail.classList.remove("hide");
		},
		overviewCity: function(data) {
			var rawTemplating = document.getElementById("overviewCity-template").innerHTML;
			var compiledTemplate = Handlebars.compile(rawTemplating);
			var ourGeneratedHTML = compiledTemplate(data);

			var outputArt = document.getElementById("overviewCity");
			outputArt.innerHTML = ourGeneratedHTML;

			overviewOutput.classList.add("hide");
          	resultsDetail.classList.remove("hide");
		},
		residences: function(data) {
			var rawTemplating = document.getElementById("overviewCity-template").innerHTML;
			var compiledTemplate = Handlebars.compile(rawTemplating);
			var ourGeneratedHTML = compiledTemplate(data);

			var outputArt = document.getElementById("overviewCity");
			outputArt.innerHTML = ourGeneratedHTML;

			overviewOutput.classList.add("hide");
          	resultsDetail.classList.remove("hide");
		}   
	};

	app.init();

})();
function FishermansFriend() {
	// data of the fishes
	this._fishes = _fishlist;
	this._countOfFishes = Object.keys(this._fishes).length;
	this._fishImageExt = ".jpg";
	this._fishImageFolder = "kepek/";
	this._fishImage = "";
	this._fishName = "";
	this._fishLatinName = "";
	this._fishHabitat = "";
	this._fishReproduction = "";
	this._fishNutrition = "";
	this._fishCategory = "";
	this._fishCommonSize = "";
	this._fishLongDescription = "";
	this._fishCloseSeasonStart = "";
	this._fishCloseSeasonEnd = "";
	this._fishSizeLimit = "";
	this._fishQuantityLimit = "";

	// index of fish to be displayed
	this._c = 0;

	// labels
	this._textSizeLimit = "MK: ";
	this._textQtyLimit = "DK: ";
	this._textCloseSeason = "TI: ";
	this._textNoParam = "nincs";
	this._textCentimeter = "cm";
	this._textQuantity = "db/nap";

	this._newLine = "<br/>";

	this._displayEl = undefined;
	this._hunameEl = undefined;
	this._detailsEl = undefined;
	this._mainmenuEl = undefined;
	this._imgEl = undefined;
	this._quizEl = undefined;
	this._learnEl = undefined;
	this._answersEl = undefined;
	this._quizImageEl = undefined;

	// quiz
	this._whatToTest = "";
	this._quizData = Array();
	this._possibleAnswers = 3;
	this._btnDefaultClass = "w3-btn w3-tiny w3-white w3-border w3-border-blue";
	this._btnRightClass = "w3-btn w3-tiny w3-green w3-border w3-border-blue";
	this._btnFalseClass = "w3-btn w3-tiny w3-red w3-border w3-border-blue";
}

FishermansFriend.prototype = {
	constructor: FishermansFriend,

	_randomize: function(max) {
		return Math.floor(Math.random()*max);
	},

	_orderByCategory: function () {
		var tmp = Array();
		var c;
		var s;
		var f;
		for(i=0; i<this._countOfFishes; i++) {
			c = this._fishes[i]["category"];
			s = Object.keys(tmp).length;
			if(s==0) {
				tmp.push(this._fishes[i]);
			}
			else {
				f = false;
				for(j=0; j<s; j++) {
					if(tmp[j]["category"]==c) {
						tmp.splice(j, 0, this._fishes[i]);
						f = true;
						break;
					}	
				}
				if(f==false) {
					tmp.push(this._fishes[i]);
				}
			}
		}
		this._fishes = tmp;
	},

	_orderByName: function() {
		this._fishes = _fishlist;
	},

	_getElements: function () {
		if (typeof this._mainmenuEl === 'undefined') {
			this._displayEl = document.getElementById("details");
			this._mainmenuEl = document.getElementById("mainmenu");
			this._imgEl = document.getElementById("fishImage");
			this._quizEl = document.getElementById("quiz");
			this._learnEl = document.getElementById("learn");
			this._hunameEl = document.getElementById("hu_name");
			this._detailsEl = document.getElementById("details");
			this._answersEl = document.getElementById("answers");
			this._quizImageEl = document.getElementById("quizImage");
		}
	},

	// show mainmenu and hide all the others
	_home: function () {
		if(typeof this._quizEl !== 'undefined') {
			this._quizEl.style.display = 'none';
		}
		if(typeof this._learnEl !== 'undefined') {
			this._learnEl.style.display = 'none';
		}
		if(typeof this._mainmenuEl !== 'undefined') {
			this._mainmenuEl.style.display = 'block';
		}
	},

	// hide 'quiz' div and show 'learn' div
	// reorder the _fishes array if needed
	_browse: function (ordering) {
		if(typeof this._quizEl !== 'undefined') {
			this._quizEl.style.display = 'none';
		}
		if(typeof this._learnEl !== 'undefined') {
			this._learnEl.style.display = 'block';
		}
		if(typeof this._mainmenuEl !== 'undefined') {
			this._mainmenuEl.style.display = 'none';
		}
		if(ordering=="byName") {
			this._orderByName();
		}
		if(ordering=="byCategory") {
			this._orderByCategory();
		}
		this._c = 0;
		this.displayFishImage();
		this.displayFishData();
	},
	// hide 'learn' div and show 'quiz' div
	_learn: function (what) {
	
		if(typeof this._quizEl !== 'undefined') {
			this._quizEl.style.display = 'block';
		}
		if(typeof this._learnEl !== 'undefined') {
			this._learnEl.style.display = 'none';
		}
		if(typeof this._mainmenuEl !== 'undefined') {
			this._mainmenuEl.style.display = 'none';
		}
		
		this._whatToTest = what;
		this._testIt();
	},

	// based on https://gist.github.com/alisterlf/3490957 [BlackCode7]
	removeAccents: function (str) {
	  var accents    = 'ÀÁÂÃÄÅàáâãäåŐÒÓÔÕÕÖØòóôõöőøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
	  var accentsOut = "AAAAAAaaaaaaOOOOOOOOoooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
	  str = str.split('');
	  var strLen = str.length;
	  var i, x;
	  for (i = 0; i < strLen; i++) {
	    if ((x = accents.indexOf(str[i])) != -1) {
	      str[i] = accentsOut[x];
	    }
	    if (str[i]==" ") {
		    str[i] = "_";
	    }
	  }
	  return str.join('');
	},

	generateImageFileName: function (hu_name) {
		this._fishImage = this._fishImageFolder;
		this._fishImage += this.removeAccents(hu_name.toLowerCase());
		this._fishImage += this._fishImageExt;
	},

	displayFishImage: function () {
		this.generateImageFileName(this._fishes[this._c]["hu_name"]);
		this._imgEl.src = this._fishImage;
	},

	displayFishData: function () {
		var ct = cts[this._fishes[this._c]["category"]];
		var sl = this._fishes[this._c]["size_limit"];
		var ql = this._fishes[this._c]["qty_limit"];
		var ss = this._fishes[this._c]["close_season_start"];
		var es = this._fishes[this._c]["close_season_end"];

		if (typeof this._hunameEl !== 'undefined') {
			this._hunameEl.innerHTML = this._fishes[this._c]["hu_name"]+" ["+ct+"]";
		}

		var txt = "<table id='limits' class='details_table'><tbody><tr>";
		txt += "<tr>";
		txt += "<td><img src='kepek/fc16.png' />";
		txt += ""+((ss=="0")?this._textNoParam:ss+" - "+es)+"</td>";
		txt += "<td><img src='kepek/fs16.png' />";
		txt += ""+((sl=="0")?this._textNoParam:sl+this._textCentimeter)+"</td>";
		txt += "<td><img src='kepek/fq16.png' />";
		txt += ""+((ql=="0")?this._textNoParam:ql+this._textQuantity)+"</td>";
		txt += "</tr></tbody></table>";
		if (typeof this._detailsEl !== 'undefined') {
			this._detailsEl.innerHTML = txt;
		}
	},

	displayQuizImage: function (idx) {
		this._quizImageEl.src = this._quizData[idx]["img"];
	},

	displayQuizData: function () {
		if (typeof this._answersEl !== 'undefined') {
			for(i=0; i<this._quizData.length; i++) {
				var btn = document.createElement("span");
				btn.appendChild(document.createTextNode(this._quizData[i]["data"]));
				btn.className = this._btnDefaultClass;
				btn.id = i;
				// use .bind(this) here to be able to access this object's this._rightAnswer
				// member variable from within the onclick callback
				btn.addEventListener("click", this._checkIt.bind(this));
				this._answersEl.appendChild(btn);
			}
		}
	},

	_prev: function () {
		this._c--;

		if (this._c < 0) {
			this._c = this._countOfFishes-1;
		}

		this.displayFishImage();
		this.displayFishData();
	},

	_next: function () {
		this._c++;

		if (this._c >= this._countOfFishes) {
			this._c = 0;
		}

		this.displayFishImage();
		this.displayFishData();
	},

	_testIt: function () {
		var rnd ;

		this._quizData.length = 0;
		this._answersEl.innerHTML = "";

		// get random items from _fishes
		for(i=0; i<this._possibleAnswers; i++) {
			rnd = this._randomize(this._countOfFishes);

			this.generateImageFileName(this._fishes[rnd]["hu_name"]);

			var d = this._whatToTest.split(":");
			var str = "";

			if(d.length==1) {
				str = this._fishes[rnd][d[0]];
			}
			else {
				for(j=0; j<d.length; j++) {
					str += this._fishes[rnd][d[j]];
					if(j<d.length-1) {
						str += " - ";
					}
				}
			}
			this._quizData[i] = {"img": this._fishImage, "data": str};
		}
		// again new random item but now from the 3 collected above
		rnd = this._randomize(this._possibleAnswers);
		this._rightAnswer = rnd;
		this.displayQuizImage(rnd);
		this.displayQuizData();
		console.log(this._rightAnswer);
	},

	_checkIt: function (evt) {
		var el = evt.target;
		// user clicked on the right answer
		if(el.id==this._rightAnswer) {
			el.className = this._btnRightClass;
		}
		else {
			el.className = this._btnFalseClass;
			document.getElementById(this._rightAnswer).className = this._btnRightClass;
		}
	}
};



var version = "Version 0.1 &copy;Istvan Vig 2017. <a href='http://parphis.hu' target='_blank'>parphis.hu</a>";
var quizTypes = {
	0: "choices",
	1: "freetext"
};
function FishermansFriend() {                      
	// data of the fishes
	this._fishes = _fishlist;
	this._countOfFishes = Object.keys(_fishlist).length;
	this._categoryCount = Object.keys(cts).length;
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
	this._textNoLimit = "Nincs korlátozás";
	this._textProtected = "Védett";

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
	this._nextQuestionEl = undefined;

	// quiz
	this._whatToTest = "";
	this._quizData = Array();
	this._quizType;
	this._oneFish; // one fish item
	this._possibleAnswers = 3;
	this._rightAnswer;
	this._btnDefaultClass = "w3-btn w3-tiny w3-white w3-border w3-border-blue";
	this._btnRightClass = "w3-btn w3-tiny w3-green w3-border w3-border-blue";
	this._btnFalseClass = "w3-btn w3-tiny w3-red w3-border w3-border-blue";
	this._uniqueCloseSeasons = Array();
	this._uCloseSeasonsCount;
	this._uniqueSizeLimits = Array();
	this._uSizeLimitsCount;
	this._uniqueQtyLimits = Array();
	this._uQtyLimits;

	var self;
}

FishermansFriend.prototype = {
	constructor: FishermansFriend,

	// functions called from the page begin with _
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
			this._nextQuestionEl = document.getElementById("nextQuestion");
		}
	},

	__init: function () {
		this._getElements();
		
		var ic = is = iq = 0;
		for(i=0; i<this._countOfFishes; i++) {
			var cs = this._fishes[i]["close_season_start"]+" - "+this._fishes[i]["close_season_end"];
			var sl = this._fishes[i]["size_limit"];
			var ql = this._fishes[i]["qty_limit"];

			if(this._uniqueCloseSeasons.indexOf(cs)==-1) {
				this._uniqueCloseSeasons[ic] = cs;
				ic++;
			}
			if(this._uniqueSizeLimits.indexOf(sl)==-1) {
				this._uniqueSizeLimits[is] = sl;
				is++;
			}
			if(this._uniqueQtyLimits.indexOf(ql)==-1) {
				this._uniqueQtyLimits[iq] = ql;
				iq++;
			}
		}
		this._uCloseSeasonsCount = Object.keys(this._uniqueCloseSeasons).length;
		this._uSizeLimitsCount = Object.keys(this._uniqueSizeLimits).length;
		this._uQtyLimitsCount =	Object.keys(this._uniqueQtyLimits).length;

		document.getElementById("version").innerHTML = version;
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
			this.orderByName();
		}
		if(ordering=="byCategory") {
			this.orderByCategory();
		}
		this._c = 0;
		this.displayFishImage();
		this.displayFishData();
	},
	// hide 'learn' div and show 'quiz' div
	_learn: function (what, type) {
	
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
		this._quizType = type;
		this._getRandomElement();
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

	randomize: function (max) {
		return Math.floor(Math.random()*max);
	},

	_getRandomElement: function () {
		var rnd = this.randomize(this._countOfFishes);
		self = this;
		self._quizData.length = 0;
		self._answersEl.innerHTML = "";
		self._nextQuestionEl.style.display = "none";
		// this will be the right answer
		self._oneFish = this._fishes[rnd];
		// get random item's image file name and show it
		this.generateImageFileName(this._fishes[rnd]["hu_name"]);
		this.displayQuizImage();
	},

	orderByCategory: function () {
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

	orderByName: function() {
		this._fishes = _fishlist;
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

	isFishProtected: function (cat) {
		if(cat==4) {
			return self._textProtected;
		}
		else {
			return self._textNoLimit;
		}
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

	displayQuizImage: function () {
		self._quizImageEl.src = this._fishImage;
		self._quizImageEl.addEventListener("click", self.startTest);
	},

	displayQuizData: function () {
		// choices tests
		if(self._quizType==quizTypes[0]) {
			var limit = 0;
			if( (self._whatToTest=="hu_name") || (self._whatToTest=="close_season") || (self._whatToTest=="size_limit") || (self._whatToTest=="qty_limit") ) {
				// reorder the possible answers array randomly
				var rnd = self.randomize(self._possibleAnswers);
				var tmp = "";
				limit = self._possibleAnswers;

				// because the quantity limits contains only 2 kind of data 0 or 3.
				// and no need the randomize process as well
				if(self._whatToTest=="qty_limit") {
					limit--;
					self._rightAnswer = 0;
				}
				else {
					self._rightAnswer = rnd;
					tmp = self._quizData[rnd];
					self._quizData[rnd] = self._quizData[0];
					self._quizData[0] = tmp;
				}
			}
			if(self._whatToTest=="category") {
				limit = self._categoryCount;
				self._rightAnswer = self._oneFish["category"];
			}
			
			for(i=0; i<limit; i++) {
				var btn = document.createElement("span");
				btn.appendChild(document.createTextNode(self._quizData[i]));
				btn.className = self._btnDefaultClass;
				btn.style.clear = "both";
				btn.style.float = "left";
				btn.id = i;
				btn.addEventListener("click", self.checkIt);
				self._answersEl.appendChild(btn);
			}
		}
		// free text typing tests
		if(self._quizType==quizTypes[1]) {
			var inp = document.createElement("input");
			inp.className = "w3-input w3-border";
			inp.type = "text";
			inp.id = "freetext";
			inp.addEventListener("keyup", self.checkIt);
			self._answersEl.appendChild(inp);
			inp.focus();
		}
	},

	startTest: function () {
		// choices tests
		if(self._quizType==quizTypes[0]) {
			// guess the name of the displayed fish from three available answers
			if(self._whatToTest=="hu_name") {
				var i = 0;
				// avoid infinite loop when checking the random names for multiplications
				var tries = 0;
				var max_tries = 5;

				self._quizData[i] = self._oneFish["hu_name"];
				for(i=1; (i<self._possibleAnswers) && (tries<max_tries); i++) {
					var tmp = self._fishes[self.randomize(self._countOfFishes)]["hu_name"];
					if(self._quizData.indexOf(tmp)>-1) {
						i--;
						tries++;
					}
					else {
						self._quizData[i] = tmp;
					}
				}
				self.displayQuizData();
			}
			else if(self._whatToTest=="category") {
				for(i=0; (i<self._categoryCount); i++) {
					self._quizData[i] = cts[i];
				}
				self.displayQuizData();
			}
			else if(self._whatToTest=="close_season") {
				var i = 0;
				// avoid infinite loop when checking the random names for multiplications
				var tries = 0;
				var max_tries = self._countOfFishes;
				var str = "";

				for(i=0; (i<self._possibleAnswers) && (tries<max_tries); i++) {
					var rnd = self.randomize(self._uCloseSeasonsCount);
					if(i==0) {
						str = self._oneFish["close_season_start"]+" - "+self._oneFish["close_season_end"];
					}
					else {
						str = self._uniqueCloseSeasons[rnd];
					}
					if(str=="0 - 0") {
						str = self.isFishProtected(self._oneFish["category"]);
					}
					if(self._quizData.indexOf(str)>-1) {
						i--;
						tries++;
					}
					else {
						self._quizData[i] = str;
					}
				}
				self.displayQuizData();
			}
			else if(self._whatToTest=="size_limit") {
				var i = 0;
				// avoid infinite loop when checking the random names for multiplications
				var tries = 0;
				var max_tries = self._countOfFishes;
				var str = "";

				for(i=0; (i<self._possibleAnswers) && (tries<max_tries); i++) {
					var rnd = self.randomize(self._uSizeLimitsCount);
					if(i==0) {
						str = self._oneFish["size_limit"];
					}
					else {
						str = self._uniqueSizeLimits[rnd];
					}
					if(str=="0") {
						str = self.isFishProtected(self._oneFish["category"]);
					}
					else {
						str += "cm";
					}
					if(self._quizData.indexOf(str)>-1) {
						i--;
						tries++;
					}
					else {
						self._quizData[i] = str;
					}
				}
				self.displayQuizData();
			}
			else if(self._whatToTest=="qty_limit") {
				var str = self._oneFish["qty_limit"];
				if(str=="0") {
					self._quizData[0] = self.isFishProtected(self._oneFish["category"]);
					self._quizData[1] = self._uniqueQtyLimits[1];
				}
				else {
					self._quizData[0] = str+"db/nap";
					self._quizData[1] = self.isFishProtected(self._oneFish["category"]);
				}
				self.displayQuizData();
			}
		}
		// free text typing tests
		if(self._quizType==quizTypes[1]) {
			if(self._whatToTest=="hu_name") {
				self._rightAnswer = self._oneFish["hu_name"];
			}
			self.displayQuizData();
		}

		// remove the click event handler from the fish image first
		self._quizImageEl.removeEventListener("click", self.startTest);
	},

	checkIt: function (evt) {
		var el = evt.target;
		if(self._quizType==quizTypes[0]) {
			// user clicked on the right answer
			if(el.id==self._rightAnswer) {
				el.className = self._btnRightClass;
				self._nextQuestionEl.innerHTML = "Következő kérdés";
			}
			else {
				el.className = self._btnFalseClass;
				document.getElementById(self._rightAnswer).className = self._btnRightClass;
				if(self._whatToTest=="hu_name") {
					self._nextQuestionEl.innerHTML = "A hal neve: "+self._oneFish["hu_name"];
				}
				else if(self._whatToTest=="category") {
					self._nextQuestionEl.innerHTML = self._oneFish["hu_name"]+": "+cts[self._oneFish["category"]];
				}
				else if(self._whatToTest=="close_season") {
					var str = self._oneFish["close_season_start"]+" - "+self._oneFish["close_season_end"];
					if(str=="0 - 0") {
						str = "Nincs korlátozás";
					}
					self._nextQuestionEl.innerHTML = self._oneFish["hu_name"]+": "+str;
				}
				else if(self._whatToTest=="size_limit") {
					var str = self._oneFish["size_limit"];
					if(str=="0") {
						if(self._oneFish["category"]==4) {
							str = self._textProtected;
						}
						else {
							str = self._textNoLimit;
						}
					}
					else {
						str += "cm";
					}
					self._nextQuestionEl.innerHTML = self._oneFish["hu_name"]+": "+str;
				}
				else if(self._whatToTest=="qty_limit") {
					var str = self._oneFish["qty_limit"];
					if(str=="0") {
						if(self._oneFish["category"]==4) {
							str = self._textProtected;
						}
						else {
							str = self._textNoLimit;
						}
					}
					else {
						str += "db/nap";
					}
					self._nextQuestionEl.innerHTML = self._oneFish["hu_name"]+": "+str;
				}
			}
			self._nextQuestionEl.style.display = "block";
		}
		if(self._quizType==quizTypes[1]) {
			if(evt.keyCode==13) {
				if(el.value.toUpperCase()==self._rightAnswer) {
					el.style.backgroundColor = "green";
					self._nextQuestionEl.innerHTML = "Következő kérdés";
				}
				else {
					el.style.backgroundColor = "red";
					self._nextQuestionEl.innerHTML = "A hal neve: "+self._oneFish["hu_name"];
				}
				if(self._nextQuestionEl.style.display=="block") {
					self._getRandomElement();
				}
				else {
					self._nextQuestionEl.style.display = "block";
				}
			}
		}
	}
};



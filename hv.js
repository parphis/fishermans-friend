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
}

FishermansFriend.prototype = {
	constructor: FishermansFriend,

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
	_learn: function () {
	
		if(typeof this._quizEl !== 'undefined') {
			this._quizEl.style.display = 'block';
		}
		if(typeof this._learnEl !== 'undefined') {
			this._learnEl.style.display = 'none';
		}
		if(typeof this._mainmenuEl !== 'undefined') {
			this._mainmenuEl.style.display = 'none';
		}
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

	generateImageFileName: function () {
		this._fishImage = this._fishImageFolder;
		this._fishImage += this.removeAccents(this._fishes[this._c]["hu_name"].toLowerCase());
		this._fishImage += this._fishImageExt;
	},

	displayFishImage: function () {
		this.generateImageFileName();
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
		//txt += "<td colspan='4'>"+ct+"</td></tr>";
		txt += "<tr>";
		txt += "<td><img src='kepek/fc16.png' />";
		txt += ""+((ss=="0")?this._textNoParam:ss+" - "+es)+"</td>";
		txt += "<td><img src='kepek/fs16.png' />";
		txt += ""+((sl=="0")?this._textNoParam:sl+this._textCentimeter)+"</td>";
		txt += "<td><img src='kepek/fq16.png' />";
		txt += ""+((ql=="0")?this._textNoParam:ql+this._textQuantity)+"</td>";
		txt += "</tr></tbody></table>";
		if (typeof this._hunameEl !== 'undefined') {
			this._detailsEl.innerHTML = txt;
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
	}
};



/// <reference path="utils.ts" />
/// <reference path="gestures.ts" />

declare function ContextMenu() : void;
declare function showMenu(event, parent, items) : void;
declare var CustomEvent: {
    prototype: CustomEvent;
    new(): CustomEvent;
}

var context_menu = new ContextMenu();

class StandardsCustomEvent {
    static get(eventType: string, data: {}) {
        var customEvent = <any>CustomEvent;
        var event = new customEvent(eventType, data);
        return <CustomEvent> event;
    }
}

// algoritm to get a key
module keyGiver {
		
	export class KeyGiver {
		
		list : utils.PairArray = [];
		listS : utils.PairArrayS = [];
		private timer;
	
		minX : number;
		minY : number;
		maxX : number;
		maxY : number;
		
		gestures : gestures.Gesture[];
		
		constructor (public newList : utils.PairArray, public oldGesture : gestures.Gesture[]) {
			this.gestures = oldGesture;
			this.list = newList;
			this.minX = newList[0].first;
			this.minY = newList[0].second;
			this.maxX = newList[0].first;
			this.maxY = newList[0].second;
			for (var i = 0; i < this.list.length; i++) {
				if (this.list[i].first < this.minX) this.minX = this.list[i].first;
				if (this.list[i].first > this.maxX) this.maxX = this.list[i].first;
				if (this.list[i].second < this.minY) this.minY = this.list[i].second;
				if (this.list[i].second > this.maxY) this.maxY = this.list[i].second; 
			}
		}
		
		getSymbol(pair : utils.Pair)
		{
			var curAr1 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
			var curNumX = pair.first - this.minX;
			var curNumY = pair.second - this.minY;
			
			return curAr1[Math.floor((curNumX) / Math.floor((this.maxX + 8 - this.minX) / 8))] + 
				+ (Math.floor((curNumY) / Math.floor((this.maxY + 8 - this.minY) / 8)));
		}
		
		public getKey() {
			var key = [];
			var index = 0;
			var str1 = this.getSymbol(this.list[0]);
			key[index] = str1;
			index++;
			for (var i = 1; i < this.list.length; i++) {
				var str2 = this.getSymbol(this.list[i]);
				if (str2 != str1) {
					str1 = str2;
					key[index] = str1;
					index++; 
				}
			}
			this.isGesture(key);
			return key;
		}
		
		
		
		isGesture(key) {
	        var result = 1000; //Pseudo-infinite value
	        var num = -1;
	        for (var i = 0; i < this.gestures.length; i++)
			{
				var curr = this.gestures[i];
				var prevKey = i - 1;
	            var curRes = this.levenshtein(this.gestures[i].key, key) / Math.max(this.gestures[i].key.length, key.length);
	           
	            while (prevKey >=0 
	            	&& this.levenshtein(this.gestures[prevKey].key, key) / Math.max(this.gestures[prevKey].key.length, key.length) > curRes)
	            {
	            	this.gestures[prevKey + 1] = this.gestures[prevKey];
	            	this.gestures[prevKey] = curr;
	            	prevKey--;
	            }	
	        }
	        var str = "";
	        var prevKey = 0;
	        while(prevKey < this.gestures.length && this.levenshtein(this.gestures[prevKey].key, key) 
	        	/ Math.max(this.gestures[prevKey].key.length, key.length) <= 0.66)
	        	prevKey++;
	       	
	       	if (prevKey === 0)
	       		return;
	        	
	        for (var i = 0; i < prevKey; ++i)
	        	str += this.gestures[i].name + "\n";
	        
	        var names = new Array();
	        for (var i = 0; i < prevKey; ++i)
	        	names[i] = this.gestures[i].name;
	        	
	        var getItems = function() {
				var items = new Array();
				for (var i = 0; i < prevKey; ++i) {
					items.push({"name": names[i], "action": function() { alert(names[i]); }});
				//	items.push({"name": "item"+i, "action": function() { alert(this.name); }});
				}
				return items;
			}
			
			var x = StandardsCustomEvent.get("myevent", {
					detail: {
						message: "Hello World!",
						time: new Date(),
					},
					bubbles: true,
					cancelable: true
				});
				
			function temp(e) {
				e.preventDefault();
				context_menu.showMenu("myevent", this, getItems());
			}
			document.getElementById('place').addEventListener("myevent", temp, false);
			document.getElementById('place').setAttribute("oncontextmenu", "javascript: context_menu.showMenu('myevent', this, getItems());");		
			document.getElementById('place').dispatchEvent(x);
			document.getElementById('place').removeEventListener("myevent", temp, false);
		}
		
		// Calculate levenshtain's distance between s1 and s2
		levenshtein(s1, s2) {
		    var i, j, l1, l2, flip, ch, chl, ii, ii2, cost, cutHalf;
		    l1 = s1.length;
		    l2 = s2.length;
		 
		    var cr = 1;
		    var cri = 1;
		    var ci = 1;
		    var cd = 1;
		 
		    cutHalf = flip = Math.max(l1, l2);
		 
		    var minCost = Math.min(cd, ci, cr);
		    var minD = Math.max(minCost, (l1 - l2) * cd);
		    var minI = Math.max(minCost, (l2 - l1) * ci);
		    var buf = new Array((cutHalf * 2) - 1);
		 
		    for (i = 0; i <= l2; ++i) {
		        buf[i] = i * minD;
		    }
		 
		    for (i = 0; i < l1; ++i, flip = cutHalf - flip) {
		        ch = s1[i];
		        chl = ch;
		 
		        buf[flip] = (i + 1) * minI;
		 
		        ii = flip;
		        ii2 = cutHalf - flip;
		 
		        for (j = 0; j < l2; ++j, ++ii, ++ii2) {
		            cost = (ch === s2[j] ? 0 : (chl === s2[j]) ? cri : cr);
		            buf[ii + 1] = Math.min(buf[ii2 + 1] + cd, buf[ii] + ci, buf[ii2] + cost);
		        }
		    }
		    return buf[l2 + cutHalf - flip];
		}
	}
}
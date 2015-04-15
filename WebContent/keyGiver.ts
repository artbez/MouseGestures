/// <reference path="utils.ts" />
/// <reference path="gestures.ts" />

// algoritm to get a key
module keyGiver {
		
	export class KeyGiver {
		
		list : utils.PairArray = [];
		listS : utils.PairArrayS = [];
		
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
	            var curRes = this.levenshtein(this.gestures[i].key, key) / Math.max(this.gestures[i].key.length, key.length);
	            if (curRes < result) {
	                result = curRes;
	                num = i;
	            }
	        }
	        if (result <= 0.6) 
	            alert("Yes!, This is " + this.gestures[num].name);
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
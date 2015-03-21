class Pair {
	first: number;
	second: number;
	
	constructor (public newFirst : number, public newSecond : number) {
		this.first = newFirst;
		this.second = newSecond;
	}
}

class PairString {
	first: string;
	second: string;
	
	constructor (public curString: string) {
		var index = curString.indexOf(" ");
		this.first = curString.substr(0, index);
		this.second = curString.substr(index, curString.length - index);
	}
	
	getString() {
		return this.first + " - " + this.second;
	}
} 

interface PairArray {
	[index: number]: Pair;
	length: number;
	push;
}

interface PairArrayS {
	[index: number]: PairString;
	length: number;
	push;
}

class KeyGiver {
	
	list : PairArray = [];
	listS : PairArrayS = [];
	
	minX : number;
	minY : number;
	maxX : number;
	maxY : number;
	
	gesture : string[];
	
	constructor (public newList : PairArray, public oldGesture : string[]) {
		this.gesture = oldGesture;
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
	
	getSymbol(pair : Pair)
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
		var result = this.levenshtein(this.gesture, key) / Math.max(this.gesture.length, key.length);
		alert(result);
		if (result <= 0.6)
			alert("Yes!, This is horizontal left-right line");
	}
	
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

class Greeter {
	
	list : PairArray = [];
	p: Pair;
	keyG : KeyGiver;
	example : HTMLCanvasElement
	private ctx;
	private timer;
    data : string[];
	
	constructor () {
		this.getDevelopersList();
		this.example = <HTMLCanvasElement> document.getElementById('example');
		this.ctx = this.example.getContext('2d');
		this.onMouseDown = <any>this.onMouseDown.bind(this);
		this.example.addEventListener('mousedown', this.onMouseDown);
		this.onMouseUp = <any>this.onMouseUp.bind(this);
		document.addEventListener('mouseup', this.onMouseUp);
	}
	
	onMouseDown(e) {
		this.ctx.strokeStyle = "blue";
		this.onMouseMove = <any>this.onMouseMove.bind(this);
		this.example.addEventListener('mousemove', this.onMouseMove);
		delete this.list;
		this.list = [];
		this.ctx.beginPath();
	}
	
	onMouseUp()
	{
		this.example.removeEventListener('mousemove', this.onMouseMove);
		this.keyG = new KeyGiver(this.list, this.data);
		var newKey = this.keyG.getKey();
		var outputString = "";
		for (var i = 0; i < newKey.length; i++)
			outputString += newKey[i];
		(<HTMLInputElement>document.getElementById('key')).value = outputString;
		this.timer = setTimeout(() => this.reconstruct(), 500);
	}
	
	onMouseMove(e)
	{  
		var inputValueX = (<HTMLInputElement>document.getElementById('mouseX'));
		var inputValueY = (<HTMLInputElement>document.getElementById('mouseY'));
		this.p = new Pair(e.pageX - this.example.offsetLeft, e.pageY - this.example.offsetTop);
		this.list.push(this.p);
		
		this.ctx.lineTo(this.p.first, this.p.second);
		this.ctx.stroke();
		inputValueX.value = (e.pageX - this.example.offsetLeft).toString();	
		inputValueY.value = (e.pageY - this.example.offsetTop).toString();
	}
	
	reconstruct() {
		this.ctx.strokeStyle = "black";
		this.ctx.clearRect(0, 0, this.example.width, this.example.height);
		this.ctx.strokeRect(0, 0, this.example.width, this.example.height);	
	}
	
	downloadData(url, success) {
	    var xhr = new XMLHttpRequest();
	    xhr.open('GET', url, true);
	    xhr.onreadystatechange = function(e) {
	        if (xhr.readyState == 4) {
	            if (xhr.status == 200) {
	                success(xhr);
	            }
	        }
	    }
	    xhr.send();
	}

	getDevelopersList() {
	    var url = "gestures.txt";
	    this.downloadData(url, this.recieveDevelopersList.bind(this));
	}
	
	recieveDevelopersList(xhr) {
	    var fileData = xhr.responseText;
	    var newData = [];
	    var index = -1;
	    for (var i = 0; i < fileData.length; i++)
	    {
	    	if (i % 2 == 0) {
	    		index++;
	    		newData[index] = "";	
	    	}
	    	newData[index] += fileData[i];	
	    }
	    this.data = newData;
	}
	
}

new Greeter();
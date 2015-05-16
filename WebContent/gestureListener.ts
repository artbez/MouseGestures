/// <reference path='utils.ts' />
/// <reference path="gestures.ts" />
/// <reference path="keyGiver.ts" />
// catch mouse events and handle it
			
class GestureListener {
	
	list : utils.PairArray = [];
	p: utils.Pair;
	flagDraw : boolean;
	state : number;
	keyG : keyGiver.KeyGiver;
	example : HTMLCanvasElement
	private ctx;
	private timer;
	private d;
	private currentTime;
	currentPair : utils.Pair;
	speed : number;
	a : number;
	c : number;
    data : gestures.Gesture[];	
	constructor () {
		this.a = 1;
		this.c = 0.0275;
		this.state = 0;
		this.loadGestures();
		this.example = <HTMLCanvasElement> document.getElementById('example');
		this.ctx = this.example.getContext('2d');
		this.onMouseDown = <any>this.onMouseDown.bind(this);
		this.example.addEventListener('mousedown', this.onMouseDown);
		this.onMouseUp = <any>this.onMouseUp.bind(this);
		document.addEventListener('mouseup', this.onMouseUp);
	}
	
	smoothing(pair1 : utils.Pair, pair2 : utils.Pair, diff : number) {
		var b = Math.exp(-this.c * diff);
		return new utils.Pair(pair2.first * b + (1 - b) * pair1.first
								, pair2.second + (1 - b) * pair1.second);
	}
	
	onMouseDown(e) {
		if (context_menu.isVisible())
		{
			return;
		}
		if (this.flagDraw == false)
		{
			clearTimeout(this.timer);	
			this.flagDraw = true;
		}
		
		this.ctx.beginPath();
		if (this.state === 0)
		{
			delete this.list;
			this.list = [];
			this.state = 1;
		}
		this.ctx.strokeStyle = "blue";
		this.onMouseMove = <any>this.onMouseMove.bind(this);
		this.example.addEventListener('mousemove', this.onMouseMove);
		this.d = new Date();
		this.currentTime = this.d.getTime();
		this.currentPair = new utils.Pair(e.pageX - this.example.offsetLeft, e.pageY - this.example.offsetTop);
		this.onMouseMove(e);
	}
	
	onMouseUp() {
		if (this.list.length === 0)
			return;
		this.example.removeEventListener('mousemove', this.onMouseMove);
		this.flagDraw = false;
		this.timer = setTimeout(() => this.finishDraw(), 1000);	
	}
	
	finishDraw() {
		if (this.flagDraw === true)
			return;
		this.keyG = new keyGiver.KeyGiver(this.list, this.data);
		var newKey = this.keyG.getKey();
		var outputString = "";
		for (var i = 0; i < newKey.length; i++)
			outputString += newKey[i];
		this.list = [];
		(<HTMLInputElement>document.getElementById('key')).value = outputString;
		this.reconstruct();
	}
	
	onMouseMove(e)
	{  
		if (this.flagDraw === false)
			return;
	
		var inputValueX = (<HTMLInputElement>document.getElementById('mouseX'));
		var inputValueY = (<HTMLInputElement>document.getElementById('mouseY'));
		this.p = new utils.Pair(e.pageX - this.example.offsetLeft, e.pageY - this.example.offsetTop);
		var n = this.d.getTime();
		var diff = n - this.currentTime;
		this.currentTime = n;
		this.p = this.smoothing(this.currentPair, this.p, diff);
		this.currentPair = this.p;
		this.list.push(this.p);
		this.ctx.lineTo(this.p.first, this.p.second);
		this.ctx.stroke();
		inputValueX.value = (e.pageX - this.example.offsetLeft).toString();	
		inputValueY.value = (e.pageY - this.example.offsetTop).toString();
	}
	
	reconstruct() {
		this.state = 0;
		this.ctx.strokeStyle = "black";
		this.ctx.clearRect(0, 0, this.example.width, this.example.height);
		this.ctx.strokeRect(0, 0, this.example.width, this.example.height);	
	}
	
	// download file with gestures 
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

	loadGestures() {
	    var url = "gestures.json";
	    this.downloadData(url, this.processGestures.bind(this));
	}
	
	processGestures(xhr) {
	    var fileData = JSON.parse(xhr.responseText);
        this.data = [];
        for (var i = 0; i < fileData.length; i++) 
	       this.data[i] = new gestures.Gesture(<string> fileData[i].name, <string[]> fileData[i].key, <number> fileData[i].factor);
	}
	
}
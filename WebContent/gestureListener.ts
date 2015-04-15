/// <reference path="utils.ts" />
/// <reference path="gestures.ts" />
/// <reference path="keyGiver.ts" />

// catch mouse events and handle it
class GestureListener {
	
	list : utils.PairArray = [];
	p: utils.Pair;
	keyG : keyGiver.KeyGiver;
	example : HTMLCanvasElement
	private ctx;
	private timer;
    data : gestures.Gesture[];	
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
	
	onMouseUp() {
		this.example.removeEventListener('mousemove', this.onMouseMove);
		this.keyG = new keyGiver.KeyGiver(this.list, this.data);
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
		this.p = new utils.Pair(e.pageX - this.example.offsetLeft, e.pageY - this.example.offsetTop);
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

	getDevelopersList() {
	    var url = "gestures.json";
	    this.downloadData(url, this.recieveDevelopersList.bind(this));
	}
	
	recieveDevelopersList(xhr) {
	    var fileData = JSON.parse(xhr.responseText);
        this.data = [];
        for (var i = 0; i < fileData.length; i++) 
	       this.data[i] = new gestures.Gesture(<string> fileData[i].name, <string[]> fileData[i].key);
	}
	
}

new GestureListener();
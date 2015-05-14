/// <reference path='utils.ts' />
/// <reference path="gestures.ts" />
/// <reference path="keyGiver.ts" />
// catch mouse events and handle it
var GestureListener = (function () {
    function GestureListener() {
        this.list = [];
        this.a = 1;
        this.c = 0.0275;
        this.state = 0;
        this.getDevelopersList();
        this.example = document.getElementById('example');
        this.ctx = this.example.getContext('2d');
        this.onMouseDown = this.onMouseDown.bind(this);
        this.example.addEventListener('mousedown', this.onMouseDown);
        this.onMouseUp = this.onMouseUp.bind(this);
        document.addEventListener('mouseup', this.onMouseUp);
    }
    GestureListener.prototype.smoothing = function (pair1, pair2, diff) {
        var b = Math.exp(-this.c * diff);
        return new utils.Pair(pair2.first * b + (1 - b) * pair1.first, pair2.second + (1 - b) * pair1.second);
    };
    GestureListener.prototype.onMouseDown = function (e) {
        if (context_menu.isVisible()) {
            return;
        }
        if (this.flagDraw == false) {
            clearTimeout(this.timer);
            this.flagDraw = true;
        }
        this.ctx.beginPath();
        if (this.state === 0) {
            delete this.list;
            this.list = [];
            this.state = 1;
        }
        this.ctx.strokeStyle = "blue";
        this.onMouseMove = this.onMouseMove.bind(this);
        this.example.addEventListener('mousemove', this.onMouseMove);
        this.d = new Date();
        this.currentTime = this.d.getTime();
        this.currentPair = new utils.Pair(e.pageX - this.example.offsetLeft, e.pageY - this.example.offsetTop);
        this.onMouseMove(e);
    };
    GestureListener.prototype.onMouseUp = function () {
        var _this = this;
        if (this.list.length === 0)
            return;
        this.example.removeEventListener('mousemove', this.onMouseMove);
        this.flagDraw = false;
        this.timer = setTimeout(function () { return _this.finishDraw(); }, 1000);
    };
    GestureListener.prototype.finishDraw = function () {
        if (this.flagDraw === true)
            return;
        this.keyG = new keyGiver.KeyGiver(this.list, this.data);
        var newKey = this.keyG.getKey();
        var outputString = "";
        for (var i = 0; i < newKey.length; i++)
            outputString += newKey[i];
        this.list = [];
        document.getElementById('key').value = outputString;
        this.reconstruct();
    };
    GestureListener.prototype.onMouseMove = function (e) {
        if (this.flagDraw === false)
            return;
        var inputValueX = document.getElementById('mouseX');
        var inputValueY = document.getElementById('mouseY');
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
    };
    GestureListener.prototype.reconstruct = function () {
        this.state = 0;
        this.ctx.strokeStyle = "black";
        this.ctx.clearRect(0, 0, this.example.width, this.example.height);
        this.ctx.strokeRect(0, 0, this.example.width, this.example.height);
    };
    // download file with gestures 
    GestureListener.prototype.downloadData = function (url, success) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    success(xhr);
                }
            }
        };
        xhr.send();
    };
    GestureListener.prototype.getDevelopersList = function () {
        var url = "gestures.json";
        this.downloadData(url, this.recieveDevelopersList.bind(this));
    };
    GestureListener.prototype.recieveDevelopersList = function (xhr) {
        var fileData = JSON.parse(xhr.responseText);
        this.data = [];
        for (var i = 0; i < fileData.length; i++)
            this.data[i] = new gestures.Gesture(fileData[i].name, fileData[i].key);
    };
    return GestureListener;
})();
//# sourceMappingURL=gestureListener.js.map
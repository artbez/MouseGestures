/// <reference path="utils.ts" />
/// <reference path="gestures.ts" />
/// <reference path="keyGiver.ts" />
// catch mouse events and handle it
var GestureListener = (function () {
    function GestureListener() {
        this.list = [];
        this.getDevelopersList();
        this.example = document.getElementById('example');
        this.ctx = this.example.getContext('2d');
        this.onMouseDown = this.onMouseDown.bind(this);
        this.example.addEventListener('mousedown', this.onMouseDown);
        this.onMouseUp = this.onMouseUp.bind(this);
        document.addEventListener('mouseup', this.onMouseUp);
    }
    GestureListener.prototype.onMouseDown = function (e) {
        this.ctx.strokeStyle = "blue";
        this.onMouseMove = this.onMouseMove.bind(this);
        this.example.addEventListener('mousemove', this.onMouseMove);
        delete this.list;
        this.list = [];
        this.ctx.beginPath();
    };
    GestureListener.prototype.onMouseUp = function () {
        var _this = this;
        this.example.removeEventListener('mousemove', this.onMouseMove);
        this.keyG = new keyGiver.KeyGiver(this.list, this.data);
        var newKey = this.keyG.getKey();
        var outputString = "";
        for (var i = 0; i < newKey.length; i++)
            outputString += newKey[i];
        document.getElementById('key').value = outputString;
        this.timer = setTimeout(function () { return _this.reconstruct(); }, 500);
    };
    GestureListener.prototype.onMouseMove = function (e) {
        var inputValueX = document.getElementById('mouseX');
        var inputValueY = document.getElementById('mouseY');
        this.p = new utils.Pair(e.pageX - this.example.offsetLeft, e.pageY - this.example.offsetTop);
        this.list.push(this.p);
        this.ctx.lineTo(this.p.first, this.p.second);
        this.ctx.stroke();
        inputValueX.value = (e.pageX - this.example.offsetLeft).toString();
        inputValueY.value = (e.pageY - this.example.offsetTop).toString();
    };
    GestureListener.prototype.reconstruct = function () {
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
new GestureListener();
//# sourceMappingURL=gestureListener.js.map
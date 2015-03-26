var Pair = (function () {
    function Pair(newFirst, newSecond) {
        this.newFirst = newFirst;
        this.newSecond = newSecond;
        this.first = newFirst;
        this.second = newSecond;
    }
    return Pair;
})();
var PairString = (function () {
    function PairString(curString) {
        this.curString = curString;
        var index = curString.indexOf(" ");
        this.first = curString.substr(0, index);
        this.second = curString.substr(index, curString.length - index);
    }
    PairString.prototype.getString = function () {
        return this.first + " - " + this.second;
    };
    return PairString;
})();
var Gesture = (function () {
    function Gesture(newName, newKey) {
        this.newName = newName;
        this.newKey = newKey;
        this.name = newName;
        this.key = newKey;
    }
    return Gesture;
})();
var KeyGiver = (function () {
    function KeyGiver(newList, oldGesture) {
        this.newList = newList;
        this.oldGesture = oldGesture;
        this.list = [];
        this.listS = [];
        this.gestures = oldGesture;
        this.list = newList;
        this.minX = newList[0].first;
        this.minY = newList[0].second;
        this.maxX = newList[0].first;
        this.maxY = newList[0].second;
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].first < this.minX)
                this.minX = this.list[i].first;
            if (this.list[i].first > this.maxX)
                this.maxX = this.list[i].first;
            if (this.list[i].second < this.minY)
                this.minY = this.list[i].second;
            if (this.list[i].second > this.maxY)
                this.maxY = this.list[i].second;
        }
    }
    KeyGiver.prototype.getSymbol = function (pair) {
        var curAr1 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        var curNumX = pair.first - this.minX;
        var curNumY = pair.second - this.minY;
        return curAr1[Math.floor((curNumX) / Math.floor((this.maxX + 8 - this.minX) / 8))] + +(Math.floor((curNumY) / Math.floor((this.maxY + 8 - this.minY) / 8)));
    };
    KeyGiver.prototype.getKey = function () {
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
    };
    KeyGiver.prototype.isGesture = function (key) {
        var result = 1000; //Pseudo-infinite value
        var num = -1;
        for (var i = 0; i < this.gestures.length; i++) {
            var curRes = this.levenshtein(this.gestures[i].key, key) / Math.max(this.gestures[i].key.length, key.length);
            if (curRes < result) {
                result = curRes;
                num = i;
            }
        }
        if (result <= 0.6)
            alert("Yes!, This is " + this.gestures[num].name);
    };
    KeyGiver.prototype.levenshtein = function (s1, s2) {
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
    };
    return KeyGiver;
})();
var Greeter = (function () {
    function Greeter() {
        this.list = [];
        this.getDevelopersList();
        this.example = document.getElementById('example');
        this.ctx = this.example.getContext('2d');
        this.onMouseDown = this.onMouseDown.bind(this);
        this.example.addEventListener('mousedown', this.onMouseDown);
        this.onMouseUp = this.onMouseUp.bind(this);
        document.addEventListener('mouseup', this.onMouseUp);
    }
    Greeter.prototype.onMouseDown = function (e) {
        this.ctx.strokeStyle = "blue";
        this.onMouseMove = this.onMouseMove.bind(this);
        this.example.addEventListener('mousemove', this.onMouseMove);
        delete this.list;
        this.list = [];
        this.ctx.beginPath();
    };
    Greeter.prototype.onMouseUp = function () {
        var _this = this;
        this.example.removeEventListener('mousemove', this.onMouseMove);
        this.keyG = new KeyGiver(this.list, this.data);
        var newKey = this.keyG.getKey();
        var outputString = "";
        for (var i = 0; i < newKey.length; i++)
            outputString += newKey[i];
        document.getElementById('key').value = outputString;
        this.timer = setTimeout(function () { return _this.reconstruct(); }, 500);
    };
    Greeter.prototype.onMouseMove = function (e) {
        var inputValueX = document.getElementById('mouseX');
        var inputValueY = document.getElementById('mouseY');
        this.p = new Pair(e.pageX - this.example.offsetLeft, e.pageY - this.example.offsetTop);
        this.list.push(this.p);
        this.ctx.lineTo(this.p.first, this.p.second);
        this.ctx.stroke();
        inputValueX.value = (e.pageX - this.example.offsetLeft).toString();
        inputValueY.value = (e.pageY - this.example.offsetTop).toString();
    };
    Greeter.prototype.reconstruct = function () {
        this.ctx.strokeStyle = "black";
        this.ctx.clearRect(0, 0, this.example.width, this.example.height);
        this.ctx.strokeRect(0, 0, this.example.width, this.example.height);
    };
    Greeter.prototype.downloadData = function (url, success) {
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
    Greeter.prototype.getDevelopersList = function () {
        var url = "gestures.json";
        this.downloadData(url, this.recieveDevelopersList.bind(this));
    };
    Greeter.prototype.recieveDevelopersList = function (xhr) {
        var fileData = JSON.parse(xhr.responseText);
        this.data = [];
        for (var i = 0; i < fileData.length; i++)
            this.data[i] = new Gesture(fileData[i].name, fileData[i].key);
    };
    return Greeter;
})();
new Greeter();
//# sourceMappingURL=gestures.js.map
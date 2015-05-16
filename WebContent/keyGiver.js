/// <reference path="utils.ts" />
/// <reference path="gestures.ts" />
var context_menu = new ContextMenu();
var StandardsCustomEvent = (function () {
    function StandardsCustomEvent() {
    }
    StandardsCustomEvent.get = function (eventType, data) {
        var customEvent = CustomEvent;
        var event = new customEvent(eventType, data);
        return event;
    };
    return StandardsCustomEvent;
})();
// algoritm to get a key
var keyGiver;
(function (keyGiver) {
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
            for (var i = 1; i < this.list.length; i++) {
                if (this.list[i].first < this.minX)
                    this.minX = this.list[i].first;
                if (this.list[i].first > this.maxX)
                    this.maxX = this.list[i].first;
                if (this.list[i].second < this.minY)
                    this.minY = this.list[i].second;
                if (this.list[i].second > this.maxY)
                    this.maxY = this.list[i].second;
            }
            if (this.maxX - this.minX > this.maxY - this.minY) {
                var ratio = (this.maxY - this.minY) / (this.maxX - this.minX);
                var midValue = (this.maxY + this.minY) / 2;
                for (var i = 0; i < this.list.length; i++) {
                    this.list[i].second = midValue - (midValue - this.list[i].second) * ratio;
                }
            }
            if (this.maxX - this.minX < this.maxY - this.minY) {
                var ratio = (this.maxX - this.minX) / (this.maxY - this.minY);
                var midValue = (this.maxX + this.minX) / 2;
                for (var i = 0; i < this.list.length; i++) {
                    this.list[i].first = midValue - (midValue - this.list[i].first) * ratio;
                }
            }
            this.minX = newList[0].first;
            this.minY = newList[0].second;
            for (var i = 1; i < this.list.length; i++) {
                if (this.list[i].first < this.minX)
                    this.minX = this.list[i].first;
                if (this.list[i].second < this.minY)
                    this.minY = this.list[i].second;
            }
        }
        KeyGiver.prototype.getSymbol = function (pair) {
            var curAr1 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
            var curNumX = pair.first - this.minX;
            var curNumY = pair.second - this.minY;
            return curAr1[Math.floor(curNumX * 9 / (this.maxX + 1 - this.minX))] + +(Math.floor(curNumY * 9 / Math.floor(this.maxY + 1 - this.minY)));
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
            key.sort();
            for (var i = key.length - 2; i >= 0; i--) {
                if (key[i] === key[i + 1])
                    key.splice(i, 1);
            }
            this.isGesture(key);
            return key;
        };
        KeyGiver.prototype.isGesture = function (key) {
            var result = 1000; //Pseudo-infinite value
            var num = -1;
            for (var i = 0; i < this.gestures.length; i++) {
                var curr = this.gestures[i];
                var prevKey = i - 1;
                var curRes = this.levenshtein(this.gestures[i].key, key) / Math.max(this.gestures[i].key.length, key.length);
                while (prevKey >= 0 && this.levenshtein(this.gestures[prevKey].key, key) / Math.max(this.gestures[prevKey].key.length, key.length) > curRes) {
                    this.gestures[prevKey + 1] = this.gestures[prevKey];
                    this.gestures[prevKey] = curr;
                    prevKey--;
                }
            }
            var str = "";
            var prevKey = 0;
            while (prevKey < this.gestures.length && this.levenshtein(this.gestures[prevKey].key, key) / Math.max(this.gestures[prevKey].key.length, key.length) <= this.gestures[prevKey].factor)
                prevKey++;
            if (prevKey === 0)
                return;
            for (var i = 0; i < prevKey; ++i)
                str += this.gestures[i].name + "\n";
            var names = new Array();
            for (var i = 0; i < prevKey; ++i)
                names[i] = this.gestures[i].name;
            var getItems = function () {
                var items = new Array();
                for (var i = 0; i < prevKey; ++i) {
                    items.push({ "name": names[i], "action": function (text) {
                        alert(text);
                    }.bind(null, names[i]) });
                }
                return items;
            };
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
        };
        // Calculate levenshtain's distance between s1 and s2
        KeyGiver.prototype.levenshtein = function (s1, s2) {
            var ans = 0;
            for (var i = 0; i < s1.length; i++) {
                var minDist = 1000;
                for (var j = 0; j < s2.length; j++) {
                    var d1 = Math.abs(s1[i].charCodeAt(0) - s2[j].charCodeAt(0));
                    var d2 = Math.abs(s1[i][1] - s2[j][1]);
                    if (d1 + d2 < minDist)
                        minDist = d1 + d2;
                }
                ans += minDist;
            }
            for (var i = 0; i < s2.length; i++) {
                var minDist = 1000;
                for (var j = 0; j < s1.length; j++) {
                    var d1 = Math.abs(s2[i].charCodeAt(0) - s1[j].charCodeAt(0));
                    var d2 = Math.abs(s2[i][1] - s1[j][1]);
                    if (d1 + d2 < minDist)
                        minDist = d1 + d2;
                }
                ans += minDist;
            }
            return ans / 2;
        };
        return KeyGiver;
    })();
    keyGiver.KeyGiver = KeyGiver;
})(keyGiver || (keyGiver = {}));
//# sourceMappingURL=keyGiver.js.map
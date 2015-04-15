var utils;
(function (utils) {
    var Pair = (function () {
        function Pair(newFirst, newSecond) {
            this.newFirst = newFirst;
            this.newSecond = newSecond;
            this.first = newFirst;
            this.second = newSecond;
        }
        return Pair;
    })();
    utils.Pair = Pair;
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
    utils.PairString = PairString;
})(utils || (utils = {}));
//# sourceMappingURL=utils.js.map
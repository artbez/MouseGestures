var gestures;
(function (gestures) {
    var Gesture = (function () {
        function Gesture(newName, newKey) {
            this.newName = newName;
            this.newKey = newKey;
            this.name = newName;
            this.key = newKey;
        }
        return Gesture;
    })();
    gestures.Gesture = Gesture;
})(gestures || (gestures = {}));
//# sourceMappingURL=gestures.js.map
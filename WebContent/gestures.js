var gestures;
(function (gestures) {
    var Gesture = (function () {
        function Gesture(newName, newKey, newFactor) {
            this.newName = newName;
            this.newKey = newKey;
            this.newFactor = newFactor;
            this.name = newName;
            this.key = newKey;
            this.factor = newFactor;
        }
        return Gesture;
    })();
    gestures.Gesture = Gesture;
})(gestures || (gestures = {}));
//# sourceMappingURL=gestures.js.map
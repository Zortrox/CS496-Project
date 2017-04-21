var controller;
window.onload = function() {
    console.log("touchscreen is", VirtualJoystick.touchScreenAvailable() ? "available" : "not available");

    var stickLeft = new VirtualJoystick({
        container: $(".left-stick")[0],
        mouseSupport: true,
        limitStickTravel: true,
        strokeStyle: "#060"
    });
    var stickRight = new VirtualJoystick({
        container: $(".right-stick")[0],
        mouseSupport: true,
        limitStickTravel: true,
        strokeStyle: "#600"
    });

    controller = new Controller();
    controller.data["leftMag"] = 0;
    controller.data["leftAng"] = 0;
    controller.data["rightMag"] = 0;
    controller.data["rightAng"] = 0;

	//Handles the Joystick
    setInterval(function () {
        sendFlag = false;

        var leftX = stickLeft.deltaX();
        var leftY = stickLeft.deltaY();
        var leftMag = Math.sqrt(leftX * leftX + leftY * leftY);
        var leftAng = Math.atan(leftY, leftX);

        var rightX = stickRight.deltaX();
        var rightY = stickRight.deltaY();
        var rightMag = Math.sqrt(rightX * rightX + rightY * rightY);
        var rightAng = Math.atan(rightY, rightX);

        newData = {};
        newData["leftMag"] = leftMag;
        newData["leftAng"] = leftAng;
        newData["rightMag"] = rightMag;
        newData["rightAng"] = rightAng;

        if (controller.data["leftMag"] != leftMag) {
            sendFlag = true;
        } else if (controller.data["leftAng"] != leftAng) {
            sendFlag = true;
        } else if (controller.data["rightMag"] != rightMag) {
            sendFlag = true;
        } else if (controller.data["rightAng"] != rightAng) {
            sendFlag = true;
        }

        if (sendFlag) {
            controller.data = newData;
            controller.sendState();
        }
    }, 1 / 30 * 1000);

    controller.setup();
}

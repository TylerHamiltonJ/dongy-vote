function resizeCanvas() {
  const canvas = document.getElementById("sketchpad");
  const context = canvas.getContext("2d");
  const h = window.innerHeight;
  const w = window.innerWidth;
  const infoHeight = 40;
  if (w <= 900) {
    canvas.width = w;
    canvas.height = h - infoHeight;
  } else {
    canvas.width = 900;
    canvas.height = h - infoHeight;
  }
  const info = document.getElementById("info");
  info.style.height = `${infoHeight}px`;
  info.style.width = `${canvas.width}px`;
}
window.onresize = resizeCanvas;
// get the canvas element and its context
window.addEventListener(
  "load",
  function () {
    const canvas = document.getElementById("sketchpad");
    const context = canvas.getContext("2d");
    resizeCanvas();
    var isIdle = true;
    function drawstart(event) {
      context.beginPath();
      context.moveTo(
        event.pageX - canvas.offsetLeft,
        event.pageY - canvas.offsetTop
      );
      isIdle = false;
    }
    function drawmove(event) {
      if (isIdle) return;
      context.lineTo(
        event.pageX - canvas.offsetLeft,
        event.pageY - canvas.offsetTop
      );
      context.stroke();
    }
    function drawend(event) {
      if (isIdle) return;
      drawmove(event);
      isIdle = true;
    }
    function touchstart(event) {
      drawstart(event.touches[0]);
    }
    function touchmove(event) {
      drawmove(event.touches[0]);
      event.preventDefault();
    }
    function touchend(event) {
      drawend(event.changedTouches[0]);
    }

    canvas.addEventListener("touchstart", touchstart, false);
    canvas.addEventListener("touchmove", touchmove, false);
    canvas.addEventListener("touchend", touchend, false);

    canvas.addEventListener("mousedown", drawstart, false);
    canvas.addEventListener("mousemove", drawmove, false);
    canvas.addEventListener("mouseup", drawend, false);
  },
  false
); // end window.onLoad
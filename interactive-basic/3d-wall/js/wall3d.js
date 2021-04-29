(() => {
  const houseElem = document.querySelector(".house");
  const progressBarElem = document.querySelector(".progress-bar");
  let maxScrollValue;

  function resizeHandler() {
    maxScrollValue = document.body.offsetHeight - window.innerHeight;
  }

  window.addEventListener("scroll", () => {
    const scrollRatio = pageYOffset / maxScrollValue;
    const zMove = scrollRatio * 980 - 490;
    houseElem.style.transform = `translateZ(${zMove}vw)`;

    progressBarElem.style.width = `${scrollRatio * 100}%`;
  });

  window.addEventListener("resize", resizeHandler);
  resizeHandler();
})();

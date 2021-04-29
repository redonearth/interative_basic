(() => {
  const houseElem = document.querySelector(".house");
  let maxScrollValue = document.body.offsetHeight - window.innerHeight;

  window.addEventListener("scroll", () => {
    const zMove = (pageYOffset / maxScrollValue) * 980 - 490;
    houseElem.style.transform = `translateZ(${zMove}vw)`;
  });
})();

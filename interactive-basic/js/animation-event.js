(() => {
  const ballElem = document.querySelector(".ball");

  ballElem.addEventListener("click", (e) => {
    ballElem.style.animation = "ball-ani 1s 3 forwards";
  });

  ballElem.addEventListener("animationend", () => {
    ballElem.classList.add("end");
  });

  ballElem.addEventListener("animationiteration", () => {
    console.log("반복!");
  });
})();

(() => {
  const outputElem = document.querySelector(".output");
  const ilbuniElem = document.querySelector(".ilbuni");

  function showValue() {
    // outputElem.innerHTML = window.pageYOffset;
    // outputElem.innerHTML = ilbuniElem.offsetTop;
    let posY = ilbuniElem.getBoundingClientRect().top;
    outputElem.innerHTML = posY;

    if (posY < window.innerHeight / 5) {
      ilbuniElem.classList.add("zoom");
    } else {
      ilbuniElem.classList.remove("zoom");
    }
  }

  window.addEventListener("scroll", () => {
    showValue();
  });
  showValue();
})();

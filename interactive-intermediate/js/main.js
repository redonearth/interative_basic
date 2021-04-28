(() => {
  const leaflet = document.querySelector(".leaflet");
  const pageElems = document.querySelectorAll(".page");
  let pageCount = 0;

  function getTarget(elem, className) {
    while (!elem.classList.contains(className)) {
      elem = elem.parentNode;

      if (elem.nodeName === "BODY") {
        elem = null;
        return;
      }
    }
    return elem;
  }

  function closeLeaflet() {
    pageCount = 0;
    document.body.classList.remove("leaflet-opened");
    pageElems[2].classList.remove("page-flipped");
    setTimeout(() => {
      pageElems[0].classList.remove("page-flipped");
    }, 500);
  }

  leaflet.addEventListener("click", (e) => {
    let pageElem = getTarget(e.target, "page");
    if (pageElem) {
      pageElem.classList.add("page-flipped");
      pageCount++;

      if (pageCount === 2) {
        document.body.classList.add("leaflet-opened");
      }
    }

    let closeBtnElem = getTarget(e.target, "close-btn");
    if (closeBtnElem) {
      closeLeaflet();
    }
  });
})();

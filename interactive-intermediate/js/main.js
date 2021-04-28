(() => {
  const leaflet = document.querySelector(".leaflet");
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

  leaflet.addEventListener("click", (e) => {
    let pageElem = getTarget(e.target, "page");
    if (pageElem) {
      pageElem.classList.add("page-flipped");
      pageCount++;

      if (pageCount === 2) {
        document.body.classList.add("leaflet-opened");
      }
    }
  });
})();

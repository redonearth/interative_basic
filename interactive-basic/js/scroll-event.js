(() => {
  const outputElem = document.querySelector(".output");
  window.addEventListener("scroll", () => {
    outputElem.innerHTML = window.pageYOffset;
  });
})();

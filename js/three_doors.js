(() => {
  const stageElem = document.querySelector(".stage");
  // 현재 활성화된 아이템을 저장
  let currentItem;

  function doorHandler(e) {
    const targetElem = e.target;

    if (currentItem) {
      currentItem.classList.remove("door-opened");
    }

    if (targetElem.classList.contains("door-body")) {
      targetElem.parentNode.classList.add("door-opened");
      currentItem = targetElem.parentNode;
    }
  }

  stageElem.addEventListener("click", doorHandler);
})();

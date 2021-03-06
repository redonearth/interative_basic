(() => {
  const stageElem = document.querySelector('.stage');
  const houseElem = document.querySelector('.house');
  const progressBarElem = document.querySelector('.progress-bar');
  const selectCharacterElem = document.querySelector('.select-character');
  const mousePos = { x: 0, y: 0 };
  let maxScrollValue;

  function resizeHandler() {
    maxScrollValue = document.body.offsetHeight - window.innerHeight;
  }

  window.addEventListener('scroll', () => {
    const scrollRatio = pageYOffset / maxScrollValue;
    const zMove = scrollRatio * 980 - 490;
    houseElem.style.transform = `translateZ(${zMove}vw)`;

    progressBarElem.style.width = `${scrollRatio * 100}%`;
  });

  window.addEventListener('mousemove', (e) => {
    mousePos.x = -1 + (e.clientX / window.innerWidth) * 2;
    mousePos.y = 1 - (e.clientY / window.innerHeight) * 2;
    stageElem.style.transform = `
      rotateX(${mousePos.y * 5}deg) rotateY(${mousePos.x * 5}deg)
    `;
  });

  window.addEventListener('resize', resizeHandler);

  window.addEventListener('load', () => {
    setTimeout(() => scrollTo(0, 0), 100);
  });

  stageElem.addEventListener('click', (e) => {
    new Character({
      xPos: (e.clientX / window.innerWidth) * 100,
      speed: Math.random() * 0.5 + 0.2,
    });
  });

  selectCharacterElem.addEventListener('click', (e) => {
    const selectedValue = e.target.getAttribute('data-char');
    document.body.setAttribute('data-char', selectedValue);
  });

  resizeHandler();
})();

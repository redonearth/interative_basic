function Character(info) {
  this.mainElem = document.createElement('div');
  this.mainElem.classList.add('character');
  this.mainElem.innerHTML = `
    <div class="character">
      <div class="character-face-container character-head">
        <div class="character-face character-head-face face-front"></div>
        <div class="character-face character-head-face face-back"></div>
      </div>
      <div class="character-face-container character-torso">
        <div class="character-face character-torso-face face-front"></div>
        <div class="character-face character-torso-face face-back"></div>
      </div>
      <div class="character-face-container character-arm character-arm-left">
        <div class="character-face character-arm-face face-front"></div>
        <div class="character-face character-arm-face face-back"></div>
      </div>
      <div class="character-face-container character-arm character-arm-right">
        <div class="character-face character-arm-face face-front"></div>
        <div class="character-face character-arm-face face-back"></div>
      </div>
      <div class="character-face-container character-leg character-leg-left">
        <div class="character-face character-leg-face face-front"></div>
        <div class="character-face character-leg-face face-back"></div>
      </div>
      <div class="character-face-container character-leg character-leg-right">
        <div class="character-face character-leg-face face-front"></div>
        <div class="character-face character-leg-face face-back"></div>
      </div>
    </div>
  `;

  document.querySelector('.stage').appendChild(this.mainElem);

  this.mainElem.style.left = `${info.xPos}%`;
  this.scrollState = false;
  this.lastScrollTop = 0;
  this.init();
}

Character.prototype = {
  constructor: Character,
  init() {
    window.addEventListener('scroll', () => {
      clearTimeout(this.scrollState);

      if (!this.scrollState) {
        this.mainElem.classList.add('walking');
      }

      this.scrollState = setTimeout(() => {
        this.scrollState = false;
        this.mainElem.classList.remove('walking');
      }, 200);

      if (this.lastScrollTop < pageYOffset) {
        // 이전 스크롤 위치가 작다면: 스크롤 내림
        this.mainElem.setAttribute('data-direction', 'forward');
      } else {
        // 이전 스크롤 위치가 크다면: 스크롤 올림
        this.mainElem.setAttribute('data-direction', 'backward');
      }
      this.lastScrollTop = pageYOffset;
    });
  },
};

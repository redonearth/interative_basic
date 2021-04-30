function Character() {
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
}

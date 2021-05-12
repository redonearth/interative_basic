(() => {
  let yOffset = 0; // window.pageYOffset 대신 사용할 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; // 현재 활성화된(눈 앞에 보고 있는) Scene(scroll-section)
  let enterNewScene = false; // 새로운 scene이 시작된 순간 true

  const sceneInfo = [
    {
      // 0
      type: 'sticky',
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-0'),
        messageA: document.querySelector('#scroll-section-0 .main-message-a'),
        messageB: document.querySelector('#scroll-section-0 .main-message-b'),
        messageC: document.querySelector('#scroll-section-0 .main-message-c'),
        messageD: document.querySelector('#scroll-section-0 .main-message-d'),
      },
      values: {
        messageAOpacityIn: [0, 1, { start: 0.1, end: 0.2 }],
        messageBOpacityIn: [0, 1, { start: 0.3, end: 0.4 }],
        messageCOpacityIn: [0, 1, { start: 0.5, end: 0.6 }],
        messageDOpacityIn: [0, 1, { start: 0.7, end: 0.8 }],
        messageATranslateYIn: [20, 0, { start: 0.1, end: 0.2 }],
        messageBTranslateYIn: [20, 0, { start: 0.3, end: 0.4 }],
        messageCTranslateYIn: [20, 0, { start: 0.5, end: 0.6 }],
        messageDTranslateYIn: [20, 0, { start: 0.7, end: 0.8 }],
        messageAOpacityOut: [1, 0, { start: 0.25, end: 0.3 }],
        messageBOpacityOut: [1, 0, { start: 0.45, end: 0.5 }],
        messageCOpacityOut: [1, 0, { start: 0.65, end: 0.7 }],
        messageDOpacityOut: [1, 0, { start: 0.85, end: 0.9 }],
        messageATranslateYOut: [0, -20, { start: 0.25, end: 0.3 }],
        messageBTranslateYOut: [0, -20, { start: 0.45, end: 0.5 }],
        messageCTranslateYOut: [0, -20, { start: 0.65, end: 0.7 }],
        messageDTranslateYOut: [0, -20, { start: 0.85, end: 0.9 }],
      },
    },
    {
      // 1
      type: 'normal',
      // heightNum: 5, // type normal에서는 필요 없음
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-1'),
      },
    },
    {
      // 2
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-2'),
        mainMessage: document.querySelector('#scroll-section-2 .main-message'),
        descMessageA: document.querySelector(
          '#scroll-section-2 .desc-message-a'
        ),
        descMessageB: document.querySelector(
          '#scroll-section-2 .desc-message-b'
        ),
        pinA: document.querySelector('#scroll-section-2 .desc-message-a .pin'),
        pinB: document.querySelector('#scroll-section-2 .desc-message-b .pin'),
      },
      values: {
        mainMessageOpacityIn: [0, 1, { start: 0.15, end: 0.2 }],
        descMessageAOpacityIn: [0, 1, { start: 0.5, end: 0.55 }],
        descMessageBOpacityIn: [0, 1, { start: 0.72, end: 0.77 }],
        mainMessageTranslateYIn: [20, 0, { start: 0.15, end: 0.2 }],
        descMessageATranslateYIn: [30, 0, { start: 0.5, end: 0.55 }],
        descMessageBTranslateYIn: [30, 0, { start: 0.72, end: 0.77 }],
        mainMessageOpacityOut: [1, 0, { start: 0.3, end: 0.35 }],
        descMessageAOpacityOut: [1, 0, { start: 0.58, end: 0.63 }],
        descMessageBOpacityOut: [1, 0, { start: 0.85, end: 0.9 }],
        mainMessageTranslateYOut: [0, -20, { start: 0.3, end: 0.35 }],
        descMessageATranslateYOut: [0, -20, { start: 0.58, end: 0.63 }],
        descMessageBTranslateYOut: [0, -20, { start: 0.85, end: 0.9 }],
        pinAScaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
        pinBScaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
      },
    },
    {
      // 3
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-3'),
        canvasCaption: document.querySelector('.canvas-caption'),
      },
    },
  ];

  const setLayout = () => {
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === 'sticky') {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === 'normal') {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
      }
      sceneInfo[i].objs.container.style.height = `
        ${sceneInfo[i].scrollHeight}px
      `;
    }

    yOffset = window.pageYOffset;
    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute('id', `show-scene-${currentScene}`);
  };

  const calcValues = (values, currentYOffset) => {
    let rv;
    // 현재 Scene(scroll-section)에서 스크롤된 범위를 비율로 구하기
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
      // start ~ end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (
        currentYOffset >= partScrollStart &&
        currentYOffset <= partScrollEnd
      ) {
        rv =
          ((currentYOffset - partScrollStart) / partScrollHeight) *
            (values[1] - values[0]) +
          values[0];
      } else if (currentYOffset < partScrollStart) {
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
  };

  const playAnimation = () => {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    switch (currentScene) {
      case 0:
        // console.log('0 play');
        if (scrollRatio <= 0.22) {
          // in
          objs.messageA.style.opacity = calcValues(
            values.messageAOpacityIn,
            currentYOffset
          );
          objs.messageA.style.transform = `
            translate3d(0, ${calcValues(
              values.messageATranslateYIn,
              currentYOffset
            )}%, 0)
          `;
        } else {
          // out
          objs.messageA.style.opacity = calcValues(
            values.messageAOpacityOut,
            currentYOffset
          );
          objs.messageA.style.transform = `
            translate3d(0, ${calcValues(
              values.messageATranslateYOut,
              currentYOffset
            )}%, 0)
          `;
        }

        if (scrollRatio <= 0.42) {
          // in
          objs.messageB.style.opacity = calcValues(
            values.messageBOpacityIn,
            currentYOffset
          );
          objs.messageB.style.transform = `
            translate3d(0, ${calcValues(
              values.messageBTranslateYIn,
              currentYOffset
            )}%, 0)
          `;
        } else {
          // out
          objs.messageB.style.opacity = calcValues(
            values.messageBOpacityOut,
            currentYOffset
          );
          objs.messageB.style.transform = `
            translate3d(0, ${calcValues(
              values.messageBTranslateYOut,
              currentYOffset
            )}%, 0)
          `;
        }

        if (scrollRatio <= 0.62) {
          // in
          objs.messageC.style.opacity = calcValues(
            values.messageCOpacityIn,
            currentYOffset
          );
          objs.messageC.style.transform = `
            translate3d(0, ${calcValues(
              values.messageCTranslateYIn,
              currentYOffset
            )}%, 0)
          `;
        } else {
          // out
          objs.messageC.style.opacity = calcValues(
            values.messageCOpacityOut,
            currentYOffset
          );
          objs.messageC.style.transform = `
            translate3d(0, ${calcValues(
              values.messageCTranslateYOut,
              currentYOffset
            )}%, 0)
          `;
        }

        if (scrollRatio <= 0.82) {
          // in
          objs.messageD.style.opacity = calcValues(
            values.messageDOpacityIn,
            currentYOffset
          );
          objs.messageD.style.transform = `
            translate3d(0, ${calcValues(
              values.messageDTranslateYIn,
              currentYOffset
            )}%, 0)
          `;
        } else {
          // out
          objs.messageD.style.opacity = calcValues(
            values.messageDOpacityOut,
            currentYOffset
          );
          objs.messageD.style.transform = `
            translate3d(0, ${calcValues(
              values.messageDTranslateYOut,
              currentYOffset
            )}%, 0)
          `;
        }

        break;

      case 2:
        // console.log('2 play');
        if (scrollRatio <= 0.32) {
          // in
          objs.mainMessage.style.opacity = calcValues(
            values.mainMessageOpacityIn,
            currentYOffset
          );
          objs.mainMessage.style.transform = `
            translate3d(0, ${calcValues(
              values.mainMessageTranslateYIn,
              currentYOffset
            )}%, 0)
          `;
        } else {
          // out
          objs.mainMessage.style.opacity = calcValues(
            values.mainMessageOpacityOut,
            currentYOffset
          );
          objs.mainMessage.style.transform = `
            translate3d(0, ${calcValues(
              values.mainMessageTranslateYOut,
              currentYOffset
            )}%, 0)
          `;
        }

        if (scrollRatio <= 0.67) {
          // in
          objs.descMessageA.style.opacity = calcValues(
            values.descMessageAOpacityIn,
            currentYOffset
          );
          objs.descMessageA.style.transform = `
            translate3d(0, ${calcValues(
              values.descMessageATranslateYIn,
              currentYOffset
            )}%, 0)
          `;
          objs.pinA.style.transform = `
            scaleY(${calcValues(values.pinAScaleY, currentYOffset)})
          `;
        } else {
          // out
          objs.descMessageA.style.opacity = calcValues(
            values.descMessageAOpacityOut,
            currentYOffset
          );
          objs.descMessageA.style.transform = `
            translate3d(0, ${calcValues(
              values.descMessageATranslateYOut,
              currentYOffset
            )}%, 0)
          `;
          objs.pinA.style.transform = `
            scaleY(${calcValues(values.pinAScaleY, currentYOffset)})
          `;
        }

        if (scrollRatio <= 0.93) {
          // in
          objs.descMessageB.style.opacity = calcValues(
            values.descMessageBOpacityIn,
            currentYOffset
          );
          objs.descMessageB.style.transform = `
            translate3d(0, ${calcValues(
              values.descMessageBTranslateYIn,
              currentYOffset
            )}%, 0)
          `;
          objs.pinB.style.transform = `
            scaleY(${calcValues(values.pinBScaleY, currentYOffset)})
          `;
        } else {
          // out
          objs.descMessageB.style.opacity = calcValues(
            values.descMessageBOpacityOut,
            currentYOffset
          );
          objs.descMessageB.style.transform = `
            translate3d(0, ${calcValues(
              values.descMessageBTranslateYOut,
              currentYOffset
            )}%, 0)
          `;
          objs.pinB.style.transform = `
            scaleY(${calcValues(values.pinBScaleY, currentYOffset)})
          `;
        }

        break;

      case 3:
        // console.log('3 play');
        break;
    }
  };

  const scrollLoop = () => {
    enterNewScene = false;
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }
    if (yOffset < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return;
      currentScene--;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }
    if (enterNewScene) return;
    playAnimation();
  };

  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  });
  window.addEventListener('load', setLayout);
  window.addEventListener('resize', setLayout);
})();

(() => {
  let yOffset = 0; // window.pageYOffset 대신 사용할 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; // 현재 활성화된(눈 앞에 보고 있는) Scene(scroll-section)
  let enterNewScene = false; // 새로운 scene이 시작된 순간 true
  let acc = 0.1;
  let delayedYOffset = 0;
  let rafId;
  let rafState;

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
        canvas: document.querySelector('#video-canvas-0'),
        context: document.querySelector('#video-canvas-0').getContext('2d'),
        videoImages: [],
      },
      values: {
        videoImageCount: 300,
        imageSequence: [0, 299],
        canvasOpacity: [1, 0, { start: 0.9, end: 1 }],
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
        canvas: document.querySelector('#video-canvas-1'),
        context: document.querySelector('#video-canvas-1').getContext('2d'),
        videoImages: [],
      },
      values: {
        videoImageCount: 960,
        imageSequence: [0, 959],
        canvasOpacityIn: [0, 1, { start: 0, end: 0.05 }],
        canvasOpacityOut: [1, 0, { start: 0.95, end: 1 }],
        mainMessageOpacityIn: [0, 1, { start: 0.15, end: 0.2 }],
        descMessageAOpacityIn: [0, 1, { start: 0.5, end: 0.55 }],
        descMessageBOpacityIn: [0, 1, { start: 0.72, end: 0.77 }],
        mainMessageTranslateYIn: [20, 0, { start: 0.15, end: 0.2 }],
        descMessageATranslateYIn: [30, 0, { start: 0.5, end: 0.55 }],
        descMessageBTranslateYIn: [30, 0, { start: 0.72, end: 0.77 }],
        mainMessageOpacityOut: [1, 0, { start: 0.3, end: 0.35 }],
        descMessageAOpacityOut: [1, 0, { start: 0.68, end: 0.73 }],
        descMessageBOpacityOut: [1, 0, { start: 0.95, end: 1 }],
        mainMessageTranslateYOut: [0, -20, { start: 0.3, end: 0.35 }],
        descMessageATranslateYOut: [0, -20, { start: 0.68, end: 0.73 }],
        descMessageBTranslateYOut: [0, -20, { start: 0.95, end: 1 }],
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
        canvas: document.querySelector('.image-blend-canvas'),
        context: document.querySelector('.image-blend-canvas').getContext('2d'),
        imagesPath: [
          './images/blend-image-1.jpg',
          './images/blend-image-2.jpg',
        ],
        images: [],
      },
      values: {
        rectLeftX: [0, 0, { start: 0, end: 0 }],
        rectRightX: [0, 0, { start: 0, end: 0 }],
        rectStartY: 0,
        blendHeight: [0, 0, { start: 0, end: 0 }],
        canvasScale: [0, 0, { start: 0, end: 0 }],
        canvasCaptionOpacity: [0, 1, { start: 0, end: 0 }],
        canvasCaptionTranslateY: [20, 0, { start: 0, end: 0 }],
      },
    },
  ];

  const setCanvasImages = () => {
    let imgElem;
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      imgElem = document.createElement('img');
      imgElem.src = `./images/001/IMG_${6726 + i}.JPG`;
      sceneInfo[0].objs.videoImages.push(imgElem);
    }

    let imgElem2;
    for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
      imgElem2 = document.createElement('img');
      imgElem2.src = `./images/002/IMG_${7027 + i}.JPG`;
      sceneInfo[2].objs.videoImages.push(imgElem2);
    }

    let imgElem3;
    for (let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++) {
      imgElem3 = document.createElement('img');
      imgElem3.src = sceneInfo[3].objs.imagesPath[i];
      sceneInfo[3].objs.images.push(imgElem3);
    }
  };

  const checkMenu = () => {
    if (yOffset > 44) {
      document.body.classList.add('local-nav-sticky');
    } else {
      document.body.classList.remove('local-nav-sticky');
    }
  };

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

    const heightRatio = window.innerHeight / 1080;
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
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
        // let sequence = Math.round(
        //   calcValues(values.imageSequence, currentYOffset)
        // );
        // objs.context.drawImage(objs.videoImages[sequence], 0, 0);
        objs.canvas.style.opacity = calcValues(
          values.canvasOpacity,
          currentYOffset
        );

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
        // let sequence2 = Math.round(
        //   calcValues(values.imageSequence, currentYOffset)
        // );
        // objs.context.drawImage(objs.videoImages[sequence2], 0, 0);

        if (scrollRatio <= 0.5) {
          objs.canvas.style.opacity = calcValues(
            values.canvasOpacityIn,
            currentYOffset
          );
        } else {
          objs.canvas.style.opacity = calcValues(
            values.canvasOpacityOut,
            currentYOffset
          );
        }

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

        // currentScene 3에서 쓰는 캔버스를 미리 그려주기 시작
        if (scrollRatio > 0.9) {
          const objs = sceneInfo[3].objs;
          const values = sceneInfo[3].values;
          const widthRatio = window.innerWidth / objs.canvas.width;
          const heightRatio = window.innerHeight / objs.canvas.height;
          let canvasScaleRatio;

          if (widthRatio <= heightRatio) {
            // 캔버스보다 브라우저 창이 홀쭉한 경우
            canvasScaleRatio = heightRatio;
          } else {
            // 캔버스보다 브라우저 창이 납작한 경우
            canvasScaleRatio = widthRatio;
          }
          objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
          objs.context.fillStyle = 'white';
          objs.context.drawImage(objs.images[0], 0, 0);

          // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
          const recalculatedInnerWidth =
            document.body.offsetWidth / canvasScaleRatio;

          const whiteRectWidth = recalculatedInnerWidth * 0.15;
          values.rectLeftX[0] =
            (objs.canvas.width - recalculatedInnerWidth) / 2;
          values.rectLeftX[1] = values.rectLeftX[0] - whiteRectWidth;
          values.rectRightX[0] =
            values.rectLeftX[0] + recalculatedInnerWidth - whiteRectWidth;
          values.rectRightX[1] = values.rectRightX[0] + whiteRectWidth;

          // 좌우 흰색 박스 그리기
          objs.context.fillRect(
            parseInt(values.rectLeftX[0]),
            0,
            parseInt(whiteRectWidth),
            objs.canvas.height
          );
          objs.context.fillRect(
            parseInt(values.rectRightX[0]),
            0,
            parseInt(whiteRectWidth),
            objs.canvas.height
          );
        }

        break;

      case 3:
        // console.log('3 play');
        let step = 0;

        // 가로/세로 모두 꽉 차게 하기 위해 여기서 설정(계산 필요)
        const widthRatio = window.innerWidth / objs.canvas.width;
        const heightRatio = window.innerHeight / objs.canvas.height;
        let canvasScaleRatio;

        if (widthRatio <= heightRatio) {
          // 캔버스보다 브라우저 창이 홀쭉한 경우
          canvasScaleRatio = heightRatio;
        } else {
          canvasScaleRatio = widthRatio;
          // 캔버스보다 브라우저 창이 납작한 경우
          console.log('widthRatio로 결정');
        }
        objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
        objs.context.fillStyle = 'white';
        objs.context.drawImage(objs.images[0], 0, 0);

        // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
        const recalculatedInnerWidth =
          document.body.offsetWidth / canvasScaleRatio;

        if (!values.rectStartY) {
          values.rectStartY =
            objs.canvas.offsetTop +
            (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;
          values.rectLeftX[2].start = window.innerHeight / 2 / scrollHeight;
          values.rectRightX[2].start = window.innerHeight / 2 / scrollHeight;
          values.rectLeftX[2].end = values.rectStartY / scrollHeight;
          values.rectRightX[2].end = values.rectStartY / scrollHeight;
        }

        const whiteRectWidth = recalculatedInnerWidth * 0.15;
        values.rectLeftX[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
        values.rectLeftX[1] = values.rectLeftX[0] - whiteRectWidth;
        values.rectRightX[0] =
          values.rectLeftX[0] + recalculatedInnerWidth - whiteRectWidth;
        values.rectRightX[1] = values.rectRightX[0] + whiteRectWidth;

        // 좌우 흰색 박스 그리기
        objs.context.fillRect(
          parseInt(calcValues(values.rectLeftX, currentYOffset)),
          0,
          parseInt(whiteRectWidth),
          objs.canvas.height
        );
        objs.context.fillRect(
          parseInt(calcValues(values.rectRightX, currentYOffset)),
          0,
          parseInt(whiteRectWidth),
          objs.canvas.height
        );

        if (scrollRatio < values.rectLeftX[2].end) {
          // 캔버스가 브라우저 상단에 닿지 않았다면
          step = 1;
          objs.canvas.classList.remove('sticky-img');
        } else {
          step = 2;

          // 이미지 블렌드
          values.blendHeight[0] = 0;
          values.blendHeight[1] = objs.canvas.height;
          values.blendHeight[2].start = values.rectLeftX[2].end;
          values.blendHeight[2].end = values.blendHeight[2].start + 0.2;
          const blendHeight = calcValues(values.blendHeight, currentYOffset);

          objs.context.drawImage(
            objs.images[1],
            0,
            objs.canvas.height - blendHeight,
            objs.canvas.width,
            blendHeight,
            0,
            objs.canvas.height - blendHeight,
            objs.canvas.width,
            blendHeight
          );

          objs.canvas.classList.add('sticky-img');
          objs.canvas.style.top = `
            ${
              -(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2
            }px
          `;

          if (scrollRatio > values.blendHeight[2].end) {
            values.canvasScale[0] = canvasScaleRatio;
            values.canvasScale[1] =
              document.body.offsetWidth / (objs.canvas.width * 1.5);
            values.canvasScale[2].start = values.blendHeight[2].end;
            values.canvasScale[2].end = values.canvasScale[2].start + 0.2;

            objs.canvas.style.transform = `
              scale(${calcValues(values.canvasScale, currentYOffset)})
            `;
            objs.canvas.style.marginTop = 0;

            if (scrollRatio > values.canvasScale[2].end) {
              objs.canvas.classList.remove('sticky-img');
              objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`;

              values.canvasCaptionOpacity[2].start = values.canvasScale[2].end;
              values.canvasCaptionOpacity[2].end =
                values.canvasScale[2].start + 0.1;
              values.canvasCaptionTranslateY[2].start =
                values.canvasCaptionOpacity[2].start;
              values.canvasCaptionTranslateY[2].end =
                values.canvasCaptionOpacity[2].end;
              objs.canvasCaption.style.opacity = calcValues(
                values.canvasCaptionOpacity,
                currentYOffset
              );
              objs.canvasCaption.style.transform = `
                translate3d(0, ${calcValues(
                  values.canvasCaptionTranslateY,
                  currentYOffset
                )}%, 0)
              `;
            } else {
              objs.canvasCaption.style.opacity = values.canvasCaptionOpacity[0];
            }
          }
        }

        break;
    }
  };

  const scrollLoop = () => {
    enterNewScene = false;
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }
    if (
      delayedYOffset >
      prevScrollHeight + sceneInfo[currentScene].scrollHeight
    ) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }
    if (delayedYOffset < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return;
      currentScene--;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }
    if (enterNewScene) return;
    playAnimation();
  };

  const loop = () => {
    delayedYOffset += (yOffset - delayedYOffset) * acc;

    if (!enterNewScene) {
      if (currentScene === 0 || currentScene === 2) {
        const currentYOffset = delayedYOffset - prevScrollHeight;
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        let sequence = Math.round(
          calcValues(values.imageSequence, currentYOffset)
        );
        if (objs.videoImages[sequence]) {
          objs.context.drawImage(objs.videoImages[sequence], 0, 0);
        }
      }
    }

    rafId = requestAnimationFrame(loop);

    if (Math.abs(yOffset - delayedYOffset) < 1) {
      cancelAnimationFrame(rafId);
      rafState = false;
    }
  };

  window.addEventListener('load', () => {
    document.body.classList.remove('before-load');
    setLayout();
    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);

    window.addEventListener('scroll', () => {
      yOffset = window.pageYOffset;
      scrollLoop();
      checkMenu();

      if (!rafState) {
        rafId = requestAnimationFrame(loop);
        rafState = true;
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        setLayout();
        sceneInfo[3].values.rectStartY = 0;
      }
    });
    window.addEventListener('orientationchange', () => {
      setTimeout(setLayout, 200);
    });

    document
      .querySelector('.loading')
      .addEventListener('transitionend', (e) => {
        document.body.removeChild(e.currentTarget);
      });
  });

  setCanvasImages();
})();

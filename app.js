import { FanState } from './state.js';

document.addEventListener('DOMContentLoaded', () => {
  const blades = document.getElementById('fan-blades');
  const fanHead = document.querySelector('.fan-head');
  const powerBtn = document.getElementById('fan-power-btn');
  const led = document.getElementById('fan-led');
  const oscBtn = document.getElementById('fan-osc-btn');
  const oscLed = document.getElementById('osc-led');
  const fanWrapper = document.querySelector('.fan-wrapper');

  if (!blades || !fanHead || !powerBtn || !led || !oscBtn || !oscLed || !fanWrapper) {
    console.error('找不到關鍵的 DOM 元素，請檢查 HTML 結構。');
    return;
  }

  const state = new FanState();

  function updateUI() {
    // 電源指示燈與風流效果
    if (state.isOn) {
      powerBtn.classList.add('is-active');
      fanWrapper.classList.add('is-on');
    } else {
      powerBtn.classList.remove('is-active');
      fanWrapper.classList.remove('is-on');
    }

    // 擺頭指示燈 (只有在電源開啟且啟用擺頭時亮起)
    if (state.isOn && state.oscActive) {
      oscBtn.classList.add('is-active');
    } else {
      oscBtn.classList.remove('is-active');
    }
  }

  // 點擊電源開關
  powerBtn.addEventListener('click', () => {
    state.toggle();
    updateUI();
  });

  // 點擊擺頭開關
  oscBtn.addEventListener('click', () => {
    state.toggleOsc();
    updateUI();
  });

  // 物理動畫迴圈，計算真實 deltaTime
  let lastTime = performance.now();

  function render(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // 防止背景分頁切換帶來的超長 frame 造成畫面飛越
    const clampedDelta = Math.min(deltaTime, 100);

    state.update(clampedDelta);
    
    // 更新葉片旋轉 (2D rotate)
    blades.style.transform = `rotate(${state.angle}deg)`;
    
    // 更新擺頭旋轉 (3D rotateY)
    fanHead.style.transform = `rotateY(${state.oscAngle}deg)`;
    
    requestAnimationFrame(render);
  }

  // 啟動動畫迴圈
  requestAnimationFrame((timestamp) => {
    lastTime = timestamp;
    render(timestamp);
  });
});

import { FanState } from './state.js';

document.addEventListener('DOMContentLoaded', () => {
  const blades = document.getElementById('fan-blades');
  const powerBtn = document.getElementById('fan-power-btn');
  const led = document.getElementById('fan-led');
  const fanWrapper = document.querySelector('.fan-wrapper');

  if (!blades || !powerBtn || !led || !fanWrapper) {
    console.error('找不到關鍵的 DOM 元素，請檢查 HTML 結構。');
    return;
  }

  const state = new FanState();

  // 點擊開關處理器
  powerBtn.addEventListener('click', () => {
    state.toggle();
    
    // 更新按鈕樣式 (LED) 與風流效果 (is-on)
    if (state.isOn) {
      powerBtn.classList.add('is-active');
      fanWrapper.classList.add('is-on');
    } else {
      powerBtn.classList.remove('is-active');
      fanWrapper.classList.remove('is-on');
    }
  });

  // 物理動畫迴圈
  function render() {
    state.update();
    
    // 僅在有速度或角度改變時更新 DOM 以減少重繪
    if (state.speed > 0 || state.angle !== 0) {
      blades.style.transform = `rotate(${state.angle}deg)`;
    }
    
    requestAnimationFrame(render);
  }

  // 啟動動畫迴圈
  render();
});

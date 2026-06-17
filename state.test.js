import assert from 'node:assert';
import test from 'node:test';
import { FanState } from './state.js';

test('FanState 初始化狀態', () => {
  const state = new FanState();
  assert.strictEqual(state.isOn, false);
  assert.strictEqual(state.speed, 0);
  assert.strictEqual(state.angle, 0);
});

test('FanState 切換開關', () => {
  const state = new FanState();
  state.toggle();
  assert.strictEqual(state.isOn, true);
  state.toggle();
  assert.strictEqual(state.isOn, false);
});

test('FanState 更新角速度與角度', () => {
  const state = new FanState();
  state.isOn = true;
  state.update();
  assert.ok(state.speed > 0, '開啟時速度應增加');
  assert.ok(state.angle > 0, '開啟時角度應增加');

  // 模擬達到最大速度
  for (let i = 0; i < 200; i++) {
    state.update();
  }
  assert.strictEqual(state.speed, state.maxSpeed, '速度不應超過最大值');

  // 關閉風扇
  state.isOn = false;
  const speedBefore = state.speed;
  state.update();
  assert.ok(state.speed < speedBefore, '關閉時速度應減少');
});

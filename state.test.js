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

test('FanState 擺頭初始化狀態與開關切換', () => {
  const state = new FanState();
  assert.strictEqual(state.oscActive, false, '預設應不啟用擺頭');
  assert.strictEqual(state.oscVelocity, 0, '預設擺頭角速度應為 0');
  assert.strictEqual(state.oscPhase, 0, '預設擺頭相位應為 0');
  assert.strictEqual(state.oscAngle, 0, '預設擺頭角度應為 0');

  state.toggleOsc();
  assert.strictEqual(state.oscActive, true, '切換後應啟用擺頭');
});

test('FanState 擺頭物理模擬', () => {
  const state = new FanState();
  state.isOn = true;
  state.oscActive = true;
  
  // 更新 10 毫秒
  state.update(10.0);
  assert.ok(state.oscVelocity > 0, '擺頭與風扇皆開啟時，速度應增加');
  assert.ok(state.oscPhase > 0, '相位應增加');
  
  // 模擬達到最大目標擺頭角速度
  for (let i = 0; i < 500; i++) {
    state.update(10.0);
  }
  assert.strictEqual(state.oscVelocity, state.targetOscVelocity, '速度不應超過目標最大速度');

  // 關閉擺頭，速度應開始衰減
  state.oscActive = false;
  const velBefore = state.oscVelocity;
  state.update(10.0);
  assert.ok(state.oscVelocity < velBefore, '擺頭停用時角速度應衰減');

  // 測試關閉電源時，擺頭速度也應衰減
  state.oscActive = true;
  state.oscVelocity = state.targetOscVelocity;
  state.isOn = false;
  state.update(10.0);
  assert.ok(state.oscVelocity < state.targetOscVelocity, '風扇關閉時擺頭角速度應衰減');
});

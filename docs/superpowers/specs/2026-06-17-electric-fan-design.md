# 現代極簡風電風扇網頁設計規格書

本專案旨在開發一個部署於 GitHub Pages 的純前端電風扇互動網頁。使用者可以點擊實體開關按鈕來開啟或關閉風扇，扇葉會模擬真實物理世界的慣性進行加速與減速。

---

## 1. 視覺設計與美學 (CSS & HTML)

### 1.1 配色方案 (Color Palette)
為營造現代簡約、高質感的日系家電（如 MUJI 或 ⁠正負零 ±0）氛圍，採用以下 HSL 調和色彩系統：
- **主體白**：`hsl(0, 0%, 97%)`（啞光白，避免使用死白 `#fff`，提升質感）
- **網罩與細部陰影**：`hsl(0, 0%, 90%)` 與 `hsl(0, 0%, 80%)`
- **支撐金屬桿**：`hsl(210, 10%, 85%)`（帶有極微藍色調的冷灰色）
- **半透明扇葉**：`hsla(0, 0%, 97%, 0.4)`（半透明磨砂質感，旋轉時可透出後方網罩，更具真實感）
- **背景色**：`linear-gradient(135deg, hsl(210, 20%, 98%), hsl(210, 15%, 90%))`
- **LED 指示燈**：
  - 關閉：`hsl(0, 0%, 80%)`
  - 開啟：`hsl(145, 80%, 50%)`（翠綠色，帶有 `box-shadow` 發光效果）

### 1.2 網頁元素結構 (DOM Structure)
風扇組件將完全使用 HTML5 語意化標籤配合 CSS 繪製：
- `.fan-container`：外層包裝器，負責縮放與響應式排版。
  - `.fan-head`：風扇頭部，包含前後網罩與扇葉。
    - `.grill-back`：後網罩（包含輻射條紋與邊框）。
    - `.fan-blades`：旋轉的扇葉組件（軸心與 4 片扇葉）。
    - `.grill-front`：前網罩（覆蓋在扇葉上方，帶有品牌標誌圓心）。
  - `.fan-neck`：連接頭部與底座的支撐軸，具備金屬光澤漸變。
  - `.fan-base`：扁平圓盤底座，有微妙的 3D 投影。
    - `.power-switch`：實體按鈕，包含按鈕本體與 `.led-indicator`。

---

## 2. 狀態管理與動畫邏輯 (JavaScript)

為確保網頁在 GitHub Pages 上運作流暢，我們堅持零依賴（Vanilla JS），並將狀態與渲染分離。

### 2.1 狀態定義 (State Model)
```javascript
const state = {
  isOn: false,        // 開關狀態
  speed: 0,           // 當前角速度（度/幀）
  angle: 0,           // 當前旋轉角度（度）
};
```

### 2.2 物理模擬參數
- **最大角速度 (`MAX_SPEED`)**：`18` 度/幀（全速旋轉時）。
- **起步加速度 (`ACCELERATION`)**：`0.15` 度/幀²（模擬馬達扭力起步）。
- **停轉摩擦力 (`FRICTION`)**：`0.08` 度/幀²（模擬空氣阻力與軸承摩擦力）。

### 2.3 動畫迴圈 (Render Loop)
使用 `requestAnimationFrame` 進行高效渲染，公式如下：
1. **若風扇開啟 (`state.isOn === true`)**：
   $$speed = \min(MAX\_SPEED, speed + ACCELERATION)$$
2. **若風扇關閉 (`state.isOn === false`)**：
   $$speed = \max(0, speed - FRICTION)$$
3. **更新累積角度**：
   $$angle = (angle + speed) \pmod{360}$$
4. **更新 DOM**：
   `bladesElement.style.transform = 'rotate(' + state.angle + 'deg)'`

---

## 3. SEO 與網頁優化

- **Title**：`極簡風電風扇 - 現代白色美學互動網頁`
- **Meta Description**：`一個基於 HTML5/CSS3/Vanilla JS 實作的純前端極簡風電風扇，具備逼真起步與停轉慣性物理模擬，適合放置於 GitHub Pages。`
- **語意 HTML**：使用 `<header>`, `<main>`, `<button>` 等標籤，並為按鈕與開關提供獨一無二的 `id`（例如 `id="fan-power-btn"`）以利測試與無障礙讀取。
- **效能**：所有動畫完全使用 `transform: rotate`，不觸發瀏覽器的 Layout 與 Paint，保證 60+ FPS 流暢運行。

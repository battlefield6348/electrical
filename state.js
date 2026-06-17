export class FanState {
  constructor() {
    this.isOn = false;
    this.speed = 0;
    this.angle = 0;
    this.maxSpeed = 18;
    this.acceleration = 0.15;
    this.friction = 0.08;

    // 擺頭物理狀態
    this.oscActive = false;
    this.oscVelocity = 0;
    this.oscPhase = 0;
    this.maxOscAngle = 45; // 左右擺動最大各 45 度
    this.targetOscVelocity = 0.0006; // 目標相位角速度 (每毫秒)，約 10.5 秒一週期
    this.oscAcceleration = 0.0000008; // 擺頭加速度 (每毫秒)
    this.oscFriction = 0.998; // 擺頭摩擦力 (每毫秒衰減率)，使其優雅且緩慢地停下
  }

  get oscAngle() {
    return Math.sin(this.oscPhase) * this.maxOscAngle;
  }

  toggle() {
    this.isOn = !this.isOn;
  }

  toggleOsc() {
    this.oscActive = !this.oscActive;
  }

  update(deltaTime = 16.6) {
    // 風扇扇葉轉速更新
    if (this.isOn) {
      this.speed = Math.min(this.maxSpeed, this.speed + this.acceleration);
    } else {
      this.speed = Math.max(0, this.speed - this.friction);
    }
    this.angle = (this.angle + this.speed) % 360;

    // 擺頭物理狀態更新
    if (this.isOn && this.oscActive) {
      this.oscVelocity = Math.min(this.targetOscVelocity, this.oscVelocity + this.oscAcceleration * deltaTime);
    } else {
      this.oscVelocity = this.oscVelocity * Math.pow(this.oscFriction, deltaTime);
      if (this.oscVelocity < 0.00001) {
        this.oscVelocity = 0;
      }
    }
    this.oscPhase += this.oscVelocity * deltaTime;
  }
}

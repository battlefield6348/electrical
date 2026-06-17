export class FanState {
  constructor() {
    this.isOn = false;
    this.speed = 0;
    this.angle = 0;
    this.maxSpeed = 18;
    this.acceleration = 0.15;
    this.friction = 0.08;
  }

  toggle() {
    this.isOn = !this.isOn;
  }

  update() {
    if (this.isOn) {
      this.speed = Math.min(this.maxSpeed, this.speed + this.acceleration);
    } else {
      this.speed = Math.max(0, this.speed - this.friction);
    }
    this.angle = (this.angle + this.speed) % 360;
  }
}

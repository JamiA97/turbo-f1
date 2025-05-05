import { generateRPMArray } from './turboModel.js';

let currentTorqueCurve = Array(20).fill(100);
let currentState = {};

export function setTorqueCurve(torqueCurve, state) {
  currentTorqueCurve = torqueCurve;
  currentState = state;
  console.log('✅ setTorqueCurve called:', currentState);
}

export function setupRace() {
  const button = document.getElementById('raceButton');
  button.addEventListener('click', () => runRace(currentState));
}

function runRace(state) {

  if (!state) {
    alert("Turbo settings not initialized. Please adjust a slider first.");
    return;
  }  


  const rpmArray = generateRPMArray();
  const trackWidth = document.getElementById('raceTrack').clientWidth - 40;
  const car = document.getElementById('car');
  const lapTimeEl = document.getElementById('lapTime');

  console.log('🏁 runRace called with state:', state); // <--- Add this

  const comp = state.compDiameter ?? 50;
  const turbine = state.turbineDiameter ?? 50;
  const torqueCurve = currentTorqueCurve;

  // Model 1: quadratic inertia
  const inertia = 0.001 * (comp ** 2 + turbine ** 2);

  let x = 0;
  let v = 0;
  let t = 0;
  const dt = 0.05;
  const maxDistance = 1000;
  let distance = 0;

  function animate() {
    const rpm = 1000 + v * 50;
    const torque = interpolate(rpm, rpmArray, torqueCurve);

    const boostRampUpTime = inertia * 2;
    const boostFactor = Math.min(1, t / boostRampUpTime);
    const effectiveTorque = torque * boostFactor;

    const a = torqueToAcceleration(effectiveTorque);
    v += a * dt;
    distance += v * dt;
    t += dt;

    const progress = Math.min(distance / maxDistance, 1);
    const px = Math.floor(progress * trackWidth);
    car.style.left = `${px}px`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      lapTimeEl.textContent = `Lap Time: ${t.toFixed(2)} s`;
    }
  }

  car.style.left = '0px';
  lapTimeEl.textContent = '';
  requestAnimationFrame(animate);
}



function interpolate(x, xArr, yArr) {
  for (let i = 1; i < xArr.length; i++) {
    if (xArr[i] >= x) {
      const t = (x - xArr[i - 1]) / (xArr[i] - xArr[i - 1]);
      return yArr[i - 1] + t * (yArr[i] - yArr[i - 1]);
    }
  }
  return yArr[yArr.length - 1];
}

function torqueToAcceleration(torque) {
  const mass = 1000;
  const gearRatio = 10;
  const force = torque * gearRatio;
  return force / mass;
}

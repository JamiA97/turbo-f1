import { Chart } from 'chart.js/auto';
import { setTorqueCurve } from '../simulation/racePhysics.js';

let chartInstance = null;

export function updateChart(config) {
  if (!chartInstance) return;

  const newTorqueCurve = generateTorqueCurve(config);
  chartInstance.data.datasets[0].data = newTorqueCurve;
  chartInstance.update();

  // Calculate turbo inertia
  const comp = config.compDiameter ?? 50;
  const turbine = config.turbineDiameter ?? 50;
  const inertia = 0.001 * (comp ** 2 + turbine ** 2); // simple model

  // Display it
  const inertiaDisplay = document.getElementById('inertiaDisplay');
  if (inertiaDisplay) {
    inertiaDisplay.textContent = `Computed Turbo Inertia: ${inertia.toFixed(2)} (arbitrary units)`;
  }

  // Pass curve + config to simulation
  setTorqueCurve(newTorqueCurve, config);
}

function drawChart() {
  const canvas = document.createElement('canvas');
  canvas.id = 'torqueChart';
  document.getElementById('chart').appendChild(canvas);

  chartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels: Array.from({ length: 20 }, (_, i) => 1000 + i * 250), // RPM from 1000 to 6000
      datasets: [{
        label: 'Torque (Nm)',
        data: Array(20).fill(0),
        borderWidth: 2,
        fill: true,
        tension: 0.3,
      }],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: 'Engine Speed (RPM)' }
        },
        y: {
          title: { display: true, text: 'Torque (Nm)' },
          beginAtZero: true
        }
      }
    }
  });
}

function generateTorqueCurve(config) {
  const rpm = Array.from({ length: 20 }, (_, i) => 1000 + i * 250);

  const {
    compDiameter = 50,
    turbineDiameter = 50,
    backsweep = 30,
    arRatio = 0.9,
    inertia = 5,
  } = config;

  const peakRPM = 3000 + (compDiameter - 50) * 20 + (arRatio - 0.9) * 2000;
  const peakTorque = 200 + (turbineDiameter - 50) * 4 - backsweep * 1;
  const width = 800 + backsweep * 12 + inertia * 150;

  return rpm.map(r => {
    const torque = peakTorque * Math.exp(-((r - peakRPM) ** 2) / (2 * width ** 2));
    return Math.round(Math.max(0, torque));
  });
}

export default drawChart;
//export { updateChart };


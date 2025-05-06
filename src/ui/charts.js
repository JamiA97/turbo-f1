import { Chart } from 'chart.js/auto';
import { setTorqueCurve } from '../simulation/racePhysics.js';

let chartInstance = null;

export function updateChart(config) {
  if (!chartInstance) return;

  // --- Compute efficiency
  const { compOD = 50, turbOD = 50 } = config;
  const effRatio = compOD / turbOD;
  let efficiency = 0.85 - Math.abs(effRatio - 1.1) * 0.2 / 0.3;
  efficiency = Math.max(0.65, Math.min(0.85, efficiency));

  // --- Compute inertia
  const inertia = 0.001 * (compOD ** 2 + turbOD ** 2);

  // --- Update UI
  const inertiaDisplay = document.getElementById('inertiaDisplay');
  if (inertiaDisplay) {
    inertiaDisplay.textContent = `Turbo Inertia: ${inertia.toFixed(2)} | Efficiency: ${(efficiency * 100).toFixed(1)}%`;
  }

  // --- Update chart
  const newTorqueCurve = generateTorqueCurve(config);
  chartInstance.data.datasets[0].data = newTorqueCurve;
  chartInstance.update();

  // --- Send to simulation
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
    compOD = 50,
    compInlet = 30,
    turbOD = 50,
    turbOutlet = 40,
  } = config;

  const peakTorque = 200 + (turbOD - turbOutlet); // Base torque, no η here
  const peakRPM = 3000 + (compOD - 50) * 25;
  const width = 800 + (compOD - compInlet) * 10 + (turbOD - turbOutlet) * 20;

  return rpm.map(r => {
    const torque = peakTorque * Math.exp(-((r - peakRPM) ** 2) / (2 * width ** 2));
    return Math.round(Math.max(0, torque));
  });
}


export default drawChart;
//export { updateChart };


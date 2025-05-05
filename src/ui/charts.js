import { Chart } from 'chart.js/auto';

let chartInstance = null;

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
  const torque = rpm.map(r => {
    const comp = config.compDiameter ?? 50;
    const turbine = config.turbineDiameter ?? 50;
    const backsweep = config.backsweep ?? 30;
    const ar = config.arRatio ?? 0.9;
    const inertia = config.inertia ?? 5;

    const peakRPM = 3000 + (comp - 50) * 10 + (ar - 0.9) * 1000;
    const peakTorque = 200 + (turbine - 50) * 2 - backsweep * 0.5;
    const width = 1000 + backsweep * 10 + inertia * 100;

    return Math.max(0, peakTorque * Math.exp(-((r - peakRPM) ** 2) / (2 * width ** 2)));
  });

  return torque.map(t => Math.round(t));
}

function updateChart(state) {
  if (!chartInstance) return;
  const newTorqueCurve = generateTorqueCurve(state);
  chartInstance.data.datasets[0].data = newTorqueCurve;
  chartInstance.update();
}

export default drawChart;
export { updateChart };


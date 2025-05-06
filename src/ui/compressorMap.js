import { Chart } from 'chart.js/auto';

let mapChart = null;

export default function drawCompressorMap(config) {
  const { compOD = 50, compInlet = 30 } = config;

  // --- Axis scaling (adjusted by geometry)
  const flowBase = 0.3 + (compInlet - 30) * 0.005;
  const prBase = 1.8 + (compOD - 50) * 0.02;

  const peakTorque = { x: flowBase - 0.05, y: prBase - 0.2 };
  const peakPower = { x: flowBase + 0.05, y: prBase + 0.3 };

  // --- Efficiency blob center (fixed for now)
  const effCenter = { x: flowBase, y: prBase };
  const effRadiusX = 0.08;
  const effRadiusY = 0.2;

  const ctxId = 'compressorMapCanvas';
  let canvas = document.getElementById(ctxId);

  // Create canvas if not already there
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = ctxId;
    document.getElementById('compressorMap').appendChild(canvas);
  }

  // If chart exists, destroy before redraw
  if (mapChart) {
    mapChart.destroy();
  }

  mapChart = new Chart(canvas, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Operating Points',
          data: [
            { x: peakTorque.x, y: peakTorque.y, label: 'Peak Torque' },
            { x: peakPower.x, y: peakPower.y, label: 'Peak Power' },
          ],
          backgroundColor: ['blue', 'red'],
          pointRadius: 6,
          showLine: false,
          parsing: false,
        },
        {
          label: 'High Efficiency Region',
          data: generateEfficiencyEllipse(effCenter, effRadiusX, effRadiusY, 40),
          backgroundColor: 'rgba(0, 200, 0, 0.2)',
          pointRadius: 1,
          showLine: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => ctx.raw.label ?? `Flow: ${ctx.raw.x}, PR: ${ctx.raw.y}`,
          },
        },
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          title: { display: true, text: 'Normalized Flow' },
          min: 0.2,
          max: 0.8,
        },
        y: {
          title: { display: true, text: 'Pressure Ratio' },
          min: 1.0,
          max: 3.2,
        },
      },
    },
  });
}

// Generates a circular point cloud for an efficiency zone
function generateEfficiencyEllipse(center, rx, ry, points = 32) {
  const out = [];
  for (let i = 0; i < points; i++) {
    const theta = (2 * Math.PI * i) / points;
    out.push({
      x: center.x + rx * Math.cos(theta),
      y: center.y + ry * Math.sin(theta),
    });
  }
  return out;
}


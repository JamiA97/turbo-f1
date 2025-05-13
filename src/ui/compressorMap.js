import { Chart } from 'chart.js/auto';

let mapChart = null;

export default function drawCompressorMap(config) {
  const { compOD = 50, compInlet = 30 } = config;

  // --- Axis scaling (adjusted by geometry)
  const flowBase = 0.3 + (compInlet - 30) * 0.005;
  const prBase = 1.8 + (compOD - 50) * 0.02;

  const peakTorque = { x: 0.4, y: 2.8 };
  const peakPower  = { x: 0.8, y: 3.5 };

  // Base compressor map polygon
  const baseMap = [
    { x: 0.1111, y: 1.5 },
    { x: 0.4444, y: 1.5 },
    { x: 0.7222, y: 2 },
    { x: 0.8889, y: 2.5 },
    { x: 0.9444, y: 3 },
    { x: 1.0000, y: 3.5 },
    { x: 0.9778, y: 4 },
    { x: 0.9444, y: 4.5 },
    { x: 0.5556, y: 5 },
    { x: 0.1111, y: 1.5 },
  ];

  // Shift map by geometry
  const dx = (compInlet - 30) * 0.0025;
  const dy = (compOD - 50) * 0.01;
  const shiftedMap = baseMap.map(p => ({ x: p.x + dx, y: p.y + dy }));

  // Efficiency zone center (geometry-influenced)
  const effCenter = { x: flowBase + 0.3, y: prBase + 1.0 };

  const ctxId = 'compressorMapCanvas';
  let canvas = document.getElementById(ctxId);

  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = ctxId;
    document.getElementById('compressorMap').appendChild(canvas);
  }

  if (!mapChart) {
    mapChart = new Chart(canvas, {
      type: 'scatter',
      data: {
        datasets: [
          { label: 'Operating Points', data: [], backgroundColor: ['blue', 'red'], pointRadius: 6, showLine: false, parsing: false },
          { label: 'Compressor Map Envelope', data: [], backgroundColor: 'rgba(100, 200, 255, 0.2)', borderColor: 'rgba(50, 100, 200, 0.6)', borderWidth: 1, showLine: true, fill: true, pointRadius: 0 },
          { label: 'High Efficiency Zone', type: 'line', data: [], backgroundColor: 'rgba(0, 200, 0, 0.4)', borderColor: 'rgba(0, 200, 0, 0.6)', borderWidth: 1, pointRadius: 0, showLine: true, fill: true },
          { label: 'Medium Efficiency Zone', type: 'line', data: [], backgroundColor: 'rgba(0, 200, 0, 0.15)', borderColor: 'rgba(0, 200, 0, 0.3)', borderWidth: 1, pointRadius: 0, showLine: true, fill: true },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
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
            min: 0.0,
            max: 1.1,
          },
          y: {
            title: { display: true, text: 'Pressure Ratio' },
            min: 1.0,
            max: 6.0,
          },
        },
      },
    });
  }

  // Update chart data only
  mapChart.data.datasets[0].data = [
    { x: peakTorque.x, y: peakTorque.y, label: 'Peak Torque' },
    { x: peakPower.x, y: peakPower.y, label: 'Peak Power' },
  ];
  mapChart.data.datasets[1].data = shiftedMap;
  mapChart.data.datasets[2].data = generateEfficiencyEllipse(effCenter, 0.1, 0.2, 40);
  mapChart.data.datasets[3].data = generateEfficiencyEllipse(effCenter, 0.2, 0.4, 40);

  mapChart.update();
}

function generateEfficiencyEllipse(center, rx, ry, points = 32) {
  const out = [];
  for (let i = 0; i < points; i++) {
    const theta = (2 * Math.PI * i) / points;
    out.push({
      x: center.x + rx * Math.cos(theta),
      y: center.y + ry * Math.sin(theta),
    });
  }
  out.push(out[0]); // close shape
  return out;
}

import '../styles/main.css';
import initUI from './ui/sliders.js';
import drawChart from './ui/charts.js';
import { setupTurboModel } from './simulation/turboModel.js';
import { setupRace } from './simulation/racePhysics.js';

function onSliderUpdate(state) {
  console.log("Turbo config updated:", state);
  updateChart(state);
}

window.addEventListener('DOMContentLoaded', () => {
  console.log("Turbo F1 loaded");

  // Manually insert a header and root container if desired
  const app = document.getElementById('app');
  app.innerHTML = `<h1>Turbo F1</h1><div id="chart"></div>`;

  initUI(onSliderUpdate);
  drawChart();
  setupTurboModel();
  setupRace();
});

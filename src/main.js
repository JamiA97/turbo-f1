import '../styles/main.css';
import initUI from './ui/sliders.js';
import drawChart, { updateChart } from './ui/charts.js';
import { setupTurboModel } from './simulation/turboModel.js';
import { setupRace } from './simulation/racePhysics.js';

function onSliderUpdate(state) {
  console.log("Turbo config updated:", state);
  updateChart(state);
}

function createLayout() {
  const app = document.getElementById('app');

  const title = document.createElement('h1');
  title.textContent = 'Turbo F1';

  const chartContainer = document.createElement('div');
  chartContainer.id = 'chart';

  const inertiaDisplay = document.createElement('div');
  inertiaDisplay.id = 'inertiaDisplay';
  inertiaDisplay.style.marginTop = '0.5rem';
  inertiaDisplay.style.fontStyle = 'italic';
  inertiaDisplay.style.color = '#444';

  const raceButton = document.createElement('button');
  raceButton.id = 'raceButton';
  raceButton.textContent = 'Race!';
  raceButton.style.marginTop = '1rem';

  const raceTrack = document.createElement('div');
  raceTrack.id = 'raceTrack';
  raceTrack.style.position = 'relative';
  raceTrack.style.height = '60px';
  raceTrack.style.background = '#ddd';
  raceTrack.style.marginTop = '1rem';

  const car = document.createElement('div');
  car.id = 'car';
  Object.assign(car.style, {
    position: 'absolute',
    left: '0',
    top: '10px',
    width: '40px',
    height: '20px',
    background: 'red',
    borderRadius: '5px',
    transition: 'left 0.05s linear',
  });
  raceTrack.appendChild(car);

  const lapTime = document.createElement('div');
  lapTime.id = 'lapTime';
  lapTime.style.marginTop = '1rem';
  lapTime.style.fontWeight = 'bold';

  app.appendChild(title);
  app.appendChild(chartContainer);
  app.appendChild(inertiaDisplay);
  app.appendChild(raceButton);
  app.appendChild(raceTrack);
  app.appendChild(lapTime);
}

window.addEventListener('DOMContentLoaded', () => {
  console.log("Turbo F1 loaded");

  createLayout();
  initUI(onSliderUpdate);
  drawChart();

  const initialState = {
    compDiameter: 50,
    turbineDiameter: 50,
    backsweep: 30,
    arRatio: 0.9,
  };

  updateChart(initialState);
  setupTurboModel();
  setupRace();
});


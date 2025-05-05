import '../styles/main.css';
import initUI from './ui/sliders.js';
import drawChart, { updateChart } from './ui/charts.js';
import { setupTurboModel } from './simulation/turboModel.js';
import { setupRace } from './simulation/racePhysics.js';

function onSliderUpdate(state) {
  console.log("Turbo config updated:", state);
  updateChart(state);
}

window.addEventListener('DOMContentLoaded', () => {
  console.log("Turbo F1 loaded");

  const app = document.getElementById('app');

  //app.innerHTML = `
  //  <h1>Turbo F1</h1>
  //  <div id="chart"></div>
  //  <button id="raceButton" style="margin-top: 1rem;">Race!</button>
  //  <div id="raceTrack" style="height: 100px; margin-top: 1rem;"></div>
  //  <div id="lapTime" style="margin-top: 1rem; font-weight: bold;"></div>
  //`;
  
  app.innerHTML = `
    <h1>Turbo F1</h1>
    <div id="chart"></div>
    <button id="raceButton" style="margin-top: 1rem;">Race!</button>
    <div id="raceTrack" style="position: relative; height: 60px; background: #ddd; margin-top: 1rem;">
      <div id="car" style="
        position: absolute;
        left: 0;
        top: 10px;
        width: 40px;
        height: 20px;
        background: red;
        border-radius: 5px;
        transition: left 0.05s linear;
      "></div>
    </div>
    <div id="lapTime" style="margin-top: 1rem; font-weight: bold;"></div>
  `;  

  initUI(onSliderUpdate);
  drawChart();

  const initialState = {
    compDiameter: 50,
    turbineDiameter: 50,
    backsweep: 30,
    arRatio: 0.9,
  };

  updateChart(initialState); // ensures chart + currentState are initialized  

  setupTurboModel();
  setupRace();
});


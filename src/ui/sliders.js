export default function initUI(onUpdate) {
  const app = document.getElementById('app');

  //const turboParams = [
  //  { id: 'compDiameter', label: 'Compressor Out Diameter (mm)', min: 30, max: 80, default: 50 },
  //  { id: 'turbineDiameter', label: 'Turbine In Diameter (mm)', min: 30, max: 80, default: 50 },
  //  { id: 'compInletDiameter', label: 'Compressor Inlet Diameter (mm)', min: 0, max: 60, default: 30 },
  //  { id: 'TurbineOutletDiameter', label: 'Turbine Outlet Diameter (mm)', min: 30, max: 70, step: 1, default: 50 },
  //  { id: 'inertia', label: 'Shaft Inertia (g⋅cm²)', min: 1, max: 10, step: 0.5, default: 5 },
  //];

  const turboParams = [
    { id: 'compOD', label: 'Compressor Outer Diameter (mm)', min: 30, max: 80, default: 50 },
    { id: 'compInlet', label: 'Compressor Inlet Diameter (mm)', min: 10, max: 60, default: 30 },
    { id: 'turbOD', label: 'Turbine Inlet Diameter (mm)', min: 30, max: 80, default: 50 },
    { id: 'turbOutlet', label: 'Turbine Outlet Diameter (mm)', min: 10, max: 70, default: 40 },
  ];

  const state = {};

  const container = document.createElement('div');
  container.className = 'sliders';

  turboParams.forEach(param => {
    const wrapper = document.createElement('div');
    wrapper.className = 'slider-wrapper';

    const label = document.createElement('label');
    label.htmlFor = param.id;
    label.textContent = `${param.label}: `;

    const valueSpan = document.createElement('span');
    valueSpan.id = `${param.id}-value`;
    valueSpan.textContent = param.default;

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = param.id;
    slider.min = param.min;
    slider.max = param.max;
    slider.value = param.default;
    slider.step = param.step || 1;

    state[param.id] = param.default;

    slider.addEventListener('input', () => {
      state[param.id] = parseFloat(slider.value);
        // Constraint logic
      if (param.id === 'compInlet') {
        const maxInlet = state['compOD'] * 0.85;
        if (state['compInlet'] > maxInlet) {
          state['compInlet'] = maxInlet;
          slider.value = maxInlet.toFixed(1);
          //valueSpan.textContent = slider.value;
        }  
      }

      if (param.id === 'turbOutlet') {
        const maxOutlet = state['turbOD'] * 0.85;
        if (state['turbOutlet'] > maxOutlet) {
          state['turbOutlet'] = maxOutlet;
          slider.value = maxOutlet.toFixed(1);
          //valueSpan.textContent = slider.value;
        }
      }    

      slider.value = state[param.id].toFixed(1);
      valueSpan.textContent = slider.value;  
      if (onUpdate) onUpdate(state);
    });

    label.appendChild(valueSpan);
    wrapper.appendChild(label);
    wrapper.appendChild(slider);
    container.appendChild(wrapper);
  });

  app.appendChild(container);
}


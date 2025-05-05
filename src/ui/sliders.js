export default function initUI(onUpdate) {
  const app = document.getElementById('app');

  const turboParams = [
    { id: 'compDiameter', label: 'Compressor Diameter (mm)', min: 30, max: 80, default: 50 },
    { id: 'turbineDiameter', label: 'Turbine Diameter (mm)', min: 30, max: 80, default: 50 },
    { id: 'backsweep', label: 'Blade Backsweep Angle (°)', min: 0, max: 60, default: 30 },
    { id: 'arRatio', label: 'A/R Ratio', min: 0.3, max: 1.5, step: 0.1, default: 0.9 },
    //{ id: 'inertia', label: 'Shaft Inertia (g⋅cm²)', min: 1, max: 10, step: 0.5, default: 5 },
  ];

  const state = {};

  const container = document.createElement('div');
  container.className = 'sliders';

  turboParams.forEach(param => {
    const wrapper = document.createElement('div');
    wrapper.className = 'slider-wrapper';

    const label = document.createElement('label');
    label.for = param.id;
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


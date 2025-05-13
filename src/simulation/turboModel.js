export function setupTurboModel() {
  console.log("Turbo model initialized");
}

export function generateRPMArray() {
  return Array.from({ length: 20 }, (_, i) => 1000 + i * 250);
}

export function generateTorqueCurve(config) {
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

export function computeTurboDynamics(config) {
  const { compOD = 50, turbOD = 50 } = config;
  const effRatio = compOD / turbOD;
  let efficiency = 0.85 - Math.abs(effRatio - 1.1) * 0.2 / 0.3;
  efficiency = Math.max(0.65, Math.min(0.85, efficiency));

  const inertia = 0.00005 * (compOD ** 2 + 5 * turbOD ** 2);

  return { efficiency, inertia };
}
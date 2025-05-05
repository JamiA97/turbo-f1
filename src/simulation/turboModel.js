export function setupTurboModel() {
  console.log("Turbo model initialized");
}

export function generateRPMArray() {
  return Array.from({ length: 20 }, (_, i) => 1000 + i * 250);
}

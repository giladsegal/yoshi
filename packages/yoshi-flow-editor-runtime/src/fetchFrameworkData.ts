export function fetchFrameworkData() {
  // TODO: conduction
  const experimentsPromise = Promise.resolve({ 'specs.AnExperiment': 'true' });
  return { experimentsPromise };
}

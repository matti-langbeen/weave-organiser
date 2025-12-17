/**
 * Simulates network latency for async operations
 */
const delay = (ms: number = 500): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export { delay };

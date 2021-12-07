export function timeout(ms: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
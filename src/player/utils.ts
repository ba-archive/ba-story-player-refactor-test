/**
 * wait in promise
 */
export function waitMs(ms: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
}

export function getCurrentUnixInSeconds() {
  const timestampMillis = Date.now()
  return Math.floor(timestampMillis / 1000)
}

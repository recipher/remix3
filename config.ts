/** Port the app (or, under `npm run hmr`, the HMR proxy) listens on by default. */
export const DEFAULT_PORT = 44100

/** Reads a port number from an environment variable, falling back to `fallback`. */
export function readPort(name: string, fallback: number): number {
  let value = process.env[name]
  return value ? Number.parseInt(value, 10) : fallback
}

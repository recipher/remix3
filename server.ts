import * as http from 'node:http'
import { createRequestListener } from 'remix/node-fetch-server'

import { router } from './app/router.ts'
import { DEFAULT_PORT, readPort } from './config.ts'

const port = readPort('PORT', DEFAULT_PORT)
const hmrProxyPort = process.env.HMR_PROXY_PORT ? readPort('HMR_PROXY_PORT', DEFAULT_PORT) : null
const isHmr = process.env.REMIX_NODE_HMR === '1'

const server = http.createServer(createRequestListener(router.fetch, {
    trustProxy: isHmr || process.env.NODE_ENV === 'production',
  }))

server.listen(port, () => {
  if (isHmr) {
    import('remix/node-hmr/runtime').then((nodeHmr) => nodeHmr.emitServerReady())
  }

  console.log(`Server listening on http://localhost:${hmrProxyPort ?? port}`)
})

let shuttingDown = false

function shutdown() {
  if (shuttingDown) {
    return
  }

  shuttingDown = true
  server.close(() => process.exit(0))
  server.closeAllConnections()
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

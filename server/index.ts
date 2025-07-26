import { createServer } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function startServer() {
  // Create Vite server using the existing vite.config.ts configuration
  const server = await createServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    server: {
      host: '0.0.0.0',
      port: 5000,
      allowedHosts: 'all'
    }
  })

  await server.listen()
  console.log('File Converter Box - Client-side application running!')
  console.log('Access your app at: http://localhost:5000')
}

startServer().catch(console.error)
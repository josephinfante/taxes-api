import express, { Application, Router } from 'express'

interface ServerOption {
	port?: number
	routes: Router
}

export class Server {
	public readonly app: Application = express()
	public readonly port: number
	public readonly routes: Router
	constructor(options: ServerOption) {
		const { port = 3000, routes } = options
		this.port = port
		this.routes = routes
	}
	async start() {
		this.app.use(express.json())
		this.app.use(express.urlencoded({ extended: true }))
		this.app.use(this.routes)
		this.app.listen(this.port, () => {
			console.log(`Server running on port ${this.port}`)
		})
	}
}

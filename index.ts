import { AppRoutes } from './src/routes'
import { Server } from './src/server'
import { PORT } from './src/config'
;(() => {
	main()
})()

async function main() {
	new Server({
		port: PORT,
		routes: AppRoutes.routes,
	}).start()
}

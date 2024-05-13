import { Router } from 'express'
import { AuthRouter, PropertiesRouter, UsersRouter } from './api'

export class AppRoutes {
	static get routes(): Router {
		const router = Router()

		router.use('/api/v1/auth', AuthRouter.routes)
		router.use('/api/v1/user', UsersRouter.routes)
		router.use('/api/v1/property', PropertiesRouter.routes)

		return router
	}
}

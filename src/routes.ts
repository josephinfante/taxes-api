import { Router } from 'express'
import { AuthRouter, PaymentsRouter, PropertiesRouter, TaxesRouter, UsersRouter } from './api'

export class AppRoutes {
	static get routes(): Router {
		const router = Router()

		router.use('/api/v1/auth', AuthRouter.routes)
		router.use('/api/v1/user', UsersRouter.routes)
		router.use('/api/v1/property', PropertiesRouter.routes)
		router.use('/api/v1/tax', TaxesRouter.routes)
		router.use('/api/v1/tax', PaymentsRouter.routes)

		return router
	}
}

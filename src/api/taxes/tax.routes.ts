import { Router } from 'express'
import { canAccess, isSuperAdmin } from '../../middlewares'
import { TaxesController } from './tax.controller'

export class TaxesRouter {
	static get routes(): Router {
		const router = Router()
		const controller = new TaxesController()

		router.post('/', canAccess, isSuperAdmin, controller.create.bind(controller))
		router.patch('/:id', canAccess, isSuperAdmin, controller.update.bind(controller))

		return router
	}
}

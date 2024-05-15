import { Router } from 'express'
import { canAccess, isSuperAdmin } from '../../middlewares'
import { PaymentsController } from './payment.controller'

export class PaymentsRouter {
	static get routes(): Router {
		const router = Router()
		const controller = new PaymentsController()

		router.post('/:tax_id/payment', canAccess, isSuperAdmin, controller.create.bind(controller))
		router.patch('/:tax_id/payment/:id', canAccess, isSuperAdmin, controller.update.bind(controller))
		router.delete('/:tax_id/payment/:id', canAccess, isSuperAdmin, controller.delete.bind(controller))
		router.get('/:tax_id/payment', canAccess, controller.findAllByTaxId.bind(controller))

		return router
	}
}

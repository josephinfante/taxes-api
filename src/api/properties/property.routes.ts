import { Router } from 'express'
import { PropertiesController } from './property.controller'
import { canAccess, isSuperAdmin } from '../../middlewares'

export class PropertiesRouter {
	static get routes(): Router {
		const router = Router()
		const controller = new PropertiesController()

		router.post('/', canAccess, isSuperAdmin, controller.create.bind(controller))
		router.patch('/:id', canAccess, isSuperAdmin, controller.update.bind(controller))
		router.delete('/:id', canAccess, isSuperAdmin, controller.delete.bind(controller))
		router.get('/:id', canAccess, controller.find.bind(controller))
		router.get('/', canAccess, controller.findAll.bind(controller))

		return router
	}
}

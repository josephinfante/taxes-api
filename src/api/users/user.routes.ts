import { Router } from 'express'
import { UsersController } from './user.controller'
import { canAccess, isSuperAdmin } from '../../middlewares'

export class UsersRouter {
	static get routes(): Router {
		const router = Router()
		const controller = new UsersController()

		router.post('/', canAccess, isSuperAdmin, controller.create.bind(controller))
		router.patch('/:id', canAccess, controller.update.bind(controller))
		router.delete('/:id', canAccess, isSuperAdmin, controller.delete.bind(controller))
		router.get('/:id', canAccess, controller.find.bind(controller))
		router.get('/', canAccess, isSuperAdmin, controller.findAll.bind(controller))

		return router
	}
}

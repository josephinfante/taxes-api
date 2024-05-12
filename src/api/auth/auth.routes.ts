import { Router } from 'express'
import { AuthController } from './auth.controller'

export class AuthRouter {
	static get routes(): Router {
		const router = Router()
		const controller = new AuthController()

		router.post('/login', controller.loginUser.bind(controller))
		router.post('/send-authentication-code', controller.sendAuthenticationCode.bind(controller))
		router.post('/admin/login', controller.loginAdmin.bind(controller))
		router.post('/forgot-password', controller.forgotPassword.bind(controller))
		router.post('/reset-password', controller.resetPassword.bind(controller))
		router.post('/reset-email', controller.resetEmail.bind(controller))

		return router
	}
}

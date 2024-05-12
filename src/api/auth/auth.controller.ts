import { Request, Response } from 'express'
import { CustomError } from '../../shared'
import { UsersDao } from '../users/user.dao'
import { NODE_ENV } from '../../config'

export class AuthController {
	private handleError = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({ error: error.message })
		}
		return res.status(500).json({ error: 'Error interno del servidor.' })
	}
	loginUser = async (req: Request, res: Response) => {
		await UsersDao.loginUser(req.body)
			.then((response) => {
				res.cookie('auth', response.token, {
					httpOnly: true,
					secure: NODE_ENV === 'production',
					maxAge: 10 * 24 * 60 * 60,
				})
				res.status(200).json(response.user)
			})
			.catch((error) => this.handleError(error, res))
	}
	loginAdmin = async (req: Request, res: Response) => {
		await UsersDao.loginAdmin(req.body)
			.then((response) => {
				res.cookie('auth', response.token, {
					httpOnly: true,
					secure: NODE_ENV === 'production',
					maxAge: 10 * 24 * 60 * 60,
				})
				res.status(200).json(response.user)
			})
			.catch((error) => this.handleError(error, res))
	}
	sendAuthenticationCode = async (req: Request, res: Response) => {
		await UsersDao.sendAuthenticationCode(req.body.email)
			.then(() =>
				res
					.status(200)
					.json({ message: 'El código de autenticación ha sido enviado correctamente. Revisa tu correo.' }),
			)
			.catch((error) => this.handleError(error, res))
	}
	forgotPassword = async (req: Request, res: Response) => {
		await UsersDao.forgotPassword(req.body.email)
			.then((message) => res.status(200).json({ message }))
			.catch((error) => this.handleError(error, res))
	}
	resetPassword = async (req: Request, res: Response) => {
		await UsersDao.resetPassword(req.body)
			.then((message) => res.status(200).json({ message }))
			.catch((error) => this.handleError(error, res))
	}
	resetEmail = async (req: Request, res: Response) => {
		await UsersDao.resetEmail(req.body)
			.then((message) => res.status(200).json({ message }))
			.catch((error) => this.handleError(error, res))
	}
}

import { Request, Response } from 'express'
import { CustomError } from '../../shared'
import { UsersDao } from './user.dao'

export class UsersController {
	private handleError = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({ error: error.message })
		}
		return res.status(500).json({ error: 'Error interno del servidor.' })
	}
	create = async (req: Request, res: Response) => {
		return UsersDao.create(req.body)
			.then((user) => res.status(201).json(user))
			.catch((error) => this.handleError(error, res))
	}
	update = async (req: Request, res: Response) => {
		return UsersDao.update(req.params.id, req.body, res.locals.access)
			.then((user) => res.status(200).json(user))
			.catch((error) => this.handleError(error, res))
	}
	delete = async (req: Request, res: Response) => {
		return UsersDao.delete(req.params.id, req.query, res.locals.access)
			.then((message) => res.status(200).json({ message }))
			.catch((error) => this.handleError(error, res))
	}
	find = async (req: Request, res: Response) => {
		return UsersDao.find(req.params.id, res.locals.access)
			.then((user) => res.status(200).json(user))
			.catch((error) => this.handleError(error, res))
	}
	findAll = async (req: Request, res: Response) => {
		return UsersDao.findAll(req.query)
			.then((users) => res.status(200).json(users))
			.catch((error) => this.handleError(error, res))
	}
}

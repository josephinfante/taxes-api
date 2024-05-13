import { Request, Response } from 'express'
import { CustomError } from '../../shared'
import { PropertiesDao } from './property.dao'

export class PropertiesController {
	private handleError = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({ error: error.message })
		}
		return res.status(500).json({ error: 'Error interno del servidor.' })
	}
	create = async (req: Request, res: Response) => {
		return PropertiesDao.create(req.body)
			.then((property) => res.status(201).json(property))
			.catch((error) => this.handleError(error, res))
	}
	update = async (req: Request, res: Response) => {
		return PropertiesDao.update(req.params.id, req.body)
			.then((property) => res.status(200).json(property))
			.catch((error) => this.handleError(error, res))
	}
	delete = async (req: Request, res: Response) => {
		return PropertiesDao.delete(req.params.id)
			.then((message) => res.status(200).json({ message }))
			.catch((error) => this.handleError(error, res))
	}
	find = async (req: Request, res: Response) => {
		return PropertiesDao.find(req.params.id)
			.then((property) => res.status(200).json(property))
			.catch((error) => this.handleError(error, res))
	}
	findAll = async (req: Request, res: Response) => {
		return PropertiesDao.findAll(req.query)
			.then((properties) => res.status(200).json(properties))
			.catch((error) => this.handleError(error, res))
	}
}

import { Request, Response } from 'express'
import { CustomError } from '../../shared'
import { TaxesDao } from './tax.dao'

export class TaxesController {
	private handleError = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({ error: error.message })
		}
		return res.status(500).json({ error: 'Error interno del servidor.' })
	}
	create = async (req: Request, res: Response) => {
		return TaxesDao.create(req.body)
			.then((tax) => res.status(201).json(tax))
			.catch((error) => this.handleError(error, res))
	}
	update = async (req: Request, res: Response) => {
		return TaxesDao.update(req.params.id, req.body)
			.then((tax) => res.status(200).json(tax))
			.catch((error) => this.handleError(error, res))
	}
	find = async (req: Request, res: Response) => {
		return TaxesDao.find(req.params.id)
			.then((tax) => res.status(200).json(tax))
			.catch((error) => this.handleError(error, res))
	}
}

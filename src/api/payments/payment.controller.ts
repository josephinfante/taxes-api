import { Request, Response } from 'express'
import { CustomError } from '../../shared'
import { PaymentsDao } from './payment.dao'

export class PaymentsController {
	private handleError = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({ error: error.message })
		}
		return res.status(500).json({ error: 'Error interno del servidor.' })
	}
	create = async (req: Request, res: Response) => {
		return PaymentsDao.create(req.params.tax_id, req.body)
			.then((payment) => res.status(201).json(payment))
			.catch((error) => this.handleError(error, res))
	}
	update = async (req: Request, res: Response) => {
		return PaymentsDao.update(req.params.id, req.body)
			.then((payment) => res.status(200).json(payment))
			.catch((error) => this.handleError(error, res))
	}
	delete = async (req: Request, res: Response) => {
		return PaymentsDao.delete(req.params.id)
			.then((message) => res.status(200).json({ message }))
			.catch((error) => this.handleError(error, res))
	}
	findAllByTaxId = async (req: Request, res: Response) => {
		return PaymentsDao.findAllByTaxId(req.params.tax_id)
			.then((payments) => res.status(200).json(payments))
			.catch((error) => this.handleError(error, res))
	}
}

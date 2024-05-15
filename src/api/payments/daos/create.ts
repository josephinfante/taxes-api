import { PAYMENTS_STATUS } from '../../../config'
import { PaymentsModel } from '../../../models'
import { CustomError, Generate, Payments, Validators } from '../../../shared'
import { TaxesDao } from '../../taxes/tax.dao'

export async function createPayment(tax_id: string, data: Partial<Payments>): Promise<Payments> {
	try {
		if (!tax_id) throw CustomError.badRequest('El ID del impuesto es requerido.')
		await TaxesDao.find(tax_id)

		if (!data?.reason) throw CustomError.badRequest('La razón de pago es requerida.')

		if (!data?.amount) throw CustomError.badRequest('El monto es requerido.')
		if (!Validators.isNumber(data.amount)) throw CustomError.badRequest('El monto debe ser un número.')

		if (data?.delay_amount && !Validators.isNumber(data.delay_amount))
			throw CustomError.badRequest('El monto de la mora debe ser un número.')

		if (data?.fee_amount && !Validators.isNumber(data.fee_amount))
			throw CustomError.badRequest('El monto de la tarifa/costo debe ser un número.')

		if (!data?.paid_at) throw CustomError.badRequest('La fecha de pago es requerida.')
		if (!Validators.isNumber(data.paid_at)) throw CustomError.badRequest('La fecha de pago debe ser un número.')

		const payment = await PaymentsModel.create({
			id: Generate.id(),
			reason: data.reason,
			amount: data.amount,
			delay_amount: data?.delay_amount || null,
			fee_amount: data?.fee_amount || null,
			total_paid_amount: data.amount + (data?.delay_amount || 0) + (data?.fee_amount || 0),
			status: PAYMENTS_STATUS.PAID,
			details: data?.details || null,
			paid_at: data.paid_at,
			tax_id: tax_id,
			updated_at: Date.now(),
			created_at: Date.now(),
		})

		await TaxesDao.updateTotalPaid(tax_id)

		return payment.dataValues
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

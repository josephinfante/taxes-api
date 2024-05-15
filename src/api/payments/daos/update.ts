import { PaymentsModel } from '../../../models'
import { CustomError, Payments, Validators } from '../../../shared'
import { TaxesDao } from '../../taxes/tax.dao'

export async function updatePayment(id: string, data: Partial<Payments>): Promise<Payments> {
	try {
		let amount_modified: boolean = false
		if (!id) throw CustomError.badRequest('El ID del pago es requerido.')

		const payment_exists = await PaymentsModel.findByPk(id)
		if (!payment_exists) throw CustomError.badRequest(`El pago con ID '${id}' no existe.`)

		const has_changes = Object.keys(data).filter(
			(key) => data[key] !== undefined && key !== 'id' && key !== 'created_at' && key !== 'updated_at',
		)

		if (has_changes.length === 0) throw CustomError.badRequest('Modifica al menos un campo.')

		if (data?.amount && !Validators.isNumber(data.amount)) throw CustomError.badRequest('El monto debe ser un número.')

		if (data?.delay_amount && !Validators.isNumber(data.delay_amount))
			throw CustomError.badRequest('El monto de la mora debe ser un número.')

		if (data?.fee_amount && !Validators.isNumber(data.fee_amount))
			throw CustomError.badRequest('El monto de la tarifa/costo debe ser un número.')

		if (data?.reason && data?.reason != payment_exists.dataValues.reason) {
			payment_exists.set('reason', data.reason)
		}

		if (data?.amount && data?.amount != Number(payment_exists.dataValues.amount)) {
			payment_exists.set('amount', data.amount)
			payment_exists.set(
				'total_paid_amount',
				data.amount +
					(Number(payment_exists.dataValues.delay_amount) || 0) +
					(Number(payment_exists.dataValues.fee_amount) || 0),
			)
			amount_modified = true
		}

		if (data?.delay_amount && data?.delay_amount != Number(payment_exists.dataValues.delay_amount)) {
			payment_exists.set('delay_amount', data.delay_amount)
			payment_exists.set(
				'total_paid_amount',
				Number(payment_exists.dataValues.amount) +
					(data.delay_amount || 0) +
					(Number(payment_exists.dataValues.fee_amount) || 0),
			)
			amount_modified = true
		}

		if (data?.fee_amount && data?.fee_amount != Number(payment_exists.dataValues.fee_amount)) {
			payment_exists.set('fee_amount', data.fee_amount)
			payment_exists.set(
				'total_paid_amount',
				Number(payment_exists.dataValues.amount) +
					(Number(payment_exists.dataValues.delay_amount) || 0) +
					(data.fee_amount || 0),
			)
			amount_modified = true
		}

		if (data?.status && data?.status != payment_exists.dataValues.status) {
			payment_exists.set('status', data.status)
		}

		if (data?.details && data?.details != payment_exists.dataValues.details) {
			payment_exists.set('details', data.details)
		}

		if (data?.paid_at && data?.paid_at != Number(payment_exists.dataValues.paid_at)) {
			payment_exists.set('paid_at', data.paid_at)
		}

		if (data?.tax_id && data?.tax_id != payment_exists.dataValues.tax_id) {
			await TaxesDao.find(data.tax_id)
			payment_exists.set('tax_id', data.tax_id)
		}

		payment_exists.set('updated_at', Date.now())
		await payment_exists.save()

		if (amount_modified) await TaxesDao.updateTotalPaid(payment_exists.dataValues.tax_id)

		return payment_exists.dataValues
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

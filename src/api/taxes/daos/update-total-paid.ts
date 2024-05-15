import { TAXES_STATUS } from '../../../config'
import { PaymentsModel, TaxesModel } from '../../../models'
import { CustomError } from '../../../shared'

export async function updateTaxTotalPaid(id: string): Promise<void> {
	try {
		if (!id) throw CustomError.badRequest('El ID es requerido.')

		const tax_exists = await TaxesModel.findByPk(id, {
			include: [{ model: PaymentsModel, attributes: ['total_paid_amount'] }],
		})
		if (!tax_exists) throw CustomError.badRequest(`El impuesto con ID '${id}' no existe.`)

		let total_paid_amount = 0
		if (tax_exists.dataValues.payments) {
			total_paid_amount = tax_exists.dataValues.payments.reduce((acc: number, payment: any) => {
				return acc + Number(payment.dataValues.total_paid_amount)
			}, 0)
		}

		if (tax_exists.dataValues.total_debt_amount >= Number(total_paid_amount)) {
			tax_exists.set('status', TAXES_STATUS.PAID)
		} else {
			tax_exists.set('status', TAXES_STATUS.PENDING)
		}
		tax_exists.set({
			total_paid_amount: total_paid_amount,
			updated_at: Date.now(),
		})

		await tax_exists.save()
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

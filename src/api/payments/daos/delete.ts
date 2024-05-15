import { PaymentsModel } from '../../../models'
import { CustomError } from '../../../shared'
import { TaxesDao } from '../../taxes/tax.dao'

export async function deletePayment(id: string): Promise<string> {
	try {
		let tax_id: string = ''
		if (!id) throw CustomError.badRequest('El ID del pago es requerido.')

		const payment_exists = await PaymentsModel.findByPk(id)
		if (!payment_exists) throw CustomError.badRequest(`El pago con ID '${id}' no existe.`)
		tax_id = payment_exists.dataValues.tax_id

		await payment_exists.destroy()
		await TaxesDao.updateTotalPaid(tax_id)

		return 'El pago fue eliminado correctamente.'
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

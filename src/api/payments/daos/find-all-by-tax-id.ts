import { PaymentsModel } from '../../../models'
import { CustomError, Payments } from '../../../shared'

export async function findAllPaymentsByTaxId(id: string): Promise<Payments[]> {
	try {
		if (!id) throw CustomError.badRequest('El ID del impuesto es requerido.')

		const payments = await PaymentsModel.findAll({
			where: { tax_id: id },
			order: [['created_at', 'DESC']],
		})

		return payments?.map((payment) => payment.dataValues)
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

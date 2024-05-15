import { TAXES_STATUS } from '../../../config'
import { TaxesModel } from '../../../models'
import { CustomError, Generate, Taxes, Validators } from '../../../shared'
import { PropertiesDao } from '../../properties/property.dao'

export async function createTax(data: Partial<Taxes>): Promise<Taxes> {
	try {
		if (!data?.year) throw CustomError.badRequest('El año es requerido.')
		if (!Validators.isNumber(data.year)) throw CustomError.badRequest('El año debe ser un número.')

		if (!data?.total_debt_amount) throw CustomError.badRequest('El monto de la deuda es requerido.')
		if (!Validators.isNumber(data?.total_debt_amount))
			throw CustomError.badRequest('El monto de la deuda debe ser un número.')

		if (!data?.property_id) throw CustomError.badRequest('La propiedad es requerida.')

		await PropertiesDao.find(data.property_id)

		const taxes = await TaxesModel.create({
			id: Generate.id(),
			year: data.year,
			total_paid_amount: null,
			total_debt_amount: data.total_debt_amount,
			status: TAXES_STATUS.PENDING,
			property_id: data.property_id,
			updated_at: Date.now(),
			created_at: Date.now(),
		})

		return taxes.dataValues
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

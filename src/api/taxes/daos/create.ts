import { TaxesModel } from '../../../models'
import { CustomError, Generate, Taxes, Validators } from '../../../shared'
import { PropertiesDao } from '../../properties/property.dao'

export async function createTax(data: Partial<Taxes>): Promise<Taxes> {
	try {
		if (!data?.year) throw CustomError.badRequest('El año es requerido.')
		if (!Validators.isNumber(data.year)) throw CustomError.badRequest('El año debe ser un número.')
		if (!data?.debt_amount_value) throw CustomError.badRequest('El monto de la deuda es requerido.')
		if (!Validators.isNumber(data?.debt_amount_value))
			throw CustomError.badRequest('El monto de la deuda debe ser un número.')
		if (!data?.debt_amount_currency) throw CustomError.badRequest('La divisa del monto adeudado es requerida.')
		if (!data?.fee_amount_value) throw CustomError.badRequest('El monto de la comisión es requerido.')
		if (!Validators.isNumber(data?.fee_amount_value))
			throw CustomError.badRequest('El monto de la comisión debe ser un número.')
		if (!data?.fee_amount_currency) throw CustomError.badRequest('La divisa de la comisión es requerida.')
		if (!data?.property_id) throw CustomError.badRequest('La propiedad es requerida.')

		await PropertiesDao.find(data.property_id)

		const taxes = await TaxesModel.create({
			id: Generate.id(),
			year: data.year,
			debt_amount_value: data.debt_amount_value,
			debt_amount_currency: data.debt_amount_currency,
			fee_amount_value: data.fee_amount_value,
			fee_amount_currency: data.fee_amount_currency,
			total_amount_value: data.debt_amount_value * (1 + data.fee_amount_value),
			total_amount_currency: data.debt_amount_currency,
			status: data.status,
			files: data?.files || null,
			paid_at: data?.paid_at || null,
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

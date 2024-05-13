import { TaxesModel } from '../../../models'
import { CustomError, Taxes } from '../../../shared'
import { PropertiesDao } from '../../properties/property.dao'

export async function updateTax(id: string, data: Partial<Taxes>): Promise<Taxes> {
	try {
		if (!id) throw CustomError.badRequest('El ID es requerido.')

		const tax_exists = await TaxesModel.findByPk(id)
		if (!tax_exists) throw CustomError.badRequest(`El tax con ID '${id}' no existe.`)

		const has_changes = Object.keys(data).filter(
			(key) =>
				data[key] !== undefined &&
				key !== 'total_amount_value' &&
				key !== 'total_amount_currency' &&
				key !== 'id' &&
				key !== 'created_at' &&
				key !== 'updated_at',
		)

		if (has_changes.length === 0) throw CustomError.badRequest('Modifica al menos un campo.')

		if (data?.debt_amount_value && data?.debt_amount_value !== tax_exists.dataValues.debt_amount_value) {
			tax_exists.set('debt_amount_value', data.debt_amount_value)
			tax_exists.set('total_amount_value', data.debt_amount_value * (1 + tax_exists.dataValues.fee_amount_value))
		}

		if (data?.debt_amount_currency && data?.debt_amount_currency !== tax_exists.dataValues.debt_amount_currency) {
			tax_exists.set('debt_amount_currency', data.debt_amount_currency)
			tax_exists.set('total_amount_currency', data.total_amount_currency)
		}

		if (data?.fee_amount_value && data?.fee_amount_value !== tax_exists.dataValues.fee_amount_value) {
			tax_exists.set('fee_amount_value', data.fee_amount_value)
			tax_exists.set('total_amount_value', tax_exists.dataValues.debt_amount_value * (1 + data.fee_amount_value))
		}

		if (data?.fee_amount_currency && data?.fee_amount_currency !== tax_exists.dataValues.fee_amount_currency) {
			tax_exists.set('fee_amount_currency', data.fee_amount_currency)
		}

		if (data?.status && data?.status !== tax_exists.dataValues.status) {
			tax_exists.set('status', data.status)
		}

		if (data?.files && data?.files !== tax_exists.dataValues.files) {
			tax_exists.set('files', data.files)
		}

		if (data?.paid_at && data?.paid_at !== tax_exists.dataValues.paid_at) {
			tax_exists.set('paid_at', data.paid_at)
		}

		if (data?.property_id && data?.property_id !== tax_exists.dataValues.property_id) {
			await PropertiesDao.find(data.property_id)
			tax_exists.set('property_id', data.property_id)
		}

		tax_exists.set('updated_at', Date.now())
		await tax_exists.save()

		return tax_exists.dataValues
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

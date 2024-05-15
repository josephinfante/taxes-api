import { TaxesModel } from '../../../models'
import { CustomError, Taxes, taxPresenter } from '../../../shared'
import { PropertiesDao } from '../../properties/property.dao'

export async function updateTax(id: string, data: Partial<Taxes>): Promise<Taxes> {
	try {
		if (!id) throw CustomError.badRequest('El ID es requerido.')

		const tax_exists = await TaxesModel.findByPk(id)
		if (!tax_exists) throw CustomError.badRequest(`El impuesto con ID '${id}' no existe.`)

		const has_changes = Object.keys(data).filter(
			(key) =>
				data[key] !== undefined &&
				key !== 'total_paid_amount' &&
				key !== 'id' &&
				key !== 'created_at' &&
				key !== 'updated_at',
		)

		if (has_changes.length === 0) throw CustomError.badRequest('Modifica al menos un campo.')

		if (data?.total_debt_amount && data?.total_debt_amount != Number(tax_exists.dataValues.total_debt_amount)) {
			tax_exists.set('total_debt_amount', data.total_debt_amount)
		}

		if (data?.status && data?.status != tax_exists.dataValues.status) {
			tax_exists.set('status', data.status)
		}

		if (data?.property_id && data?.property_id != tax_exists.dataValues.property_id) {
			await PropertiesDao.find(data.property_id)
			tax_exists.set('property_id', data.property_id)
		}

		tax_exists.set('updated_at', Date.now())
		await tax_exists.save()

		return taxPresenter(tax_exists.dataValues)
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

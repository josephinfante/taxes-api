import { TaxesModel } from '../../../models'
import { CustomError, Taxes, taxPresenter } from '../../../shared'

export async function findTax(id: string): Promise<Taxes> {
	try {
		if (!id) throw CustomError.badRequest('El ID es requerido.')

		const tax_exists = await TaxesModel.findByPk(id)
		if (!tax_exists) throw CustomError.badRequest(`El impuesto con ID '${id}' no existe.`)

		return taxPresenter(tax_exists.dataValues)
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

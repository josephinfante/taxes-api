import { PropertiesModel } from '../../../models'
import { CustomError, Properties, propertyPresenter } from '../../../shared'

export async function findProperty(id: string): Promise<Properties> {
	try {
		if (!id) throw CustomError.badRequest('El ID es requerido.')

		const property_exists = await PropertiesModel.findByPk(id)
		if (!property_exists) throw CustomError.badRequest(`La propiedad con ID '${id}' no existe.`)

		return propertyPresenter(property_exists.dataValues)
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

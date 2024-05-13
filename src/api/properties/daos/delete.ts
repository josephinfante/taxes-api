import { PropertiesModel } from '../../../models'
import { CustomError } from '../../../shared'

export async function deleteProperty(id: string): Promise<string> {
	try {
		if (!id) throw CustomError.badRequest('El ID es requerido.')

		const property_exists = await PropertiesModel.findByPk(id)
		if (!property_exists) throw CustomError.badRequest(`La propiedad con ID '${id}' no existe.`)

		property_exists.set({
			deleted: !property_exists.dataValues.deleted,
			updated_at: Date.now(),
		})
		await property_exists.save()

		return property_exists.dataValues.deleted
			? `La propiedad '${property_exists.dataValues.name}' ha sido removida.`
			: `La propiedad '${property_exists.dataValues.name}' ha sido restaurada.`
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

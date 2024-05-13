import { PropertiesModel } from '../../../models'
import { CustomError, Properties } from '../../../shared'

export async function updateProperty(id: string, data: Partial<Properties>): Promise<Properties> {
	try {
		if (!id) throw CustomError.badRequest('El ID es requerido.')

		const property_exists = await PropertiesModel.findByPk(id)
		if (!property_exists) throw CustomError.badRequest(`La propiedad con ID '${id}' no existe.`)

		const has_changes = Object.keys(data).filter(
			(key) =>
				data[key] !== undefined &&
				key !== 'id' &&
				key !== 'hidden' &&
				key !== 'deleted' &&
				key !== 'created_at' &&
				key !== 'updated_at',
		)

		if (has_changes.length === 0) throw CustomError.badRequest('Modifica al menos un campo.')

		if (data?.name && data?.name !== property_exists.dataValues.name) {
			property_exists.set('name', data.name)
		}

		if (data?.address && data?.address !== property_exists.dataValues.address) {
			property_exists.set('address', data.address)
		}

		property_exists.set('updated_at', Date.now())
		await property_exists.save()

		return property_exists.dataValues
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

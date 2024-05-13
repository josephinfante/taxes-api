import { PropertiesModel } from '../../../models'
import { CustomError, Generate, Properties } from '../../../shared'

export async function createProperty(data: Partial<Properties>): Promise<Properties> {
	try {
		if (!data.name) throw CustomError.badRequest('El nombre de la propiedad es requerido.')
		if (!data.address) throw CustomError.badRequest('La dirección de la propiedad es requerida.')

		const [property, created] = await PropertiesModel.findOrCreate({
			where: { name: data.name },
			defaults: {
				id: Generate.id(),
				name: data.name,
				address: data.address,
				hidden: false,
				deleted: false,
				updated_at: Date.now(),
				created_at: Date.now(),
			},
		})

		if (!created) throw CustomError.badRequest('Registro fallido. No se pudo registrar la propiedad.')

		return property.dataValues
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

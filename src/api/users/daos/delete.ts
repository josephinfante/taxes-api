import { ParsedQs } from 'qs'
import { Access, CustomError } from '../../../shared'
import { UsersModel } from '../../../models'

export async function deleteUser(id: string, query: ParsedQs, access: Access): Promise<string> {
	try {
		if (!id) throw CustomError.badRequest('El ID es requerido.')
		if (access.user.id !== id && !access.user?.super_admin)
			throw CustomError.forbidden('No se puede procesar la solicitud.')

		const user_exists = await UsersModel.findByPk(id)
		if (!user_exists && access.user?.super_admin) {
			throw CustomError.badRequest(`El usuario con ID '${id}' no existe.`)
		} else if (!user_exists) {
			throw CustomError.badRequest('No se puede procesar la solicitud.')
		}

		if (access.user?.super_admin && query?.delete) {
			await user_exists.destroy()
			return `El usuario con ID '${id}' ha sido permanentemente eliminado.`
		}

		const date_now = Date.now()
		user_exists.set({
			deleted: !user_exists.dataValues.deleted,
			updated_at: date_now,
		})
		await user_exists.save()

		return user_exists.dataValues.deleted
			? `El usuario '${user_exists.dataValues.first_name} ${user_exists.dataValues.last_name}' ha sido removido.`
			: `El usuario '${user_exists.dataValues.first_name} ${user_exists.dataValues.last_name}' ha sido restaurado.`
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

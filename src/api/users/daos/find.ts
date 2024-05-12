import { UsersModel } from '../../../models'
import { Access, CustomError, Users, userPresenter } from '../../../shared'

export async function findUser(id: string, access: Access): Promise<Partial<Users>> {
	try {
		if (!id) throw CustomError.badRequest('ID is required.')
		if (access.user.id !== id && !access.user?.super_admin) throw CustomError.forbidden('Unable to process request.')

		const user_exists = await UsersModel.findByPk(id, {
			attributes: { exclude: ['password'] },
		})
		if (!user_exists && access.user?.super_admin) {
			throw CustomError.badRequest(`User with ID '${id}' does not exist.`)
		} else if (!user_exists) {
			throw CustomError.badRequest('Unable to process request.')
		}

		if (access.user?.super_admin) {
			return user_exists.dataValues
		}
		return userPresenter(user_exists.dataValues)
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

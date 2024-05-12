import { UsersModel } from '../../../models'
import { CustomError, Users } from '../../../shared'

export async function findUserByEmail(email: string): Promise<Users | null> {
	try {
		const user_exists = await UsersModel.findOne({
			where: { email },
		})
		return user_exists ? user_exists.dataValues : null
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

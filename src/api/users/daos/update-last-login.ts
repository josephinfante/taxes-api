import { UsersModel } from '../../../models'
import { CustomError } from '../../../shared'

export async function updateUserLastLogin(id: string): Promise<void> {
	try {
		await UsersModel.update({ last_login_at: Date.now() }, { where: { id } })
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

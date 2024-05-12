import { UsersModel } from '../../../models'
import { CustomError, Validators, redis } from '../../../shared'

export async function resetUserEmail(data: { old_email: string; new_email: string; code: string }): Promise<string> {
	try {
		if (!data.old_email) throw CustomError.badRequest('El email antiguo es requerido.')
		if (!Validators.isEmail(data.old_email)) throw CustomError.badRequest('El email antiguo es inválido.')
		if (!data.new_email) throw CustomError.badRequest('El nuevo email es requerido.')
		if (!Validators.isEmail(data.new_email)) throw CustomError.badRequest('El email nuevo es inválido.')
		if (!data.code) throw CustomError.badRequest('El código es requerido.')

		const user_exists = await UsersModel.findOne({ where: { email: data.old_email } })

		if (!user_exists) throw CustomError.badRequest('No se puede procesar la solicitud.')
		const code = await redis.get(`email_reset_code:${user_exists.dataValues.id}`)
		if (!code) throw CustomError.badRequest('El código ha expirado. Solicita un nuevo código.')

		if (data.code !== code) throw CustomError.badRequest('No se puede procesar la solicitud.')

		await redis.del(`email_reset_code:${user_exists.dataValues.id}`)
		user_exists.set({
			email: data.new_email,
			updated_at: Date.now(),
		})
		await user_exists.save()

		return 'El email ha sido actualizado.'
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

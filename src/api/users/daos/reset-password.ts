import { FRONTEND_URL } from '../../../config'
import { UsersModel } from '../../../models'
import { Bycript, CustomError, Email, Generate, Validators, redis } from '../../../shared'

export async function resetUserPassword(data: { email: string; password: string; code: string }): Promise<string> {
	try {
		if (!data.email) throw CustomError.badRequest('El email es requerido.')
		if (!Validators.isEmail(data.email)) throw CustomError.badRequest('El email es inválido.')
		if (!data.password) throw CustomError.badRequest('La contraseña es requerida.')
		if (!data.code) throw CustomError.badRequest('El código es requerido.')

		const user_exists = await UsersModel.findOne({ where: { email: data.email } })

		if (!user_exists) throw CustomError.badRequest('No se puede procesar la solicitud.')
		if (user_exists.dataValues.authentication_type !== 'password')
			throw CustomError.badRequest('No se puede procesar la solicitud.')

		const code = await redis.get(`password_reset_code:${user_exists.dataValues.id}`)
		if (!code) {
			const new_code = Generate.code()
			await redis.set(`password_reset_code:${user_exists.dataValues.id}`, new_code, 'EX', 300)

			await Email.send({
				to: data.email,
				subject: 'Restaurar contraseña',
				html: `<p>Hola ${user_exists.dataValues.first_name},</p>
                    <p>Tu código para restablecer tu contraseña es: <a href="${FRONTEND_URL}/reset-password?email=${data.email}&code=${new_code}" target="_blank"><strong>${new_code}</strong></a></p>
                    <p>Usa este código para restablecer la contraseña de tu cuenta.</p>
                    <p>Saludos.</p>`,
			})

			throw CustomError.badRequest('El código ha expirado. Un nuevo código ha sido enviado a tu correo.')
		}

		if (data.code !== code) throw CustomError.badRequest('No se puede procesar la solicitud.')

		await redis.del(`password_reset_code:${user_exists.dataValues.id}`)
		const encrypted_password = await Bycript.encrypt(data.password)
		const date_now = Date.now()
		user_exists.set({
			password: encrypted_password,
			updated_at: date_now,
		})
		await user_exists.save()

		const temp_code = Generate.code()
		await redis.set(`password_reset_code:${user_exists.dataValues.id}`, temp_code, 'EX', 7 * 24 * 60 * 60)
		await Email.send({
			to: data.email,
			subject: 'Contraseña restablecida.',
			html: `<p>Hola ${user_exists.dataValues.first_name},</p>
                <p>Tu contraseña ha sido restablecida correctamente.</p>
                <p>Si no has realizado esta acción, usa este link para restablecer la contraseña. El link sera valido por 7 días.</p>
                <p>Tu link para restablecer es: <a href="${FRONTEND_URL}/reset-password?email=${data.email}&code=${temp_code}" target="_blank"><strong>Has clic aquí.</strong></a></p>
                <p>Saludos.</p>`,
		})

		return 'La contraseña ha sido restablecida correctamente.'
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

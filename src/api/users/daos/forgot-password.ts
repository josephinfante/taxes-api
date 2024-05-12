import { FRONTEND_URL } from '../../../config'
import { UsersModel } from '../../../models'
import { CustomError, Email, Generate, Validators, redis } from '../../../shared'

export async function forgotUserPassword(email: string): Promise<string> {
	try {
		if (!email) throw CustomError.badRequest('El email es requerido.')
		if (!Validators.isEmail(email)) throw CustomError.badRequest('El email es inválido.')

		const user_exists = await UsersModel.findOne({ where: { email } })

		if (!user_exists) throw CustomError.badRequest('No se puede procesar la solicitud.')
		if (user_exists.dataValues.authentication_type !== 'password')
			throw CustomError.badRequest('No se puede procesar la solicitud.')

		const code = Generate.code()
		await redis.set(`password_reset_code:${user_exists.dataValues.id}`, code, 'EX', 300)

		await Email.send({
			to: email,
			subject: 'Restaurar contraseña',
			html: `<p>Hola ${user_exists.dataValues.first_name},</p>
                <p>Tu código para restaurar tu contraseña es: <a href="${FRONTEND_URL}/reset-password?email=${email}&code=${code}" target="_blank"><strong>${code}</strong></a></p>
                <p>Usa este código para restablecer la contraseña de tu cuenta.</p>
                <p>Saludos.</p>`,
		})
		return 'El código para restablecer tu contraseña ha sido enviado. Revisa tu correo.'
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

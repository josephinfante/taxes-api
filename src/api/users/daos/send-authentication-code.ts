import { FRONTEND_URL } from '../../../config'
import { UsersModel } from '../../../models'
import { CustomError, Email, Generate, Validators, redis } from '../../../shared'

export async function sendUserAuthenticationCode(email: string): Promise<void> {
	try {
		if (!email) throw CustomError.badRequest('El email es requerido.')
		if (!Validators.isEmail(email)) throw CustomError.badRequest('El email es inválido.')

		const user_exists = await UsersModel.findOne({
			where: { email },
		})
		if (!user_exists) throw CustomError.badRequest('El email es inválido.')

		const code = Generate.code()
		await redis.set(`authentication_code:${user_exists.dataValues.id}`, code, 'EX', 300)

		await Email.send({
			to: email,
			subject: 'Código de autenticación',
			html: `<p>Hola ${user_exists.dataValues.first_name},</p>
                <p>Tu código de autenticación es: <a href="${FRONTEND_URL}?email=${user_exists.dataValues.email}&code=${code}" target="_blank"><strong>${code}</strong></a></p>
                <p>Usa este código para ingresar a tu cuenta.</p>
                <p>Saludos.</p>`,
		})
	} catch (error) {
		console.log(error)
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

import { UsersModel } from '../../../models'
import { Bycript, CustomError, Generate, Users, Validators } from '../../../shared'

export async function createUser(data: Users): Promise<Users> {
	try {
		if (!data.first_name) throw CustomError.badRequest('El nombre es requerido.')
		if (!data.last_name) throw CustomError.badRequest('El apellido es requerido.')
		if (!data.email) throw CustomError.badRequest('El email es requerido.')
		if (!Validators.isEmail(data.email)) throw CustomError.badRequest('El email es inválido.')
		if (data?.authentication_type != 'password' && data?.authentication_type != 'code')
			throw CustomError.badRequest('El tipo de autenticación es inválido.')
		if (data?.authentication_type == 'password' && !data?.password)
			throw CustomError.badRequest('La contraseña es requerida.')

		let password = null
		if (data?.password) {
			password = await Bycript.encrypt(data.password)
		}

		const date_now = Date.now()
		const [user, created] = await UsersModel.findOrCreate({
			where: { email: data.email },
			defaults: {
				id: Generate.id(),
				first_name: data.first_name,
				last_name: data.last_name,
				email: data.email,
				password: password || null,
				authentication_type: data.authentication_type,
				role: 'user',
				last_login_at: date_now,
				hidden: false,
				deleted: false,
				updated_at: date_now,
				created_at: date_now,
			},
		})

		if (!created) throw CustomError.badRequest('Registro fallido. No se pudo registrar al usuario.')

		return user.dataValues
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

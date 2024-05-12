import { Bycript, CustomError, JWT, Users, Validators, redis, userPresenter } from '../../../shared'
import { UsersDao } from '../user.dao'

export async function loginUser(data: {
	email: string
	authentication_type: string
	password?: string
	code?: string
}): Promise<{ user: Partial<Users>; token: string }> {
	try {
		if (!data.email) throw CustomError.badRequest('El email es requerido.')
		if (!Validators.isEmail(data.email)) throw CustomError.badRequest('El email es inválido.')

		const user = await UsersDao.findByEmail(data.email)
		if (!user) throw CustomError.badRequest('El email o contraseña son inválidos.')
		if (user.deleted) throw CustomError.badRequest('No se puede procesar la solicitud.')

		if (user.authentication_type === 'password') {
			if (!data.password) throw CustomError.badRequest('La contraseña es requerida.')

			if (data.password && user.password) {
				const is_valid_password = await Bycript.compare(data.password, user.password)
				if (!is_valid_password) throw CustomError.badRequest('El email o contraseña son inválidos.')
			}
		}

		if (user.authentication_type === 'code') {
			if (!data.code) throw CustomError.badRequest('El código es requerido.')

			const code = await redis.get(`authentication_code:${user.id}`)
			if (!code) {
				await UsersDao.sendAuthenticationCode(user.email)
				throw CustomError.badRequest('El código ha expirado. Otro código se ha generado, revisa tu correo.')
			}

			if (data.code && code !== data.code) throw CustomError.badRequest('No se puede procesar la solicitud.')

			if (data.code && code === data.code) await redis.del(`authentication_code:${user.id}`)
		}

		const token = await JWT.sign({ id: user.id })
		if (!token) throw CustomError.internal('Error al generar el token.')

		await UsersDao.updateLastLogin(user.id)

		return { user: userPresenter(user), token }
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

export async function loginAdmin(data: {
	email: string
	authentication_type: string
	password?: string
	code?: string
}): Promise<{ user: Partial<Users>; token: string }> {
	try {
		if (!data.email) throw CustomError.badRequest('Email is required.')
		if (!Validators.isEmail(data.email)) throw CustomError.badRequest('Invalid email.')

		const user = await UsersDao.findByEmail(data.email)
		if (!user) throw CustomError.badRequest('El email o contraseña son inválidos.')
		if (user.deleted) throw CustomError.badRequest('No se puede procesar la solicitud.')

		if (user.role !== 'super_admin') throw CustomError.forbidden('Access denied.')

		if (user.authentication_type === 'password') {
			if (!data.password) throw CustomError.badRequest('La contraseña es requerida.')

			if (data.password && user.password) {
				const is_valid_password = await Bycript.compare(data.password, user.password)
				if (!is_valid_password) throw CustomError.badRequest('El email o contraseña son inválidos.')
			}
		}

		if (user.authentication_type === 'code') {
			if (!data.code) throw CustomError.badRequest('El código es requerido.')

			const code = await redis.get(`authentication_code:${user.id}`)
			if (!code) {
				await UsersDao.sendAuthenticationCode(user.email)
				throw CustomError.badRequest('El código ha expirado. Otro código se ha generado, revisa tu correo.')
			}

			if (data.code && code !== data.code) throw CustomError.badRequest('No se puede procesar la solicitud.')

			if (data.code && code === data.code) await redis.del(`authentication_code:${user.id}`)
		}

		const token = await JWT.sign({ id: user.id })
		if (!token) throw CustomError.internal('Error al generar el token.')

		await UsersDao.updateLastLogin(user.id)

		return { user: userPresenter(user), token }
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

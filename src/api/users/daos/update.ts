import { FRONTEND_URL } from '../../../config'
import { UsersModel } from '../../../models'
import { Access, Bycript, CustomError, Email, Generate, Users, redis, userPresenter } from '../../../shared'

export async function updateUser(id: string, data: Users, access: Access): Promise<Partial<Users>> {
	try {
		if (!id) throw CustomError.badRequest('El ID es requerido.')
		if (access.user.id !== id && !access.user?.super_admin)
			throw CustomError.forbidden('No se puede procesar la solicitud.')

		const user_exists = await UsersModel.findByPk(id, {
			attributes: { exclude: ['password'] },
		})
		if (!user_exists && access.user?.super_admin) {
			throw CustomError.badRequest(`El usuario con ID '${id}' no existe.`)
		} else if (!user_exists) {
			throw CustomError.badRequest('No se puede procesar la solicitud.')
		}

		const has_changes = Object.keys(data).filter(
			(key) =>
				data[key] !== undefined &&
				key !== 'id' &&
				key !== 'password' &&
				key !== 'role' &&
				key !== 'last_login_at' &&
				key !== 'hidden' &&
				key !== 'deleted' &&
				key !== 'created_at' &&
				key !== 'updated_at',
		)

		if (has_changes.length === 0) throw CustomError.badRequest('Modifica al menos un campo.')

		if (data?.first_name && data?.first_name !== user_exists.dataValues.first_name) {
			user_exists.set('first_name', data.first_name)
		}

		if (data?.last_name && data?.last_name !== user_exists.dataValues.last_name) {
			user_exists.set('last_name', data.last_name)
		}

		if (data?.email && data?.email !== user_exists.dataValues.email) {
			const email_in_use = await UsersModel.findOne({ where: { email: data.email } })
			if (email_in_use) throw CustomError.badRequest('No se puede procesar la solicitud.')
			const temp_code = Generate.code()
			await redis.set(`email_reset_code:${user_exists.dataValues.id}`, temp_code, 'EX', 7 * 24 * 60 * 60)
			await Email.send({
				to: user_exists.dataValues.email,
				subject: 'Email actualizado',
				html: `<p>Hola ${user_exists.dataValues.first_name},</p>
					<p>Tu email ha sido actualizado correctamente.</p>
					<p>Si tu no has realizado este cambio, usa este código para restablecer tu email</p>
					<p>Tu link para restablecer es: <a href="${FRONTEND_URL}/reset-email?old_email=${user_exists.dataValues.email}&new_email=${data.email}&code=${temp_code}" target="_blank"><strong>Has clic aquí.</strong></a></p>
					<p>Saludos.</p>`,
			})
			user_exists.set('email', data.email)
		}

		if (data?.authentication_type) {
			if (data?.authentication_type !== 'password' && data?.authentication_type !== 'code')
				throw CustomError.badRequest('El tipo de autenticación es inválido.')
			if (data?.authentication_type !== user_exists.dataValues.authentication_type) {
				if (data.authentication_type === 'password' && !data.password)
					throw CustomError.badRequest('La contraseña es requerida.')
				if (data.authentication_type === 'password' && data.password) {
					const password = await Bycript.encrypt(data.password)
					user_exists.set('password', password)
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
				}
				user_exists.set('authentication_type', data.authentication_type)
			}
		}

		const date_now = Date.now()
		user_exists.set('updated_at', date_now)
		await user_exists.save()

		return userPresenter(user_exists.dataValues)
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

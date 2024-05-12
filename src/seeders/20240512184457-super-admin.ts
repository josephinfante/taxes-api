import { QueryInterface } from 'sequelize'
import { Generate } from '../shared'
import { SUPER_ADMIN_EMAIL } from '../config'

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		const transaction = await queryInterface.sequelize.transaction()
		try {
			const super_admin_exists = await queryInterface.rawSelect(
				'users',
				{
					where: { role: 'super_admin' },
				},
				['id'],
			)
			if (!super_admin_exists) {
				const super_admin = {
					id: Generate.id(),
					first_name: 'root',
					last_name: 'admin',
					email: SUPER_ADMIN_EMAIL,
					password: null,
					authentication_type: 'code',
					role: 'super_admin',
					last_login_at: Date.now(),
					hidden: false,
					deleted: false,
					created_at: Date.now(),
					updated_at: Date.now(),
				}
				await queryInterface.bulkInsert('users', [super_admin], {
					transaction,
				})
			}
			await transaction.commit()
		} catch (error) {
			await transaction.rollback()
			throw error
		}
	},
	down: async (queryInterface: QueryInterface): Promise<void> => {
		const transaction = await queryInterface.sequelize.transaction()
		try {
			await queryInterface.bulkDelete('users', { role: 'super_admin' }, { transaction })
			await transaction.commit()
		} catch (error) {
			await transaction.rollback()
			throw error
		}
	},
}

import { QueryInterface, DataTypes } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		const transaction = await queryInterface.sequelize.transaction()
		try {
			let tableExists
			try {
				tableExists = await queryInterface.describeTable('users')
			} catch (error) {
				tableExists = false
			}
			if (!tableExists) {
				await queryInterface.createTable(
					'users',
					{
						id: {
							type: DataTypes.STRING(44),
							allowNull: false,
							primaryKey: true,
						},
						first_name: {
							type: DataTypes.STRING(30),
							allowNull: false,
						},
						last_name: {
							type: DataTypes.STRING(30),
							allowNull: false,
						},
						email: {
							type: DataTypes.STRING(255),
							allowNull: false,
							unique: true,
						},
						password: {
							type: DataTypes.STRING(255),
							allowNull: true,
							defaultValue: () => null,
						},
						authentication_type: {
							type: DataTypes.STRING(20),
							allowNull: false,
							defaultValue: () => 'code',
						},
						role: {
							type: DataTypes.STRING(20),
							allowNull: true,
							defaultValue: () => 'user',
						},
						last_login_at: {
							type: DataTypes.BIGINT,
							allowNull: true,
							defaultValue: () => null,
						},
						hidden: {
							type: DataTypes.BOOLEAN,
							allowNull: false,
							defaultValue: () => 0,
						},
						deleted: {
							type: DataTypes.BOOLEAN,
							allowNull: false,
							defaultValue: () => 0,
						},
						updatedAt: {
							type: DataTypes.BIGINT,
							allowNull: false,
							defaultValue: () => Date.now(),
							field: 'updated_at',
						},
						createdAt: {
							type: DataTypes.BIGINT,
							allowNull: false,
							defaultValue: () => Date.now(),
							field: 'created_at',
						},
					},
					{ transaction },
				)
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
			await queryInterface.dropTable('users', { transaction })
			await transaction.commit()
		} catch (error) {
			await transaction.rollback()
			throw error
		}
	},
}

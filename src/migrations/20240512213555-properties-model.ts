import { QueryInterface, DataTypes } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		const transaction = await queryInterface.sequelize.transaction()
		try {
			let tableExists
			try {
				tableExists = await queryInterface.describeTable('properties')
			} catch (error) {
				tableExists = false
			}
			if (!tableExists) {
				await queryInterface.createTable(
					'properties',
					{
						id: {
							type: DataTypes.STRING(36),
							allowNull: false,
							primaryKey: true,
						},
						name: {
							type: DataTypes.STRING(255),
							allowNull: false,
						},
						address: {
							type: DataTypes.STRING(255),
							allowNull: false,
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
			await queryInterface.dropTable('properties', { transaction })
			await transaction.commit()
		} catch (error) {
			await transaction.rollback()
			throw error
		}
	},
}

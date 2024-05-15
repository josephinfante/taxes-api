import { QueryInterface, DataTypes } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		const transaction = await queryInterface.sequelize.transaction()
		try {
			let tableExists
			try {
				tableExists = await queryInterface.describeTable('taxes')
			} catch (error) {
				tableExists = false
			}
			if (!tableExists) {
				await queryInterface.createTable(
					'taxes',
					{
						id: {
							type: DataTypes.STRING(36),
							allowNull: false,
							primaryKey: true,
						},
						year: {
							type: DataTypes.INTEGER,
							allowNull: false,
						},
						total_paid_amount: {
							type: DataTypes.DECIMAL(10, 2),
							allowNull: true,
						},
						total_debt_amount: {
							type: DataTypes.DECIMAL(10, 2),
							allowNull: false,
						},
						status: {
							type: DataTypes.STRING(100),
							allowNull: false,
						},
						property_id: {
							type: DataTypes.STRING(36),
							allowNull: false,
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
			await queryInterface.dropTable('taxes', { transaction })
			await transaction.commit()
		} catch (error) {
			await transaction.rollback()
			throw error
		}
	},
}

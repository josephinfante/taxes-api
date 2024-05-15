import { QueryInterface, DataTypes } from 'sequelize'

module.exports = {
	up: async (queryInterface: QueryInterface): Promise<void> => {
		const transaction = await queryInterface.sequelize.transaction()
		try {
			let tableExists
			try {
				tableExists = await queryInterface.describeTable('payments')
			} catch (error) {
				tableExists = false
			}
			if (!tableExists) {
				await queryInterface.createTable(
					'payments',
					{
						id: {
							type: DataTypes.STRING(36),
							allowNull: false,
							primaryKey: true,
						},
						reason: {
							type: DataTypes.STRING(255),
							allowNull: false,
						},
						amount: {
							type: DataTypes.DECIMAL(10, 2),
							allowNull: false,
						},
						delay_amount: {
							type: DataTypes.DECIMAL(10, 2),
							allowNull: true,
						},
						fee_amount: {
							type: DataTypes.DECIMAL(10, 2),
							allowNull: true,
						},
						total_paid_amount: {
							type: DataTypes.DECIMAL(10, 2),
							allowNull: false,
						},
						status: {
							type: DataTypes.STRING(100),
							allowNull: false,
						},
						details: {
							type: DataTypes.TEXT,
							allowNull: true,
							defaultValue: () => null,
						},
						files: {
							type: DataTypes.TEXT,
							allowNull: true,
							defaultValue: () => null,
						},
						paid_at: {
							type: DataTypes.BIGINT,
							allowNull: false,
						},
						tax_id: {
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
			await queryInterface.dropTable('payments', { transaction })
			await transaction.commit()
		} catch (error) {
			await transaction.rollback()
			throw error
		}
	},
}

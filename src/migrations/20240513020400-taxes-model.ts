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
						debt_amount_value: {
							type: DataTypes.DECIMAL(10, 4),
							allowNull: false,
						},
						debt_amount_currency: {
							type: DataTypes.STRING(3),
							allowNull: false,
						},
						fee_amount_value: {
							type: DataTypes.DECIMAL(10, 4),
							allowNull: false,
						},
						fee_amount_currency: {
							type: DataTypes.STRING(3),
							allowNull: false,
						},
						total_amount_value: {
							type: DataTypes.DECIMAL(10, 4),
							allowNull: false,
						},
						total_amount_currency: {
							type: DataTypes.STRING(3),
							allowNull: false,
						},
						status: {
							type: DataTypes.STRING(100),
							allowNull: false,
						},
						files: {
							type: DataTypes.TEXT,
							allowNull: true,
							defaultValue: () => null,
						},
						paid_at: {
							type: DataTypes.BIGINT,
							allowNull: true,
							defaultValue: () => null,
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

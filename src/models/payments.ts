import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../shared'
import { TaxesModel } from './taxes'

export class PaymentsModel extends Model {}

PaymentsModel.init(
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
			references: {
				model: TaxesModel,
				key: 'id',
			},
		},
		updated_at: {
			type: DataTypes.BIGINT,
			allowNull: false,
			defaultValue: () => Date.now(),
		},
		created_at: {
			type: DataTypes.BIGINT,
			allowNull: false,
			defaultValue: () => Date.now(),
		},
	},
	{
		sequelize: sequelize,
		modelName: 'payments',
		updatedAt: 'updated_at',
		createdAt: 'created_at',
	},
)

PaymentsModel.belongsTo(TaxesModel, { foreignKey: 'tax_id', targetKey: 'id' })
TaxesModel.hasMany(PaymentsModel, { foreignKey: 'tax_id', sourceKey: 'id' })

import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../shared'
import { PropertiesModel } from './properties'

export class TaxesModel extends Model {}

TaxesModel.init(
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
			references: {
				model: PropertiesModel,
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
		modelName: 'taxes',
		updatedAt: 'updated_at',
		createdAt: 'created_at',
	},
)

TaxesModel.belongsTo(PropertiesModel, { foreignKey: 'property_id', targetKey: 'id' })
PropertiesModel.hasMany(TaxesModel, { foreignKey: 'property_id', sourceKey: 'id' })

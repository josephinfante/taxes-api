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

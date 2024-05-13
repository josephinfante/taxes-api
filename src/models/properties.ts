import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../shared'

export class PropertiesModel extends Model {}

PropertiesModel.init(
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
		modelName: 'properties',
		updatedAt: 'updated_at',
		createdAt: 'created_at',
	},
)

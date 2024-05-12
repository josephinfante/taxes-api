import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../shared'

export class UsersModel extends Model {}

UsersModel.init(
	{
		id: {
			type: DataTypes.STRING(36),
			allowNull: false,
			primaryKey: true,
		},
		first_name: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		last_name: {
			type: DataTypes.STRING(50),
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
			type: DataTypes.STRING(50),
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
		modelName: 'users',
		updatedAt: 'updated_at',
		createdAt: 'created_at',
	},
)

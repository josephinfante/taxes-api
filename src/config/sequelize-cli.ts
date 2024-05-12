import 'dotenv/config'

const sequelizeConfig = {
	development: {
		username: process.env.DB_USERNAME || '',
		password: process.env.DB_PASSWORD || '',
		database: process.env.DB_NAME || '',
		host: process.env.DB_HOST || '',
		port: parseInt(process.env.DB_PORT as any) || 5432,
		dialect: (process.env.DB_DIALECT as any) || 'postgres',
		seederStorage: 'sequelize',
	},
	test: {
		username: process.env.DB_USERNAME || 'root',
		password: process.env.DB_PASSWORD || '',
		database: process.env.DB_NAME || 'ecommerce',
		host: process.env.DB_HOST || 'localhost',
		port: parseInt(process.env.DB_PORT as any) || 5432,
		dialect: (process.env.DB_DIALECT as any) || 'postgres',
		seederStorage: 'sequelize',
	},
	production: {
		username: process.env.DB_USERNAME || 'root',
		password: process.env.DB_PASSWORD || '',
		database: process.env.DB_NAME || 'ecommerce',
		host: process.env.DB_HOST || 'localhost',
		port: parseInt(process.env.DB_PORT as any) || 5432,
		dialect: (process.env.DB_DIALECT as any) || 'postgres',
		seederStorage: 'sequelize',
	},
}
export default sequelizeConfig
module.exports = sequelizeConfig

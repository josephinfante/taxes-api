import 'dotenv/config'

// Server variables
export const NODE_ENV = process.env.NODE_ENV || 'development'
export const PORT = Number(process.env.PORT) || 3000
export const JWT_SECRET = process.env.JWT_SECRET || 'secret'
export const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || ''
export const SUPER_ADMIN_ID = process.env.SUPER_ADMIN_ID || ''
export const FRONTEND_URL = process.env.FRONTEND_URL || ''
export const BACKOFFICE_URL = process.env.BACKOFFICE_URL || ''

// Database variables
export const DB_NAME = process.env.DB_NAME || ''
export const DB_USERNAME = process.env.DB_USERNAME || ''
export const DB_PASSWORD = process.env.DB_PASSWORD || ''
export const DB_DIALECT =
	(process.env.DB_DIALECT as 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql') || 'postgres'
export const DB_HOST = process.env.DB_HOST || ''
export const DB_PORT = Number(process.env.DB_PORT) || 0

// Nodemailer
export const MAIL_USER = process.env.MAIL_USER || ''
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD || ''

// Status messages
export const STATUS_MESSAGES = {
	INITIATED: 'INITIATED',
	COMPLETED: 'COMPLETED',
	FAILED: 'FAILED',
	SUCCESS: 'SUCCESS',
	ERROR: 'ERROR',
	TERMINATED: 'TERMINATED',
}

// Action messages
export const ACTION_MESSAGES = {
	CREATE: 'CREATE',
	UPDATE: 'UPDATE',
	DELETE: 'DELETE',
	RESTORE: 'RESTORE',
	EXPORT_REVIEWS: 'EXPORT_REVIEWS',
}

// Redis
export const REDIS_HOST = process.env.REDIS_HOST || ''
export const REDIS_PORT = Number(process.env.REDIS_PORT) || 0
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD || ''
export const REDIS_USERNAME = process.env.REDIS_USERNAME || ''

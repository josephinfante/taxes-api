import { ParsedQs } from 'qs'
import { Access, FindAll, Users } from '../../shared'
import {
	createUser,
	deleteUser,
	findAllUsers,
	findUser,
	findUserByEmail,
	forgotUserPassword,
	loginAdmin,
	loginUser,
	resetUserEmail,
	resetUserPassword,
	sendUserAuthenticationCode,
	updateUser,
	updateUserLastLogin,
} from './daos'

export class UsersDao {
	static async create(data: Users): Promise<Users> {
		return await createUser(data)
	}
	static async update(id: string, data: Users, access: Access): Promise<Partial<Users>> {
		return await updateUser(id, data, access)
	}
	static async delete(id: string, query: ParsedQs, access: Access): Promise<string> {
		return await deleteUser(id, query, access)
	}
	static async find(id: string, access: Access): Promise<Partial<Users>> {
		return await findUser(id, access)
	}
	static async findAll(query: ParsedQs): Promise<FindAll> {
		return await findAllUsers(query)
	}
	static async findByEmail(email: string): Promise<Users | null> {
		return await findUserByEmail(email)
	}
	static async loginUser(data: {
		email: string
		authentication_type: string
		password?: string
		code?: string
	}): Promise<{ user: Partial<Users>; token: string }> {
		return await loginUser(data)
	}
	static async sendAuthenticationCode(email: string): Promise<void> {
		return await sendUserAuthenticationCode(email)
	}
	static async loginAdmin(data: {
		email: string
		authentication_type: string
		password?: string
		code?: string
	}): Promise<{ user: Partial<Users>; token: string }> {
		return await loginAdmin(data)
	}
	static async forgotPassword(email: string): Promise<string> {
		return await forgotUserPassword(email)
	}
	static async resetPassword(data: { email: string; password: string; code: string }): Promise<string> {
		return await resetUserPassword(data)
	}
	static async resetEmail(data: { old_email: string; new_email: string; code: string }): Promise<string> {
		return await resetUserEmail(data)
	}
	static async updateLastLogin(id: string): Promise<void> {
		return await updateUserLastLogin(id)
	}
}

import { Users } from '../classes/users'

interface UserPresenter {
	id: string
	first_name: string
	last_name: string
	email: string
	authentication_type: string
	is_verified: boolean
}

export function userPresenter(data: Users): UserPresenter {
	return {
		id: data.id,
		first_name: data.first_name,
		last_name: data.last_name,
		email: data.email,
		authentication_type: data.authentication_type,
		is_verified: data.is_verified,
	}
}

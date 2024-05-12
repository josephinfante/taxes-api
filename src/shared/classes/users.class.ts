export class Users {
	public id: string
	public first_name: string
	public last_name: string
	public company_name: string | null
	public email: string
	public password: string | null
	public authentication_type: string
	public role: string | null
	public last_login_at: number | null
	public hidden: boolean
	public deleted: boolean
	public updated_at: number
	public created_at: number;
	[key: string]: any
	constructor(data: Users) {
		this.id = data.id
		this.first_name = data.first_name
		this.last_name = data.last_name
		this.company_name = data.company_name
		this.email = data.email
		this.password = data.password
		this.authentication_type = data.authentication_type
		this.role = data.role
		this.last_login_at = data.last_login_at
		this.hidden = data.hidden
		this.deleted = data.deleted
		this.updated_at = data.updated_at
		this.created_at = data.created_at
	}
}

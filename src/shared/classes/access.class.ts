export class Access {
	constructor(
		public user: {
			id: string
			first_name: string
			last_name: string
			email: string
			role: string
			super_admin: boolean
		},
	) {}
}

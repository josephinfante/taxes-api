export class Properties {
	public id: string
	public name: string
	public address: string
	public hidden: boolean
	public deleted: boolean
	public updated_at: number
	public created_at: number;
	[key: string]: any
	constructor(data: Properties) {
		this.id = data.id
		this.name = data.name
		this.address = data.address
		this.hidden = data.hidden
		this.deleted = data.deleted
		this.updated_at = data.updated_at
		this.created_at = data.created_at
	}
}

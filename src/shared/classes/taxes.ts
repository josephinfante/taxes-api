export class Taxes {
	public id: string
	public year: number
	public total_paid_amount: number | null
	public total_debt_amount: number
	public status: string
	public property_id: string
	public updated_at: number
	public created_at: number;
	[key: string]: any
	constructor(data: Taxes) {
		this.id = data.id
		this.year = data.year
		;(this.total_paid_amount = data.total_paid_amount), (this.total_debt_amount = data.total_debt_amount)
		this.status = data.status
		this.property_id = data.property_id
		this.updated_at = data.updated_at
		this.created_at = data.created_at
	}
}

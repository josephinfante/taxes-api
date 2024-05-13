export class Taxes {
	public id: string
	public year: number
	public debt_amount_value: number
	public debt_amount_currency: string
	public fee_amount_value: number
	public fee_amount_currency: string
	public total_amount_value: number
	public total_amount_currency: string
	public status: string
	public files: string | null
	public paid_at: number | null
	public property_id: string
	public updated_at: number
	public created_at: number;
	[key: string]: any
	constructor(data: Taxes) {
		this.id = data.id
		this.year = data.year
		this.debt_amount_value = data.debt_amount_value
		this.debt_amount_currency = data.debt_amount_currency
		this.fee_amount_value = data.fee_amount_value
		this.fee_amount_currency = data.fee_amount_currency
		this.total_amount_value = data.total_amount_value
		this.total_amount_currency = data.total_amount_currency
		this.status = data.status
		this.files = data.files
		this.paid_at = data.paid_at
		this.property_id = data.property_id
		this.updated_at = data.updated_at
		this.created_at = data.created_at
	}
}

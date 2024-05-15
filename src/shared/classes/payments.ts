export class Payments {
	public id: string
	public reason: string
	public amount: number
	public delay_amount: number | null
	public fee_amount: number | null
	public total_paid_amount: number | null
	public status: string
	public details: string | null
	public paid_at: number
	public tax_id: string
	public updated_at: number
	public created_at: number;
	[key: string]: any
	constructor(data: Payments) {
		this.id = data.id
		this.reason = data.reason
		this.amount = data.amount
		this.delay_amount = data.delay_amount
		this.fee_amount = data.fee_amount
		this.total_paid_amount = data.total_paid_amount
		this.status = data.status
		this.details = data.details
		this.paid_at = data.paid_at
		this.tax_id = data.tax_id
		this.updated_at = data.updated_at
		this.created_at = data.created_at
	}
}

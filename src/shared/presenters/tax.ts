import { Taxes } from '../classes/taxes'

export function taxPresenter(data: Taxes): Taxes {
	return {
		id: data.id,
		year: Number(data.year),
		total_paid_amount: Number(data?.total_paid_amount || 0),
		total_debt_amount: Number(data.total_debt_amount),
		status: data.status,
		property_id: data.property_id,
		updated_at: Number(data.updated_at),
		created_at: Number(data.created_at),
	}
}

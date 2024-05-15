import { Payments } from '../classes/payments'

export function paymentPresenter(data: Payments): Payments {
	return {
		id: data.id,
		reason: data.reason,
		amount: Number(data.amount),
		delay_amount: Number(data?.delay_amount || 0),
		fee_amount: Number(data?.fee_amount || 0),
		total_paid_amount: Number(data?.total_paid_amount || 0),
		status: data?.status,
		details: data?.details || null,
		paid_at: Number(data.paid_at),
		tax_id: data.tax_id,
		updated_at: Number(data.updated_at),
		created_at: Number(data.created_at),
	}
}

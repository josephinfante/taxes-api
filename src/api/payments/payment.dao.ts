import { Payments } from '../../shared'
import { createPayment, deletePayment, findAllPaymentsByTaxId, updatePayment } from './daos'

export class PaymentsDao {
	static async create(tax_id: string, data: Partial<Payments>): Promise<Payments> {
		return await createPayment(tax_id, data)
	}
	static async update(id: string, data: Partial<Payments>): Promise<Payments> {
		return await updatePayment(id, data)
	}
	static async delete(id: string): Promise<string> {
		return await deletePayment(id)
	}
	static async findAllByTaxId(id: string): Promise<Payments[]> {
		return await findAllPaymentsByTaxId(id)
	}
}

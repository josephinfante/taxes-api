import { Taxes } from '../../shared'
import { createTax, findTax, updateTax, updateTaxTotalPaid } from './daos'

export class TaxesDao {
	static async create(data: Partial<Taxes>): Promise<Taxes> {
		return await createTax(data)
	}
	static async update(id: string, data: Partial<Taxes>): Promise<Taxes> {
		return await updateTax(id, data)
	}
	static async find(id: string): Promise<Taxes> {
		return await findTax(id)
	}
	static async updateTotalPaid(id: string): Promise<void> {
		return await updateTaxTotalPaid(id)
	}
}

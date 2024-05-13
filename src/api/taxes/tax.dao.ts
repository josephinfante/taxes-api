import { Taxes } from '../../shared'
import { createTax, updateTax } from './daos'

export class TaxesDao {
	static async create(data: Partial<Taxes>): Promise<Taxes> {
		return await createTax(data)
	}
	static async update(id: string, data: Partial<Taxes>): Promise<Taxes> {
		return await updateTax(id, data)
	}
}

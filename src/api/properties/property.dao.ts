import { ParsedQs } from 'qs'
import { FindAll, Properties } from '../../shared'
import { createProperty, deleteProperty, findAllProperties, findProperty, updateProperty } from './daos'

export class PropertiesDao {
	static async create(data: Partial<Properties>): Promise<Properties> {
		return await createProperty(data)
	}
	static async update(id: string, data: Partial<Properties>): Promise<Properties> {
		return await updateProperty(id, data)
	}
	static async delete(id: string): Promise<string> {
		return await deleteProperty(id)
	}
	static async find(id: string): Promise<Properties> {
		return await findProperty(id)
	}
	static async findAll(query: ParsedQs): Promise<FindAll> {
		return await findAllProperties(query)
	}
}

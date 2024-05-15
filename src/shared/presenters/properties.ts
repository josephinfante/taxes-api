import { Properties } from '../classes/properties'

export function propertyPresenter(data: Properties): Properties {
	return {
		id: data.id,
		name: data.name,
		address: data.address,
		hidden: data.hidden,
		deleted: data.deleted,
		updated_at: Number(data.updated_at),
		created_at: Number(data.created_at),
	}
}

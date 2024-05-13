import { ParsedQs } from 'qs'
import { CustomError, FindAll } from '../../../shared'
import { PropertiesModel } from '../../../models'
import { Op } from 'sequelize'

export async function findAllProperties(query: ParsedQs): Promise<FindAll> {
	try {
		const limit = query?.limit ? Number(query?.limit) : 100
		const offset = ((query?.page ? Number(query?.page) : 1) - 1) * (query?.limit ? Number(query?.limit) : 100)

		const { count, rows } = await PropertiesModel.findAndCountAll({
			where: {
				[Op.and]: [
					query?.property
						? {
								[Op.or]: [
									{ id: query.property },
									{ name: { [Op.iLike]: `%${query.property}%` } },
									{ address: { [Op.iLike]: `%${query.property}%` } },
								],
							}
						: {},
					query?.hidden ? { hidden: query.hidden == 'true' ? true : false } : {},
					query?.deleted ? { deleted: query.hidden == 'true' ? true : false } : {},
				],
			},
			order: [['created_at', 'DESC']],
			limit,
			offset,
		})

		return {
			data: rows?.map((property) => property.dataValues),
			total_count: count,
			total_pages: Math.ceil(count / limit),
			current_page: query?.page ? Number(query.page) : 1,
		}
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

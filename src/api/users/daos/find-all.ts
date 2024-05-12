import { ParsedQs } from 'qs'
import { Op } from 'sequelize'
import { CustomError, FindAll } from '../../../shared'
import { UsersModel } from '../../../models'

export async function findAllUsers(query: ParsedQs): Promise<FindAll> {
	try {
		const limit = query?.limit ? Number(query?.limit) : 100
		const offset = ((query?.page ? Number(query?.page) : 1) - 1) * (query?.limit ? Number(query?.limit) : 100)

		const { count, rows } = await UsersModel.findAndCountAll({
			where: {
				[Op.and]: [
					query?.user
						? {
								[Op.or]: [
									{ id: query.user },
									{ first_name: { [Op.iLike]: `%${query.user}%` } },
									{ last_name: { [Op.iLike]: `%${query.user}%` } },
									{ email: { [Op.iLike]: `%${query.user}%` } },
								],
							}
						: {},
					query?.role ? { role: query.role } : {},
					query?.authentication_type ? { authentication_type: query.authentication_type } : {},
					query?.hidden ? { hidden: false } : {},
					query?.deleted ? { deleted: true } : {},
				],
			},
			attributes: { exclude: ['password'] },
			order: [['created_at', 'DESC']],
			limit,
			offset,
		})

		return {
			data: rows?.map((user) => user.dataValues),
			total_count: count,
			total_pages: Math.ceil(count / limit),
			current_page: query?.page ? Number(query.page) : 1,
		}
	} catch (error) {
		if (error instanceof CustomError) throw error
		throw CustomError.internal()
	}
}

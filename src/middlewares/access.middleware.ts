import { NextFunction, Request, Response } from 'express'
import { UsersModel } from '../models'
import { JWT } from '../shared'
import { JWTVerifyResult } from 'jose'

export async function canAccess(req: Request, res: Response, next: NextFunction) {
	try {
		const cookies = req.headers['cookie']?.split(';').reduce((cookies: { [key: string]: string }, cookie) => {
			const [name, value] = cookie.trim().split('=')
			cookies[name] = value
			return cookies
		}, {})
		if (!cookies?.auth) return res.status(401).json({ error: 'Access denied. No authentication token provided.' })

		const { payload } = (await JWT.validate(cookies?.auth)) as JWTVerifyResult

		if (payload.exp && typeof payload.exp === 'number' && payload.exp < Date.now() / 1000) {
			return res.status(401).json({ error: 'Access denied. Token has expired.' })
		}

		const user = await UsersModel.findByPk(payload.id as string).then((user) => user?.dataValues)
		if (!user) return res.status(401).json({ error: 'Access denied. Unable to process request.' })

		res.locals.access = {
			user: {
				id: user.id,
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				role: user.role,
				super_admin: user.role == 'super_admin',
			},
		}
		next()
		return
	} catch (error) {
		return res.status(500).json({ error: 'Internal server error.' })
	}
}

export async function isSuperAdmin(_req: Request, res: Response, next: NextFunction) {
	const { access } = res.locals
	if (!access.user.super_admin) return res.status(403).json({ error: 'Access denied. Unable to process request.' })
	next()
	return
}

export class Validators {
	static get isEmail() {
		return (email: string) => {
			const emailRegex = /^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/
			return emailRegex.test(email)
		}
	}
	static get isNumber() {
		return (value: any) => {
			return typeof value === 'number' && !isNaN(value)
		}
	}
}

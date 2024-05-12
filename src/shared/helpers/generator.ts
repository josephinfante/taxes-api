import { randomBytes } from 'crypto'
import { Bycript } from './bycript'

export class Generate {
	private static readonly TIMESTAMP_BYTES = 8
	private static readonly RANDOM_BYTES = 8
	private static readonly COUNTER_BYTES = 4

	static id(): string {
		const timestamp = Math.floor(Date.now() / 1000) // Unix timestamp in seconds
		const timestampBuffer = Buffer.alloc(Generate.TIMESTAMP_BYTES)
		timestampBuffer.writeUInt32BE(timestamp, 0)

		const randomBuffer = randomBytes(Generate.RANDOM_BYTES)
		const counterBuffer = randomBytes(Generate.COUNTER_BYTES)

		const objectIdBuffer = Buffer.concat([timestampBuffer, randomBuffer, counterBuffer])

		// Set version (4 bits) and variant (2 bits)
		objectIdBuffer[6] = (objectIdBuffer[6] & 0x0f) | 0x40 // Version 4
		objectIdBuffer[8] = (objectIdBuffer[8] & 0x3f) | 0x80 // Variant

		// Convert the buffer to a hexadecimal string
		const objectIdHex = objectIdBuffer.toString('hex')

		// Insert hyphens at the specified positions
		const ID =
			objectIdHex.substring(0, 8) +
			'-' +
			objectIdHex.substring(8, 12) +
			'-' +
			objectIdHex.substring(12, 16) +
			'-' +
			objectIdHex.substring(23)

		return ID
	}

	private static randomElementFromArray(array: string): string {
		return array[Math.floor(Math.random() * array.length)]
	}
	static async password(length: number = 16): Promise<{ password: string; encrypted_password: string }> {
		const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
		const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
		const numbers = '0123456789'
		const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'

		let password = ''

		// Generate random characters for each part of the password
		password += Generate.randomElementFromArray(uppercaseChars)
		password += Generate.randomElementFromArray(lowercaseChars)
		password += Generate.randomElementFromArray(numbers)
		password += Generate.randomElementFromArray(specialChars)

		// Calculate the number of character sets needed to fill the remaining length
		const remainingLength = length - 4 // 4 characters are already selected
		const numSets = Math.ceil(remainingLength / 4)

		// Fill the remaining length with random characters from each character set
		for (let i = 0; i < numSets; i++) {
			password += Generate.randomElementFromArray(uppercaseChars)
			password += Generate.randomElementFromArray(lowercaseChars)
			password += Generate.randomElementFromArray(numbers)
			password += Generate.randomElementFromArray(specialChars)
		}

		// Shuffle the password
		password = password
			.split('')
			.sort(() => Math.random() - 0.5)
			.join('')

		// Trim the password to the desired length
		password = password.substring(0, length)

		const encrypted_password = await Bycript.encrypt(password)

		return { password, encrypted_password }
	}
	static code(length: number = 6): string {
		const chars = '0123456789'
		let code = ''
		for (let i = 0; i < length; i++) {
			code += chars.charAt(Math.floor(Math.random() * chars.length))
		}
		return code
	}
}

export function mapFields(data, fieldMap) {
	return Object.entries(data).reduce((acc, [key, value]) => {
		const mappedKey = fieldMap[key];

		if (mappedKey) {
			acc[mappedKey] = value;
		}

		return acc;
	}, {});
}

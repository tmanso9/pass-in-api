export const generateSlug = (title: string): string => {
	const slug = title
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s+]+/g, '-')
	return slug
}
import * as Icons from 'lucide-react'

const Icon = ({ name, ...props }) => {
	const IconComponent = Icons[name.trim()] || Icons["List"] // reverting back to default if broken
	return <IconComponent {...props} />
}

export default Icon
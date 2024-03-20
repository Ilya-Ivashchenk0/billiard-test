import './pocket.css'
import { pocketProps } from './types'

export const Pocket: React.FC<pocketProps> = (props) => {
	const { position, rotate } = props

	return (
		<div
			className='pocket'
			style={{
				top: `${position.top}`,
				right: `${position.right}`,
				bottom: `${position.bottom}`,
				left: `${position.left}`,
				transform: `translate(50%, 50%) rotate(${rotate}deg)`,
			}}
		></div>
	)
}

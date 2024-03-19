import { Field } from '../field'
import { Pocket } from '../pocket'
import './board.css'

export const Board: React.FC = () => {
  const pockets = [
    {
      position: {
        top: '-34px',
        left: '-37px'
      },
      rotate: -45
    },
    {
      position: {
        top: '-34px',
        right: '19px'
      },
      rotate: 45
    },
    {
      position: {
        top: 'calc(50% - 50px)',
        left: '-65px'
      },
      rotate: -90
    },
    {
      position: {
        top: 'calc(50% - 50px)',
        right: '-9px'
      },
      rotate: 90
    },
    {
      position: {
        bottom: '19px',
        left: '-37px'
      },
      rotate: -135
    },
    {
      position: {
        bottom: '19px',
        right: '19px'
      },
      rotate: 135
    }
  ]

  return (
    <div className='board'>
      {pockets && pockets.map((pocket, index) => (
        <Pocket
        key={index}
          position={pocket.position}
          rotate={pocket.rotate}
        />
      ))}
      <Field />
    </div>
  )
}
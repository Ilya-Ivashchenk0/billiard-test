import { scoreProps } from "./types";
import './score.css'

export const Score: React.FC<scoreProps> = ({ score }) => {
  return (
    <div className="score">
      <p className="score__title">Score: {score}</p>
      <p className="score__description">Для изменения цвета шара, нажмите по нему правой кнопкой мыши</p>
    </div>
  )
}
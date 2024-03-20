import { CanvasHTMLAttributes, DetailedHTMLProps } from "react"

export interface canvasProps extends DetailedHTMLProps<CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement> {
  canvasRef: React.RefObject<HTMLCanvasElement>
  handleMouseDown: (event: React.MouseEvent<HTMLCanvasElement>) => void
  handleRightClick: (event: React.MouseEvent<HTMLCanvasElement>) => void
}
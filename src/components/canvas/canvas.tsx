import { canvasProps } from "./types";
import './canvas.css'

export const Canvas: React.FC<canvasProps> = ({
  canvasRef,
  className,
  handleMouseDown,
  handleRightClick
}) => {
  return (
    <canvas
      ref={canvasRef}
      className={className}
      width={600}
      height={780}
      onMouseDown={handleMouseDown}
      onContextMenu={handleRightClick}
    ></canvas>
  );
};
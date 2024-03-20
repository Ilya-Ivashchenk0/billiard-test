import { colorMenuProps } from "./types";
import './color-menu.css'

export const ColorMenu: React.FC<colorMenuProps> = ({
  mouseX,
  mouseY,
  colorMenuVisible,
  handleColorSelection
}) => {
  if (!colorMenuVisible) return null;

  return (
    <div className="color-menu" style={{ top: mouseY, left: mouseX }}>
      <div className="color-menu__option" style={{ backgroundColor: 'red' }} onClick={() => handleColorSelection('red')}></div>
      <div className="color-menu__option" style={{ backgroundColor: 'white' }} onClick={() => handleColorSelection('white')}></div>
      <div className="color-menu__option" style={{ backgroundColor: 'black' }} onClick={() => handleColorSelection('black')}></div>
      <div className="color-menu__option" style={{ backgroundColor: 'yellow' }} onClick={() => handleColorSelection('yellow')}></div>
      <div className="color-menu__option" style={{ backgroundColor: 'brown' }} onClick={() => handleColorSelection('brown')}></div>
      <div className="color-menu__option" style={{ backgroundColor: 'violet' }} onClick={() => handleColorSelection('violet')}></div>
    </div>
  );
};
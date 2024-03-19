import { useEffect, useRef, useState } from 'react';
import './field.css';
import { Ball } from './types';

export const Field: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [balls, setBalls] = useState<Ball[]>([]);

  // Инициализация шаров при загрузке компонента
  useEffect(() => {
    const initialBalls: Ball[] = [];
    for (let i = 0; i < 20; i++) {
        initialBalls.push({
            x: Math.random() * (canvasRef.current!.width - 40) + 20, // Ограничиваем зону появления шаров по ширине холста
            y: Math.random() * (canvasRef.current!.height - 40) + 20, // Ограничиваем зону появления шаров по высоте холста
            radius: 20,
            color: getRandomColor(),
            vx: 0,
            vy: 0,
        });
    }
    setBalls(initialBalls);
  }, []);

  // Отрисовка шаров на холсте при изменении их состояния
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    redrawCanvas(context, canvas);
  }, [balls]);

  // Обновление состояния шаров и их позиций через определенные интервалы времени
  useEffect(() => {
    const interval = setInterval(() => {
      setBalls((prevBalls) => {
        let newBalls = prevBalls.map((ball) => {
          // Замедление скорости каждого шара из-за трения
          ball.vx *= 0.9985;
          ball.vy *= 0.9985;

          // Вычисление новых координат шара с учетом его скорости
          let newX = ball.x + ball.vx;
          let newY = ball.y + ball.vy;

          // Обработка столкновений с границами холста
          if (newX - ball.radius < 0 || newX + ball.radius > 600) {
            ball.vx *= -0.9; // Изменение направления движения при столкновении с горизонтальной границей
            newX = ball.x + ball.vx; // Обновление новой координаты X
          }
          if (newY - ball.radius < 0 || newY + ball.radius > 780) {
            ball.vy *= -0.9; // Изменение направления движения при столкновении с вертикальной границей
            newY = ball.y + ball.vy; // Обновление новой координаты Y
          }

          return { ...ball, x: newX, y: newY }; // Возврат обновленного объекта шара
        });

        // Обработка столкновений между парами шаров
        for (let i = 0; i < newBalls.length; i++) {
          for (let j = i + 1; j < newBalls.length; j++) {
            handleBallCollision(newBalls[i], newBalls[j]); // Обработка столкновения двух шаров
          }
        }

        return newBalls; // Возврат обновленного массива шаров
      });
    }, 20);

    // Остановка интервала при размонтировании компонента
    return () => clearInterval(interval);
  }, []);

  // Отрисовка всех шаров на холсте
  const redrawCanvas = (
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    context.clearRect(0, 0, canvas.width, canvas.height); // Очистка холста перед отрисовкой

    balls.forEach((ball) => {
      context.beginPath();
      context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      context.fillStyle = ball.color;
      context.fill();
      context.closePath();
    });
  };

  // Генерация случайного цвета для шара
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Обработчик нажатия мыши для изменения скорости шара
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const mouseX = event.nativeEvent.offsetX;
    const mouseY = event.nativeEvent.offsetY;

    // Обновление скорости шара при нажатии мыши в его области
    let newBalls = balls.map((ball) => {
      const dx = mouseX - ball.x;
      const dy = mouseY - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < ball.radius) {
        const angle = Math.atan2(dy, dx);
        const force = 10;
        const vx = Math.cos(angle) * force;
        const vy = Math.sin(angle) * force;
        return { ...ball, vx, vy }; // Возврат обновленного объекта шара с новыми скоростями
      }
      return ball; // Возврат исходного объекта шара без изменений
    });

    setBalls(newBalls); // Обновление состояния шаров
  };

  // Обработка столкновения двух шаров
  const handleBallCollision = (ballA: Ball, ballB: Ball) => {
    const dx = ballB.x - ballA.x; // Разница координат X между шарами
    const dy = ballB.y - ballA.y; // Разница координат Y между шарами
    const distance = Math.sqrt(dx * dx + dy * dy); // Расстояние между шарами

    // Если расстояние меньше суммы радиусов шаров (произошло столкновение)
    if (distance < ballA.radius + ballB.radius) {
        // Находим угол столкновения
        const collisionAngle = Math.atan2(dy, dx);

        // Проекции скоростей на ось столкновения
        const v1 = ballA.vx * Math.cos(collisionAngle) + ballA.vy * Math.sin(collisionAngle);
        const v2 = ballB.vx * Math.cos(collisionAngle) + ballB.vy * Math.sin(collisionAngle);

        // Новые скорости после столкновения по оси столкновения (используем одномерную формулу упругого соударения)
        const newV1 = ((ballA.radius - ballB.radius) * v1 + 2 * ballB.radius * v2) / (ballA.radius + ballB.radius);
        const newV2 = ((ballB.radius - ballA.radius) * v2 + 2 * ballA.radius * v1) / (ballA.radius + ballB.radius);

        // Возвращаем скорости на исходные координаты
        ballA.vx = newV1 * Math.cos(collisionAngle) - v1 * Math.sin(collisionAngle);
        ballA.vy = newV1 * Math.sin(collisionAngle) + v1 * Math.cos(collisionAngle);
        ballB.vx = newV2 * Math.cos(collisionAngle) - v2 * Math.sin(collisionAngle);
        ballB.vy = newV2 * Math.sin(collisionAngle) + v2 * Math.cos(collisionAngle);

        // Отталкивание шаров друг от друга, чтобы они не "склеивались"
        const overlap = (ballA.radius + ballB.radius) - distance;
        const overlapVector = { x: overlap * Math.cos(collisionAngle), y: overlap * Math.sin(collisionAngle) };
        const totalMass = ballA.radius + ballB.radius;
        const ratioA = ballA.radius / totalMass;
        const ratioB = ballB.radius / totalMass;
        ballA.x -= overlapVector.x * ratioA;
        ballA.y -= overlapVector.y * ratioA;
        ballB.x += overlapVector.x * ratioB;
        ballB.y += overlapVector.y * ratioB;
    }
};

  return (
    <div className="field">
      <canvas
        ref={canvasRef}
        className="field-canvas"
        width={600}
        height={780}
        onMouseDown={handleMouseDown}
      ></canvas>
    </div>
  );
};

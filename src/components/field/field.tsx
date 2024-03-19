import { useEffect, useRef, useState } from 'react';
import './field.css';
import { Ball } from './types';

export const Field: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [score, setScore] = useState<number>(0);

  // Инициализация шаров при загрузке компонента
  useEffect(() => {
    const initialBalls: Ball[] = [];
    for (let i = 0; i < 20; i++) {
        const radius = Math.random() * (30 - 10) + 10; // Генерация случайного радиуса в диапазоне от 10 до 30
        const mass = Math.PI * radius * radius; // Вычисление массы шара на основе его радиуса

        initialBalls.push({
            x: Math.random() * (canvasRef.current!.width - radius * 2) + radius, // Ограничиваем зону появления шаров по ширине холста
            y: Math.random() * (canvasRef.current!.height - radius * 2) + radius, // Ограничиваем зону появления шаров по высоте холста
            radius: radius,
            color: getRandomColor(),
            mass: mass, // Добавляем массу шара в объект
            vx: 0,
            vy: 0,
        });
    }
    setBalls(initialBalls);
  }, []);

  useEffect(() => {
    balls.forEach(ball => {
      if (isBallInPocket(ball)) {
        // Попал шар в лузу, выполняем нужные действия
        handleBallInPocket(ball);
      }
    });
  }, [balls]);

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
    }, 10);

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
    const dx = ballB.x - ballA.x;
    const dy = ballB.y - ballA.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ballA.radius + ballB.radius) {
        const collisionAngle = Math.atan2(dy, dx);

        // Вычисляем компоненты скоростей по направлению столкновения
        const v1x = ballA.vx * Math.cos(collisionAngle) + ballA.vy * Math.sin(collisionAngle);
        const v1y = ballA.vy * Math.cos(collisionAngle) - ballA.vx * Math.sin(collisionAngle);
        const v2x = ballB.vx * Math.cos(collisionAngle) + ballB.vy * Math.sin(collisionAngle);
        const v2y = ballB.vy * Math.cos(collisionAngle) - ballB.vx * Math.sin(collisionAngle);

        // Упругое столкновение с учетом массы
        const newV1x = ((ballA.mass - ballB.mass) * v1x + 2 * ballB.mass * v2x) / (ballA.mass + ballB.mass);
        const newV2x = ((ballB.mass - ballA.mass) * v2x + 2 * ballA.mass * v1x) / (ballA.mass + ballB.mass);

        // Преобразуем обратно в координаты X и Y
        const finalV1x = newV1x * Math.cos(collisionAngle) - v1y * Math.sin(collisionAngle);
        const finalV1y = newV1x * Math.sin(collisionAngle) + v1y * Math.cos(collisionAngle);
        const finalV2x = newV2x * Math.cos(collisionAngle) - v2y * Math.sin(collisionAngle);
        const finalV2y = newV2x * Math.sin(collisionAngle) + v2y * Math.cos(collisionAngle);

        // Устанавливаем новые скорости
        ballA.vx = finalV1x;
        ballA.vy = finalV1y;
        ballB.vx = finalV2x;
        ballB.vy = finalV2y;

        // Отталкивание шаров друг от друга, чтобы они не "склеивались"
        const overlap = (ballA.radius + ballB.radius) - distance;
        const overlapVector = { x: overlap * Math.cos(collisionAngle), y: overlap * Math.sin(collisionAngle) };
        const totalMass = ballA.mass + ballB.mass;
        const ratioA = ballA.mass / totalMass;
        const ratioB = ballB.mass / totalMass;
        ballA.x -= overlapVector.x * ratioA;
        ballA.y -= overlapVector.y * ratioA;
        ballB.x += overlapVector.x * ratioB;
        ballB.y += overlapVector.y * ratioB;
    }
  };

  const isBallInPocket = (ball: Ball) => {
    const pockets = [
      { x: 0, y: 0, width: 15, height: 15 }, // Левая верхняя луза /
      { x: 0, y: 760, width: 15, height: 15 }, // Левая нижняя луза /
      { x: 590, y: 20, width: 15, height: 15 }, // Правая верхняя луза /
      { x: 590, y: 760, width: 15, height: 15 }, // Правая нижняя луза /
      { x: 0, y: 390, width: 15, height: 15 }, // Луза в центре слева /
      { x: 590, y: 390, width: 15, height: 15 } // Луза в центре справа /
    ];

    for (const pocket of pockets) {
      if (
        ball.x + ball.radius >= pocket.x &&
        ball.x - ball.radius <= pocket.x + pocket.width &&
        ball.y + ball.radius >= pocket.y &&
        ball.y - ball.radius <= pocket.y + pocket.height
      ) {
        return true;
      }
    }

    return false;
  };

  const handleBallInPocket = (ball: Ball) => {
    // Увеличиваем счетчик на 1
    setScore(prevScore => prevScore + 1);

    // Удаляем шар из массива balls
    setBalls(prevBalls => prevBalls.filter(b => b !== ball));
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
      <div className="field-score">Score: {score}</div>
    </div>
  );
};

// Обработчики для рисования на канвасе
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;

const startDrawing = (event) => {
    drawing = true;
    const pos = getMousePosition(event);
    ctx.moveTo(pos.x, pos.y);
};

const stopDrawing = () => {
    drawing = false;
    ctx.beginPath(); // Переключаем на новый путь
};

const draw = (event) => {
    if (!drawing) return;
    const pos = getMousePosition(event);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
};

// Универсальная функция для получения позиции мыши или пальца
const getMousePosition = (event) => {
    let x, y;
    if (event.touches) {
        // Для сенсорных экранов
        const touch = event.touches[0];
        x = touch.clientX - canvas.offsetLeft;
        y = touch.clientY - canvas.offsetTop;
    } else {
        // Для мыши
        x = event.clientX - canvas.offsetLeft;
        y = event.clientY - canvas.offsetTop;
    }
    return { x, y };
};

// Обработчики для мобильных устройств и десктопов
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

// Функция для очистки канваса
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Функция для распознавания буквы
async function recognizeLetter() {
    // Создаем временный холст, на котором будет белый фон
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    // Устанавливаем размеры временного холста такие же, как у основного
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // Закрашиваем фон белым
    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Рисуем на временном холсте содержимое основного холста (с буквой)
    tempCtx.drawImage(canvas, 0, 0);

    // Получаем изображение из временного холста с белым фоном
    const image = tempCanvas.toDataURL('image/png');

    // Отправляем изображение на сервер
    const response = await fetch('https://cyryllicback.onrender.com/predict', {
        method: 'POST',
        body: JSON.stringify({ image }),
        headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();
    document.getElementById('result').innerText = "Распознанная буква: " + result.letter;
}

// Каждые 3 минуты (180000 миллисекунд) отправлять GET запрос на сервер
setInterval(() => {
    fetch('https://cyryllicback.onrender.com/', { method: 'GET' })
        .then(response => {
            if (response.ok) {
                console.log('Пинг успешен!');
            } else {
                console.log('Ошибка пинга!');
            }
        })
        .catch(error => {
            console.log('Ошибка при отправке пинга:', error);
        });
}, 1000 * 60 * 3); // 3 минуты

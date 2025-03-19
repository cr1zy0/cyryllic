// Обработчики для рисования на канвасе
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;

// Устанавливаем толщину линии
ctx.lineWidth = 10;

// Функция начала рисования
const startDrawing = (event) => {
    event.preventDefault(); // Предотвращаем скролл на мобильных устройствах
    drawing = true;
    const pos = getMousePosition(event);
    ctx.moveTo(pos.x, pos.y);
};

// Функция остановки рисования
const stopDrawing = (event) => {
    event.preventDefault();
    drawing = false;
    ctx.beginPath();
};

// Функция рисования
const draw = (event) => {
    event.preventDefault();
    if (!drawing) return;
    const pos = getMousePosition(event);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
};

// Универсальная функция для получения позиции мыши или пальца
const getMousePosition = (event) => {
    let x, y;
    if (event.touches) {
        const touch = event.touches[0];
        x = touch.clientX - canvas.offsetLeft;
        y = touch.clientY - canvas.offsetTop;
    } else {
        x = event.clientX - canvas.offsetLeft;
        y = event.clientY - canvas.offsetTop;
    }
    return { x, y };
};

// Обработчики для мыши
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Обработчики для сенсорных экранов
canvas.addEventListener('touchstart', startDrawing, { passive: false });
canvas.addEventListener('touchmove', draw, { passive: false });
canvas.addEventListener('touchend', stopDrawing, { passive: false });
canvas.addEventListener('touchcancel', stopDrawing, { passive: false });

// Функция для очистки канваса
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Функция для распознавания буквы
async function recognizeLetter() {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    tempCtx.fillStyle = "white";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);

    const image = tempCanvas.toDataURL('image/png');

    const response = await fetch('https://cyryllicback.onrender.com/predict', {
        method: 'POST',
        body: JSON.stringify({ image }),
        headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();
    document.getElementById('result').innerText = "Распознанная буква: " + result.letter;
}

// Пинг сервера каждые 3 минуты
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
}, 1000 * 60 * 3);

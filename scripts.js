// Обработчики для рисования на канвасе
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseleave', () => drawing = false);

canvas.addEventListener('mousemove', (event) => {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, 10, 10);
});

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

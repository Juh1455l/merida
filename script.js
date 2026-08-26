// Dados das frases nas zonas
const leftZone = document.getElementById('leftZone');
const rightZone = document.getElementById('rightZone');
const resetBtn = document.getElementById('resetBtn');
const phrases = document.querySelectorAll('.phrase');

let draggedElement = null;

// Eventos de drag para as frases
phrases.forEach(phrase => {
    phrase.addEventListener('dragstart', handleDragStart);
    phrase.addEventListener('dragend', handleDragEnd);
});

// Eventos de drop para as zonas
leftZone.addEventListener('dragover', handleDragOver);
leftZone.addEventListener('drop', (e) => handleDrop(e, 'left'));
leftZone.addEventListener('dragleave', handleDragLeave);

rightZone.addEventListener('dragover', handleDragOver);
rightZone.addEventListener('drop', (e) => handleDrop(e, 'right'));
rightZone.addEventListener('dragleave', handleDragLeave);

// Eventos de drag start
function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

// Eventos de drag end
function handleDragEnd(e) {
    this.classList.remove('dragging');
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drag-over');
    });
}

// Eventos de drag over
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
}

// Eventos de drag leave
function handleDragLeave(e) {
    if (e.target === this) {
        this.classList.remove('drag-over');
    }
}

// Eventos de drop
function handleDrop(e, side) {
    e.preventDefault();
    this.classList.remove('drag-over');

    if (draggedElement) {
        // Clone o elemento
        const clonedPhrase = draggedElement.cloneElement(true);
        clonedPhrase.classList.remove('dragging');
        
        // Adicione eventos de drag ao clone
        clonedPhrase.addEventListener('dragstart', handleDragStart);
        clonedPhrase.addEventListener('dragend', handleDragEnd);

        // Adicione um botão para remover
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✕';
        removeBtn.className = 'remove-btn';
        removeBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(255, 255, 255, 0.3);
            color: white;
            border: none;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            cursor: pointer;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        removeBtn.onclick = () => {
            clonedPhrase.remove();
            updateCounts();
        };

        clonedPhrase.style.position = 'relative';
        clonedPhrase.appendChild(removeBtn);

        // Adicione a frase clonada à zona apropriada
        this.appendChild(clonedPhrase);

        // Remover a frase original da área central se estiver vazia
        const phrasesContainer = document.querySelector('.phrases-container');
        if (draggedElement.parentElement === phrasesContainer) {
            draggedElement.remove();
        }

        updateCounts();
    }
}

// Função para atualizar contadores
function updateCounts() {
    const leftCount = leftZone.querySelectorAll('.phrase').length;
    const rightCount = rightZone.querySelectorAll('.phrase').length;

    document.getElementById('leftCount').textContent = leftCount;
    document.getElementById('rightCount').textContent = rightCount;
}

// Função de reset
resetBtn.addEventListener('click', () => {
    location.reload();
});

// Inicialize os contadores
updateCounts();

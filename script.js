let color = document.getElementById('color');
let createBtn = document.getElementById('createBtn');
let list = document.getElementById('list');

createBtn.addEventListener('click', () => {
    let newNote = document.createElement('div');
    newNote.classList.add('note');
    newNote.innerHTML = `
        <span class="close">X</span>
        <textarea name="note" placeholder="Write content..." rows="12" cols="30"></textarea>`;
    newNote.style.borderColor = color.value;
    list.appendChild(newNote);
    saveNotes();
});

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('close')) {
        event.target.parentNode.remove();
        saveNotes();
    }
});

// Handle Drag and Drop
let cursor = { x: null, y: null };
let note = { dom: null, x: null, y: null };

document.addEventListener('mousedown', (event) => {
    if (event.target.classList.contains('note')) {
        list.style.cursor = 'grabbing'; // Change cursor to grabbing when dragging starts
        cursor = {
            x: event.clientX,
            y: event.clientY
        };
        note = {
            dom: event.target,
            x: event.target.getBoundingClientRect().left,
            y: event.target.getBoundingClientRect().top
        };
    }
});

document.addEventListener('mousemove', (event) => {
    if (!note.dom) return;
    let currentCursor = {
        x: event.clientX,
        y: event.clientY
    };
    let distance = {
        x: currentCursor.x - cursor.x,
        y: currentCursor.y - cursor.y
    };
    note.dom.style.left = (note.x + distance.x) + 'px';
    note.dom.style.top = (note.y + distance.y) + 'px';
    
});

document.addEventListener('mouseup', () => {
    note.dom = null;
    list.style.cursor='default'
    saveNotes();
});

// Save notes to localStorage
function saveNotes() {
    let notes = [];
    document.querySelectorAll('.note').forEach(note => {
        notes.push({
            content: note.querySelector('textarea').value,
            color: note.style.borderColor,
            position: {
                top: note.style.top,
                left: note.style.left
            }
        });
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Load notes from localStorage
function loadNotes() {
    let notes = JSON.parse(localStorage.getItem('notes'));
    if (notes) {
        notes.forEach(noteData => {
            let newNote = document.createElement('div');
            newNote.classList.add('note');
            newNote.innerHTML = `
                <span class="close">X</span>
                <textarea name="note" placeholder="Write content..." rows="12" cols="30">${noteData.content}</textarea>`;
            newNote.style.borderColor = noteData.color;
            newNote.style.top = noteData.position.top;
            newNote.style.left = noteData.position.left;
            list.appendChild(newNote);
        });
    }
}

window.addEventListener('resize', adjustNotePositions);

function adjustNotePositions() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    document.querySelectorAll('.note').forEach(note => {
        let left = parseFloat(note.style.left);
        let top = parseFloat(note.style.top);

        if (left > screenWidth - note.offsetWidth) {
            note.style.left = (screenWidth - note.offsetWidth - 20) + 'px';
        }

        if (top > screenHeight - note.offsetHeight) {
            note.style.top = (screenHeight - note.offsetHeight - 20) + 'px';
        }
    });
}

loadNotes();

document.addEventListener('DOMContentLoaded', function () {
    let notes = []; 
    let selectedDateStr = ''; 
    
    function openTab(tabId) {
        const tabs = document.querySelectorAll('.file-folder-tab');
        const containers = document.querySelectorAll('.dropdown-container');

       
        tabs.forEach(tab => tab.classList.remove('active'));
        containers.forEach(container => container.style.display = 'none');

       
        document.querySelector(`[onclick="openTab('${tabId}')"]`).classList.add('active');
        document.getElementById(tabId).style.display = 'block';

        
        document.getElementById(tabId).scrollIntoView({ behavior: 'smooth', block: 'start' });

        
        localStorage.setItem('activeTab', tabId);

        
        if (tabId === 'calendar') {
            initCalendar();
        }

        
        if (tabId === 'notesView') {
            renderNotes();
        }
    }

    
    function initCalendar() {
        const calendarEl = document.getElementById('calendar-container');
        calendarEl.innerHTML = ''; 
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',  
            editable: true,               
            selectable: true,              
            events: [],                   
            dateClick: function(info) {    
                handleDateClick(info.dateStr);
            }
        });

        calendar.render();
    }

    
    function handleDateClick(dateStr) {
        openDateMemoModal(dateStr);
    }

   
    function openDateMemoModal(dateStr) {
        const modal = document.getElementById('dateMemoModal');
        modal.querySelector('#dateMemoDate').innerText = dateStr;
        modal.style.display = 'block';
    }

    
    function closeDateMemoModal() {
        const modal = document.getElementById('dateMemoModal');
        modal.style.display = 'none';
    }

    
    function saveDateMemo() {
        const dateStr = document.getElementById('dateMemoDate').innerText;
        const memoContent = document.getElementById('dateMemoContent').value.trim();

        if (memoContent.length > 150) {
            alert('Memo content must be 150 characters or less.');
            return;
        }

        const memoData = {
            date: dateStr,
            content: memoContent
        };

        console.log('Saving Date Memo:', memoData);

        closeDateMemoModal();
        alert('Date Memo saved successfully!');
    }

    
    document.getElementById('closeDateMemoModal').addEventListener('click', closeDateMemoModal);
    document.getElementById('saveDateMemo').addEventListener('click', saveDateMemo);

    
    function discardForm() {
        document.querySelectorAll('form').forEach(form => form.reset());  
        openTab('notesView'); 
    }

    
    function handleFormSubmit(event, category) {
        event.preventDefault();
        const title = document.getElementById(`${category}ListTitle`).value;
        const content = document.getElementById(`${category}Items`).value || document.getElementById(`${category}NoteContent`).value;
        const tags = []; 
        addNote(category, title, content, tags);
    }

    
    function addNote(category, title, content, tags = []) {
        const newNote = {
            id: Date.now(),
            category,
            title,
            content,
            tags,
            creationDate: new Date().toISOString(),
            lastModifiedDate: new Date().toISOString()
        };
        notes.push(newNote);
        saveNotes();
    }

    
    function saveNote() {
        const title = document.querySelector('#generalNoteTitle').value.trim();
        const content = document.querySelector('#generalNoteContent').value.trim();
        const selectedTag = document.querySelector('.color-tag.selected');
    
        const noteData = {
            title: title,
            content: content,
            tag: selectedTag ? selectedTag.classList[1] : null,
            timestamp: new Date().toISOString(),
        };
    
        fetch('http://localhost:3001/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Note saved successfully!');
                document.querySelector('form').reset();  
            } else {
                alert('Error saving note.');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function fetchNotes() {
        fetch('http://localhost:3001/notes')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Retrieved notes:', data.notes);
                    
                } else {
                    alert('Error retrieving notes.');
                }
            })
            .catch(error => console.error('Error:', error));
    }
    

    
    function loadNotes() {
        const savedNotes = localStorage.getItem('notes');
        if (savedNotes) {
            notes = JSON.parse(savedNotes);
        }
    }

    
    function renderNotes(view = 'all') {
        const notesContainer = document.getElementById('notesContainer');
        notesContainer.innerHTML = '';

        
        let filteredNotes = [...notes]; 

        if (view === 'keywords') {
            
        } else if (view === 'date') {
            filteredNotes.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
        } else if (view === 'tags') {
           
        }

       
        filteredNotes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.classList.add('note-card');
            noteCard.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <span>${note.tag}</span>
                <span>${new Date(note.timestamp).toLocaleString()}</span>
            `;
            notesContainer.appendChild(noteCard);
        });
    }
    
    
    function setView(view) {
        renderNotes(view);
    }

  
    function editNote(noteId) {
        const note = notes.find(n => n.id === noteId);
        if (note) {
            document.getElementById('noteContent').value = note.content;
            document.getElementById('noteModal').style.display = 'block';
            document.body.classList.add('blur-background');

            
            document.querySelector('.modal-footer .btn-primary').onclick = function () {
                note.content = document.getElementById('noteContent').value;
                note.lastModifiedDate = new Date().toISOString();
                saveNotes();
                renderNotes();
                closeModal();
            };
        }
    }

   
    function showNextInput(currentIndex, prefix = 'grocery') {
        const currentInput = document.getElementById(`${prefix}ItemText${currentIndex}`);
        const nextIndex = currentIndex + 1;
        let nextInputGroup = document.getElementById(`${prefix}ItemGroup${nextIndex}`);

        if (currentInput.value && !nextInputGroup) {
            const newInputGroup = document.createElement('div');
            newInputGroup.classList.add('input-group', 'mb-2');
            newInputGroup.id = `${prefix}ItemGroup${nextIndex}`;
            newInputGroup.innerHTML = `
                <div class="input-group-text">
                    <input type="checkbox" id="${prefix}Item${nextIndex}Checkbox" onchange="strikeThrough(this, '${prefix}ItemText${nextIndex}')">
                </div>
                <input type="text" class="form-control" id="${prefix}ItemText${nextIndex}" placeholder="Item ${nextIndex}" oninput="showNextInput(${nextIndex}, '${prefix}')">
            `;
            document.getElementById(`${prefix}Items`).appendChild(newInputGroup);
        }
    }

    
    function strikeThrough(checkbox, textId) {
        const textField = document.getElementById(textId);
        textField.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
    }

    
    function deleteNote(noteId) {
        notes = notes.filter(n => n.id !== noteId);
        saveNotes();
        renderNotes();
    }

    
    function closeModal() {
        document.getElementById('noteModal').style.display = 'none';
        document.body.classList.remove('blur-background');
    }

    
    function toggleCalendarOptions(category) {
        const calendarOptions = document.getElementById(`${category}CalendarOptions`);
        if (calendarOptions.style.display === 'none' || calendarOptions.style.display === '') {
            calendarOptions.style.display = 'block';
        } else {
            calendarOptions.style.display = 'none';
        }
    }


    function saveToCalendarAndOpen(category) {
        const dateInput = document.getElementById(`${category}ListDate`) || document.getElementById(`${category}NoteDate`);
        const date = dateInput.value;

        if (!date) {
            alert('Please select a date for the calendar.');
            return;
        }

        const title = document.getElementById(`${category}ListTitle`).value || document.getElementById(`${category}NoteTitle`).value;
        const content = document.getElementById(`${category}Items`).value || document.getElementById(`${category}NoteContent`).value;

        const eventData = {
            title: title,
            start: date,
            description: content
        };

        
        const calendar = new FullCalendar.Calendar(document.getElementById('calendar-container'));
        calendar.addEvent(eventData);

        alert('Note saved to calendar!');
        
        
        openTab('calendar');
        initCalendar();
    }

    
    loadNotes();

   
    function init() {
        
        document.querySelectorAll('.file-folder-tab').forEach(tab => {
            tab.addEventListener('click', function () {
                openTab(tab.getAttribute('onclick').match(/'(.*)'/)[1]);
            });
        });

        
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                saveNote();
            });
        });

        
        document.querySelectorAll('.btn-danger').forEach(button => {
            button.addEventListener('click', discardForm);
        });

        
        document.querySelectorAll('.save-to-calendar-btn').forEach(button => {
            const category = button.getAttribute('data-category');
            button.addEventListener('click', () => toggleCalendarOptions(category));
        });

        document.querySelectorAll('.confirm-save-to-calendar-btn').forEach(button => {
            const category = button.getAttribute('data-category');
            button.addEventListener('click', () => saveToCalendarAndOpen(category));
        });

        
        document.getElementById('noteModal').addEventListener('click', function (event) {
            if (event.target === this) {
                closeModal(false);
            }
        });

      
        initCalendar();
    }

    init();

  
    window.openTab = openTab;
    window.setView = setView;
    window.editNote = editNote;
    window.deleteNote = deleteNote;
    window.closeModal = closeModal;
    window.strikeThrough = strikeThrough;
    window.showNextInput = showNextInput;
    window.selectTag = selectTag;
    window.deleteMemo = deleteMemo;
    window.saveNote = saveNote;
    window.saveToCalendarAndOpen = saveToCalendarAndOpen;
    window.handleFormSubmit = handleFormSubmit;
    window.discardForm = discardForm;
    window.handleDateClick = handleDateClick;
    window.openDateMemoModal = openDateMemoModal;
    window.closeDateMemoModal = closeDateMemoModal;
    window.saveDateMemo = saveDateMemo;
});

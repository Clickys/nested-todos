/* eslint-disable object-curly-spacing */
/* eslint-disable no-debugger */
/* eslint-disable no-plusplus */
/*
 Check app.remove function for nestedTodos
 Check app.edit function for nestedTodos
*/
const app = {
    notes: [],
    generateUniqueID() {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return `_${ Math.random()
            .toString( 36 )
            .substr( 2, 9 ) }`;
    },

    addTodo( todoText , arrayToAdd = app.notes) {
        let newNoteObject = {
            todoText,
            id: this.generateUniqueID(),
            completed: false,
            nestedTodos: []
        };

        arrayToAdd.push( newNoteObject  );
        return newNoteObject;
    },

    editTodo( noteIDtoEdit, newTodoText ) {
        const noteToEdit = this.notes.find( note => note.id === noteIDtoEdit );
        noteToEdit.todoText = newTodoText;
    },

    toggleTodo( noteIDToToggle ) {
        this.notes.forEach( ( note ) => {
            if ( note.id === noteIDToToggle ) {
                note.completed = !note.completed;
            }
        } );
    },

    removeTodo(noteIDToDestroy, array = app.notes) {
        array.forEach( ( note, i ) => {
            if ( note.id === noteIDToDestroy ) {
               array.splice(i, 1);
            }
        } );
    },
    addNested(noteID, todoText) {
        let arrayToSearch = this.arrayToSearch(noteID);
        let noteObjectToAdd = arrayToSearch.find( (note) => {
            return note.id === noteID;
        } )
        app.addTodo(todoText, noteObjectToAdd.nestedTodos);
        return noteObjectToAdd.nestedTodos;
    },
    arrayToSearch(noteID, array = app.notes) {
        let returnedArray;
        // Base Case
        if (!array.length) {
            return;
        }
        // Recursive Case
        for (let i = 0; i < array.length; i++) {
            if (array[i].nestedTodos.length) {
                returnedArray = this.arrayToSearch(noteID, array[i].nestedTodos);
            }
            if (noteID === array[i].id) {
                return array;
            }
        }
        return returnedArray;
    }
};

const view = {
    render(newNoteObject) {
        let todos = app.notes;
        const userInput = document.querySelector('.add-todo').value.trim();
        let elementPosition = document.querySelector( '.note-list' );
        // let compiledTemplate = Handlebars.compile(noteTemplate);
        if (!todos.length) {
            elementPosition.innerHTML = '';
            return;
        }
        elementPosition.innerHTML += `<li class="entry" data-id=${newNoteObject.id} data-completed=${newNoteObject.completed}>
            <input class="toggle" type="checkbox">${newNoteObject.todoText}
            <input type="text" class="edit-note" value=${newNoteObject.todoText}>
            <input type="text" class="add-nested-note">
            <button class="destroy">Delete</button>
            <button class="add-nested-todo-btn">Add todo</button>
            <ul>
            </ul>
        </li>`
        // elementPosition.innerHTML = compiledTemplate(todos);
        document.querySelector('.add-todo').value = '';
        document.querySelector('.add-todo').focus();
    },
    renderNestedTodos(arrayToRender, whereToAdd) {
        let nestedTemplate = document.querySelector( '#nestedTemplate' ).innerHTML;
        let compiledTemplate = Handlebars.compile(nestedTemplate);
        let ulToAdd = whereToAdd.querySelector('ul');
        ulToAdd.innerHTML = compiledTemplate(arrayToRender);

    },
};
let noteTemplate = document.querySelector( '#entry-template' ).innerHTML;
const controller = {

    init() {
        document.querySelector( '.add-todo' ).addEventListener( 'keyup', ( e ) => {
            if ( e.keyCode === 13 ) {
                this.create( e );
            }
        } );
        document.querySelector('.note-list').addEventListener('change', (e) => {
            if(e.target.className === 'toggle') {
                this.toggle(e);
            }
        });
        document.querySelector('.note-list').addEventListener('click', (e) => {
            if(e.target.className === 'destroy') {
                this.destroy(e);
            }

        })
        document.querySelector('.note-list').addEventListener('dblclick', (e) => {
            if (e.target.className === 'entry') {
                this.editTodo(e);
            }
        })
        document.querySelector('.note-list').addEventListener('keyup', (e) => {
            if (e.target.classList[0] === 'edit-note') {
                this.updateNote(e);
            }
        })
        document.querySelector('.note-list').addEventListener('focusout', (e) => {
            if (e.target.classList[0] === 'edit-note') {
                document.querySelector('.edit-note').classList.remove('show-edit');
                document.querySelector('.edit-note').classList.add('hide-edit');
            }
        })
        document.querySelector('.note-list').addEventListener('click', (e) => {
            if (e.target.className === 'add-nested-todo-btn') {
                this.showNested(e);
            }
        })
        document.querySelector('.note-list').addEventListener('focusout', (e) => {
            if (e.target.classList[0] === 'add-nested-note') {
                this.hideNested(e);
            }
        })

        document.querySelector('.note-list').addEventListener('keyup', (e) => {

            if (e.target.classList[0] === 'add-nested-note') {
                this.addNested(e);
            }
        })
    },

    create( e ) {
        let todos = app.notes;
        const userInput = document.querySelector('.add-todo').value.trim();
        if (userInput === '') {
            return;
        }
        let newNoteObject = app.addTodo( userInput );
        view.render(newNoteObject);

    },

    toggle(e) {
        let parentElement = e.target.parentElement;
        let parentElementID = parentElement.dataset.id;
        let isCompleted = parentElement.dataset.completed;

        if (isCompleted === 'true' ) {
            e.target.parentElement.dataset.completed = 'false';
        } else {
            e.target.parentElement.dataset.completed = 'true';
        }
        app.toggleTodo(parentElementID);
    },

    destroy(e) {
        let arrayToDelete = app.arrayToSearch(e.target.parentElement.dataset.id);
        app.removeTodo(e.target.parentElement.dataset.id, arrayToDelete);
        let currentElement = e.target.parentElement;
        e.target.parentElement.parentElement.removeChild(currentElement)
    },

    editTodo(e) {
        document.querySelector('.edit-note').classList.add('show-edit');
        document.querySelector('.edit-note').classList.remove('hide-edit');
        let editNoteInput = document.querySelector('.show-edit');
        editNoteInput.focus();
    },

    updateNote(e) {
        let noteID = e.target.parentElement.dataset.id;
        if (e.keyCode === 13 && e.target.value) {
            app.editTodo(noteID, e.target.value);
            view.render();
            e.target.classList.toggle('show-nested');
        }
    },

    showNested(e) {
        let inputNested = e.target.parentElement.children[2];
        inputNested.value = '';
        inputNested.classList.toggle('show-nested');
        inputNested.focus();
    },

    hideNested(e) {
        let inputNested = e.target.parentElement.children[2];
        inputNested.value = '';
        inputNested.classList.remove('show-nested');

    },

    addNested(e) {
        let noteID = e.target.parentElement.dataset.id;
        let whereToAdd = e.target.parentElement;
        if (e.keyCode === 13 && e.target.value) {
            let userInput = e.target.value;
            let arrayToAddNested = app.addNested(noteID, userInput);
            view.renderNestedTodos(arrayToAddNested, whereToAdd, e.target.value);
            this.hideNested(e);
        }
    }
};

controller.init();

/* eslint-disable no-debugger */
/* eslint-disable no-plusplus */
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
};

const view = {
    render() {
        const ulElement = document.querySelector( '.list-notes' );
        const userInput = document.querySelector( '.add-todo' );
        ulElement.innerHTML = '';
        for ( let i = 0; i < app.notes.length; i++ ) {
            const liElement = document.createElement( 'li' );
            liElement.dataset.id = app.notes[ i ].id;
            liElement.innerHTML = '<i class="far fa-dot-circle dropdown-button fa-2x expand-btn"></i> ';
            liElement.innerHTML += app.notes[ i ].userInput;
            liElement.innerHTML += '<i class="fas fa-edit edit-btn fa-2x"></i>';
            liElement.innerHTML += '<i class="fas fa-trash delete-btn fa-2x"></i>';
            ulElement.appendChild( liElement );
        }
        userInput.value = '';
        userInput.focus();
    },
};
const controller = {
    addTodo( e ) {
        const userInput = document.querySelector( '.add-todo' ).value;
        if ( e.keyCode === 13 ) {
            if ( userInput.trim() === '' ) {
                return;
            }
            app.notes.push( {
                userInput,
                completed: false,
                id: app.generateUniqueID(),
            } );
            view.render();
        }
    },

    editTodo( e ) {
        const noteID = e.target.parentElement.dataset.id;
        const a = app.notes.filter( val => val.id === noteID );
        document.querySelector( '#editInput' ).style.display = 'block';
    },

    update() {
        console.log( 'update' );
    },
    setupEventListeners() {
        document.querySelector( '.add-todo' ).addEventListener( 'keyup', this.addTodo.bind( this ) );
        document.querySelector( '#editInput' ).addEventListener( 'focusout', this.update.bind( this ) );
        document.querySelector( 'ul' ).addEventListener( 'dblclick', ( e ) => {
            if ( e.target.closest( '.edit-btn' ) ) {
                this.editTodo( e );
            }
        } );
    },
};

controller.setupEventListeners();

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

    addNote( whereToAddNote, userNote ) {
        whereToAddNote.push( {
            userNote,
            id: this.generateUniqueID(),
            nestedNotes: [],
        } );
    },

    editNote( arrayToCheck, noteIdToEdit, newNote ) {
        for ( let i = 0; i < arrayToCheck.length; i++ ) {
            if ( arrayToCheck[ i ].nestedNotes.length ) {
                this.editNote( arrayToCheck[ i ].nestedNotes, noteIdToEdit, newNote );
            } else if ( arrayToCheck[ i ].id === noteIdToEdit ) {
                arrayToCheck[ i ].userNote = newNote;
                break;
            }
        }
    },

    deleteNote( arrayToCheck, noteIdToEdit ) {
        for ( let i = 0; i < arrayToCheck.length; i++ ) {
            if ( arrayToCheck[ i ].nestedNotes.length ) {
                this.deleteNote( arrayToCheck[ i ].nestedNotes, noteIdToEdit );
            } else if ( arrayToCheck[ i ].id === noteIdToEdit ) {
                arrayToCheck.splice( i, 1 );
                break;
            }
        }
    },
};
const ulFirstList = document.querySelector( '.list-notes' );
const view = {
    render( notesArray ) {
        ulFirstList.innerHTML = '';
        for ( let i = 0; i < notesArray.length; i++ ) {
            if ( notesArray[ i ].nestedNotes.length ) {
                const ulElement = document.createElement( 'ul' );
                render( notesArray[ i ] );
            } else {
                const liElement = document.createElement( 'li' );
                liElement.textContent = notesArray[ i ].userNote;
                liElement.dataset.id = notesArray[ i ].id;
                liElement.classList.add( 'list-item' );
                liElement.innerHTML += '<input  type="text" id="add-nested-note">';
                ulFirstList.appendChild( liElement );
            }
        }
    },
};

const controller = {
    init() {
        document.querySelector( '.add-todo' ).addEventListener( 'keyup', this.create.bind( this ) );
    },

    create( e ) {
        const userInput = e.target.value;

        if ( e.keyCode === 13 && userInput ) {
            app.addNote( app.notes, userInput );
            e.target.value = '';
            e.target.focus();
            view.render( app.notes );
        }
    },
};

controller.init();

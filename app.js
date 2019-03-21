/* eslint-disable object-curly-spacing */
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
    findNote( id ) {
        for ( let i = 0; i < this.notes.length; i++ ) {
            if ( this.notes[ i ].nestedNotes.length ) {
                this.findNote( this.notes[ i ].nestedNotes );
            } else if ( this.notes[ i ].id === id ) {
                return this.notes[ i ];
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
                this.render( notesArray[ i ] );
            } else {
                const liElement = document.createElement( 'li' );
                liElement.textContent = `${ notesArray[ i ].userNote }`;
                liElement.innerHTML += '<button class="delete-btn"></button>';
                liElement.innerHTML += '<button class="add-nested-note"></button>';
                liElement.dataset.id = notesArray[ i ].id;
                liElement.classList.add( 'list-item' );
                liElement.innerHTML += '<input  type="text" class="note-edit-input">';
                ulFirstList.appendChild( liElement );
            }
        }
    },
};

const controller = {
    init() {
        document.querySelector( '.add-todo' ).addEventListener( 'keyup', this.create.bind( this ) );
        document.querySelector( '.list-notes' ).addEventListener( 'dblclick', ( e ) => {
            if ( e.target.closest( '.list-item' ) ) {
                console.log( e.target.children );
                e.target.children[ 2 ].style.display = 'block';
                const oldValue = e.target.innerText;
                e.target.children[ 2 ].value = oldValue;
            }
        } );
        document.querySelector( '.list-notes' ).addEventListener( 'keyup', ( e ) => {
            if ( e.target.closest( '.note-edit-input' ) ) {
                if ( e.keyCode === 13 ) {
                    this.editNote( e );
                }
            }
        } );
        document.querySelector( '.list-notes' ).addEventListener( 'click', ( e ) => {
            if ( e.target.closest( '.delete-btn' ) ) {
                const parentID = e.target.parentElement.dataset.id;
                app.deleteNote( app.notes, parentID );
                view.render( app.notes );
            }
        } );

        document.querySelector( '.list-notes' ).addEventListener( 'keyup', ( e ) => {
            if ( e.target.closest( '.add-nested-note' ) ) {
                if ( e.keyCode === 13 ) {
                    this.addNestedNote( e );
                }
            }
        } );
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

    editNote( e ) {
        const listItemID = e.target.parentElement.dataset.id;
        const newValue = e.target.value;
        app.editNote( app.notes, listItemID, newValue );
        view.render( app.notes );
    },

};

controller.init();

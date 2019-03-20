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

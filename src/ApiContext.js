import React from 'react';

const ApiContext = React.createContext({
    notes:[],
    folders:[],
    addFolder: () => {},
    addNote: () => {},
    deleteNote: () => {},
    updateNote: () => {},
})

export default ApiContext;
import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ApiContext from '../ApiContext'
import config from '../config'
import './Note.css'

export default class Note extends React.Component {

    static defaultProps = {
        onDeleteNote: () => { },
    }

    static contextType = ApiContext;

    handleClickDelete = e => {
        e.preventDefault()
        const noteId = this.props.id

        fetch(`${config.API_ENDPOINT}/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            },
        })
            .then(res => {
                if (!res.ok)
                    return res.json().then(e => Promise.reject(e))
                // because api response is status(204).end() 
                // here is no content on promise success
                // so skip return of res.json()
                // otherwise app breaks with Uncaught (in promise) "SyntaxError: Unexpected end of JSON input"

            })
            .then(() => {
                this.context.deleteNote(noteId)
                // allow parent to perform extra behaviour
                this.props.onDeleteNote(noteId)
            })
            .catch(error => {
                console.error({ error })
            })
    }
    
    render() {
        const { name, id, modified } = this.props
        return (
            <div className='Note'>
                <h2 className='Note__title'>
                    <Link to={`/note/${id}`}>
                        {name}
                    </Link>
                </h2>
                <button
                    className='Note__delete'
                    type='button'
                    onClick={this.handleClickDelete}
                >
                    <FontAwesomeIcon icon='trash-alt' />
                    {' '}
                    remove
                </button>
                <div className='Note__dates'>
                    <div className='Note__dates-modified'>
                        Modified
                        {' '}
                        <span className='Date'>
                            {format(modified, 'Do MMM YYYY')}
                        </span>
                        {' '}
                        <Link to={`/edit/${id}`}>Edit Note</Link>
                    </div>
                </div>
            </div>
        )
    }
}
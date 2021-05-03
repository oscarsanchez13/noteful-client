import React, { Component } from 'react'
import PropTypes from 'prop-types';
import NotefulForm from '../NotefulForm/NotefulForm'
import ApiContext from '../ApiContext'
import config from '../config'
import './EditNote.css'

export default class EditNote extends Component {

    static defaultProps = {
        history: {
            push: () => { }
        },
        match: {
            params: {}
        }
    }

    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.object,
        }),
        history: PropTypes.shape({
            push: PropTypes.func,
        }).isRequired,
    };

    static contextType = ApiContext;

    state = {
        error: null,
        id: '',
        name: '',
        content: '',
        folderId: '',
    };

    componentDidMount() {
        // QUESTION: Why make another fetch call to get note object 
        // when it's already accessible in überstate/context? REFACTOR?
        const { noteId } = this.props.match.params;
        fetch(config.API_ENDPOINT + `/notes/${noteId}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(error => Promise.reject(error));
                }
                return res.json();
            })
            .then(resData => {
                this.setState({
                    id: resData.id,
                    name: resData.name,
                    content: resData.content,
                    folderId: resData.folderId,
                })
            })
            .catch(error => {
                console.error(error)
                this.setState({ error })
            })

    }

    handleChangeName = e => {
        this.setState({ name: e.target.value })
    }
    handleChangeContent = e => {
        this.setState({ content: e.target.value })
    }
    handleChangeFolderId = e => {
        this.setState({ folderId: e.target.value })
    }

    handleSubmit = e => {
        e.preventDefault()

        const { noteId } = this.props.match.params;
        const { id, name, folderId, content } = this.state;
        const newNote = { id, name, folderId, content, modified: new Date() };

        fetch(`${config.API_ENDPOINT}/notes/${noteId}`, {
            method: 'PATCH',
            body: JSON.stringify(newNote),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) 
                    return res.json().then(e => Promise.reject(e))
            })
            .then(() => {
                this.resetFields(newNote)
                this.context.updateNote(newNote)
                // this.props.history.push(`/folder/${newNote.folderId}`)
                this.props.history.push(`/note/${newNote.id}`)
            })
            .catch(error => {
                console.error({ error })
            })
    }

    resetFields = newFields => {
        this.setState({
            id: newFields.id || '',
            name: newFields.name || '',
            content: newFields.content || '',
            folderId: newFields.folderId || '',
        })
    }

    render() {
        const { folders = [] } = this.context;
        const { error, name, folderId, content } = this.state;
        return (
            <section className='EditNote'>
                <h2>Create a note</h2>
                
                <NotefulForm onSubmit={this.handleSubmit}>
                    <div className='EditNote__error' role='alert'>
                        {error && <p>{error.message}</p>}
                    </div>
                    <div className='field'>
                        <label htmlFor='note-name-input'>
                            Name
                        </label>
                        <input 
                            type='text' 
                            id='note-name-input' 
                            name='note-name' 
                            value={name}
                            onChange={this.handleChangeName}
                        />
                    </div>
                    <div className='field'>
                        <label htmlFor='note-content-input'>
                            Content
                        </label>
                        <textarea 
                            id='note-content-input' 
                            name='content' 
                            value={content}
                            onChange={this.handleChangeContent}
                        />
                    </div>
                    <div className='field'>
                        <label htmlFor='note-folder-select'>
                            Folder
                        </label>
                        <select 
                            id='note-folder-select' 
                            name='note-folder-id'
                            value={folderId}
                            onChange={this.handleChangeFolderId}
                        >
                            <option value={null}>...</option>
                            {folders.map(folder =>
                                <option key={folder.id} value={folder.id}>
                                    {folder.name}
                                </option>
                            )}
                        </select>
                    </div>
                    <div className='buttons'>
                        <button type='submit'>
                            Update note
                        </button>
                    </div>
                </NotefulForm>
            </section>
        )
    }
}
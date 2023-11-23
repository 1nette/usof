import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import querystring from 'query-string';

import '../styles/NewPost.css';

const EditUser = () => {
    const { token } = useParams();

    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        async function getUser() {
            const user = (await axios.get(`http://localhost:5000/api/users/update/${token}`)).data[0];
            setLogin(user.login);
            setEmail(user.email);
            setName(user.full_name);
        }
        getUser();
    }, [token])

    const newUserFunc = async event => {
        event.preventDefault();

        try {
            await axios.patch(`http://localhost:5000/api/users/update/${token}`, querystring.stringify({ login: login, email: email, full_name: name }));
            setError("Profile was updated")
        }
        catch (e) {
            setError(e.response.data)
        }
    }

    return (
        <div>
            <form className='new_post' onSubmit={newUserFunc}>

                <div className='new_post_title'>
                    <span className='new_post_span'>login: </span>
                    <input className='new_post_input' required type="text" placeholder='enter login...' value={login} onChange={e => setLogin(e.target.value)} />
                </div>
                <div className='new_post_title'>
                    <span className='new_post_span'>email: </span>
                    <input className='new_post_input' required type="text" placeholder='enter email...' value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className='new_post_title'>
                    <span className='new_post_span'>name: </span>
                    <input className='new_post_input' required type="text" placeholder='enter name...' value={name} onChange={e => setName(e.target.value)} />
                </div>

                <div className='auth_error'>{error}</div>

                <div className='aboba'><button className='auth_button'>Edit profile</button></div>

            </form>
        </div>
    )
}

export default EditUser;
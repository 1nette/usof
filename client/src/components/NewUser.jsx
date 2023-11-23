import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios'
import querystring from 'query-string';

import '../styles/NewPost.css';

const NewUser = () => {
    const { token } = useParams();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');

    const roles = [{
        value: 'admin',
        label: 'admin'
    }, {
        value: 'user',
        label: 'user'
    }]

    const newUserFunc = async event => {
        event.preventDefault();

        if (role === '') {
            setError("You must choose a role");
            return;
        }

        try {
            await axios.post(`http://localhost:5000/api/users/${token}`, querystring.stringify({ login: login, password: password, email: email, role: role }));
            setError("User was created")
        }
        catch (e) {
            setError(e.response.data)
        }
    }

    return (
        <div>
            <form className='new_post' onSubmit={newUserFunc}>

                <div className='new_post_title'>
                    <span className='new_post_span'>User login: </span>
                    <input className='new_post_input' required type="text" placeholder='enter login...' onChange={e => setLogin(e.target.value)} />
                </div>
                <div className='new_post_title'>
                    <span className='new_post_span'>User password: </span>
                    <input className='new_post_input' required type="text" placeholder='enter password...' onChange={e => setPassword(e.target.value)} />
                </div>
                <div className='new_post_title'>
                    <span className='new_post_span'>User email: </span>
                    <input className='new_post_input' required type="text" placeholder='enter email...' onChange={e => setEmail(e.target.value)} />
                </div>

                <div className='new_post_categories'>
                    <span className='new_post_span'>User role: </span>
                    <Select options={roles} onChange={(item) => setRole(item.value)} />
                </div>

                <div className='auth_error'>{error}</div>

                <div className='aboba'><button className='auth_button'>Create a user</button></div>

            </form>
        </div>
    )
}

export default NewUser;
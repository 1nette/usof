import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'
import querystring from 'query-string';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context'

import '../styles/auth.css';

const LogIn = ({ setCurrentSection }) => {
    const { setToken } = useContext(AuthContext);

    const [login, setLogin] = useState([]);
    const [email, setEmail] = useState([]);
    const [password, setPassword] = useState([]);
    const [error, setError] = useState('');

    let navigate = useNavigate();

    const loginFunc = async event => {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/api/auth/login`, querystring.stringify({ login: login, password: password, email: email }));

            setToken(response.data)
            localStorage.setItem('auth', response.data)

            navigate('/');
        }
        catch (e) {
            setError(e.response.data)
        }
    }

    useEffect(() => {
        setCurrentSection('aboba')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <form onSubmit={loginFunc} className='auth_page'>
                <span className='auth_pagetitle'>Log In</span>

                <div className='auth_login'>
                    <span className='auth_span'>Login</span>
                    <input className='auth_input' required type="text" placeholder='enter login...' onChange={e => setLogin(e.target.value)} />
                </div>
                <div className='auth_email'>
                    <span className='auth_span'>Email</span>
                    <input className='auth_input' required type="text" placeholder='enter email...' onChange={e => setEmail(e.target.value)} />
                </div>
                <div className='auth_pass'>
                    <span className='auth_span'>Password</span>
                    <input className='auth_input' required type="text" placeholder='enter password...' onChange={e => setPassword(e.target.value)} />
                </div>

                <div className='auth_error'>{error}</div>

                <div className='auth_link'><a href="/reset_password">Forget your password?</a></div>

                <div className='aboba'><button className='auth_button'>Log In</button></div>
            </form>
        </div>
    )
}

export default LogIn;
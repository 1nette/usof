import React, { useState, useEffect } from 'react';
import axios from 'axios'
import querystring from 'query-string';

import '../styles/auth.css';

const SignUp = ({ setCurrentSection }) => {
    const [login, setLogin] = useState([]);
    const [email, setEmail] = useState([]);
    const [password, setPassword] = useState([]);
    const [passwordRep, setPasswordRep] = useState([]);
    const [error, setError] = useState('');

    const signupFunc = async event => {
        event.preventDefault();
        if (password === passwordRep) {
            try {
                await axios.post(`http://localhost:5000/api/auth/register`, querystring.stringify({ login: login, password: password, email: email }));
                setError("Account created")
            }
            catch (e) {
                setError(e.response.data)
            }
        }
        else {
            setError("Passwords don't match")
        }
    }

    useEffect(() => {
        setCurrentSection('aboba')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <form onSubmit={signupFunc} className='auth_page'>
                <span className='auth_pagetitle'>Sign Up</span>

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
                <div className='auth_passrep'>
                    <span className='auth_span'>Repeat password</span>
                    <input className='auth_input' required type="text" placeholder='repeat password...' onChange={e => setPasswordRep(e.target.value)} />
                </div>

                <div className='auth_error'>{error}</div>

                <div className='aboba'><button className='auth_button'>Sign Up</button></div>
            </form>
        </div>
    )
}

export default SignUp;
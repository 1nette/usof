import React, { useState } from 'react';
import axios from 'axios'
import querystring from 'query-string';

const ResetPass = () => {
    const [email, setEmail] = useState([]);
    const [error, setError] = useState('');

    const resetPass = async event => {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/api/auth/password-reset/`, querystring.stringify({ email: email }));
            setError(response.data)
        }
        catch (e) {
            setError(e.response.data)
        }
    }

    return (
        <div>
            <form onSubmit={resetPass} className='auth_page'>
                <span className='auth_pagetitle'>Reset Password</span>

                <div className='auth_email'>
                    <span className='auth_span'>Enter your email:</span>
                    <input className='auth_input' required type="text" placeholder='enter email...' onChange={e => setEmail(e.target.value)} />
                </div>

                <div className='auth_error'>{error}</div>

                <div className='aboba'><button className='auth_button'>Reset password</button></div>
            </form>
        </div>
    )
}

export default ResetPass;
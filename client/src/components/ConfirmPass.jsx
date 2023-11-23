import React, { useState } from 'react';
import axios from 'axios'
import { useParams } from 'react-router-dom';
import querystring from 'query-string';

const ConfirmPass = () => {
    const [password, setPassword] = useState([]);
    const [passwordRep, setPasswordRep] = useState([]);
    const [error, setError] = useState('');

    const { token } = useParams();

    const confirmPass = async event => {
        event.preventDefault();
        if (password === passwordRep) {
            try {
                const response = await axios.post(`http://localhost:5000/api/auth/password-reset/${token}`, querystring.stringify({ newPass: password }));
                setError(response.data)
            }
            catch (e) {
                setError(e.response.data)
            }
        }
        else {
            setError("Passwords don't match")
        }
    }

    return (
        <div>
            <form onSubmit={confirmPass} className='auth_page'>
                <span className='auth_pagetitle'>Reset Password</span>

                <div className='auth_pass'>
                    <span className='auth_span'>Password</span>
                    <input className='auth_input' required type="text" placeholder='enter password...' onChange={e => setPassword(e.target.value)} />
                </div>
                <div className='auth_passrep'>
                    <span className='auth_span'>Repeat password</span>
                    <input className='auth_input' required type="text" placeholder='repeat password...' onChange={e => setPasswordRep(e.target.value)} />
                </div>

                <div className='auth_error'>{error}</div>

                <div className='aboba'><button className='auth_button'>Reset password</button></div>
            </form>
        </div>
    )
}

export default ConfirmPass;
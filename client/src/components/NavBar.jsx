import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context'
import axios from 'axios'

const NavBar = ({ id, avatar, currentSection, setCurrentSection, login }) => {
    let navigate = useNavigate();

    const { token, setToken } = useContext(AuthContext);

    async function logout() {
        await axios.post(`http://localhost:5000/api/auth/logout/${token}`);
        setToken(':token');
        localStorage.removeItem('auth');
    }

    return (
        <div className='nav_bar'>
            <div className='nav_menu'>
                <span onClick={() => { navigate('/'); setCurrentSection('Posts') }} className={currentSection === 'Posts' ? 'nav_menu_current' : 'nav_menu_span'}><p>Posts</p></span>
                <span onClick={() => { navigate('/users'); setCurrentSection('Users') }} className={currentSection === 'Users' ? 'nav_menu_current' : 'nav_menu_span'}><p>Users</p></span>
            </div>

            <div className='nav_info'>
                <span className='nav_login'><p>{login}</p></span>
                <img src={avatar} alt="avatar" className="avatar" onClick={() => { navigate(`/users/${id}`); setCurrentSection('Profile') }}></img>

                {token === ':token' ?
                    <div className='nav_dropdown'>
                        <a href='/signup' className='linkHuina'><p>Sign Up</p></a>
                        <a href='/login' className='linkHuina'><p>Log In</p></a>
                    </div>
                    :
                    <div className='nav_dropdown'>
                        {// eslint-disable-next-line
                            <a onClick={logout} className='linkHuina'><p>Logout</p></a>}
                    </div>
                }

            </div>
        </div>
    )
}

export default NavBar;
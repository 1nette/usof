import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'
import UserItem from './UserItem';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context'

import '../styles/UsersPage.css';

const UserList = ({ setCurrentSection }) => {
    const { token } = useContext(AuthContext);
    let navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [select, setSelect] = useState('login');
    const [isAdmin, setIsAdmin] = useState('false');

    const filteredUsers = users.filter((el) => {
        if (search === '') {
            return el;
        }
        else {
            if (select === 'login')
                return el.login.toLowerCase().includes(search.toLowerCase())
            else
                return el.full_name.toLowerCase().includes(search.toLowerCase())
        }
    })

    useEffect(() => {
        async function getUsers() {
            const response = await axios.get(`http://localhost:5000/api/users`);
            setUsers(response.data);
        }
        getUsers();
        setCurrentSection('Users');

        async function getUserInfo() {
            const response = await axios.get(`http://localhost:5000/api/users/get/is/admin/${token}`);
            setIsAdmin(response.data);
        }
        getUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    if (users.length !== 0) {
        return (
            <div className='aboba'>
                <div className='aboba1'>
                    <input className='users_page_input' type="text" placeholder='search users...' value={search} onChange={e => setSearch(e.target.value)} />
                    <select className='users_page_select' value={select} onChange={e => setSelect(e.target.value)}>
                        <option value="login">by login</option>
                        <option value="name">by name</option>
                    </select>
                </div>

                <div className='users_page'>
                    <div className='user_container'>
                        {filteredUsers.map(user =>
                            <UserItem user={user} key={user.id} />
                        )}
                    </div>
                </div>

                {isAdmin
                    ? <button className='new_post_button' onClick={() => { navigate(`/users/new/${token}`) }}>+</button>
                    : ''
                }
            </div>
        )
    }
    else {
        return (
            <div className='users_loading'>Users data loading...</div>
        )
    }
}

export default UserList;
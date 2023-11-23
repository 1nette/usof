import React from 'react';
import { useNavigate } from 'react-router-dom';

import avatar from '../img/avatars/lufy.jpg'

const UserItem = ({ user }) => {
    let navigate = useNavigate();

    return (
        <div className='user' onClick={() => { navigate(`/users/${user.id}`) }}>
            <img src={avatar} className='user_avatar' alt='avatar'></img>
            <div className='user_info'>
                <span className='user_name'>{user.full_name}</span>
                <span className='user_login'>{user.login}</span>
                <span className='user_rating'>rating: {user.rating}</span>
            </div>
        </div>
    )
}

export default UserItem;
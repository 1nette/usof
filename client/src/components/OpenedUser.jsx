import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Pages from './Pages';
import PostItem from './PostItem';
import axios from 'axios'
import { AuthContext } from '../context'
import { useNavigate } from 'react-router-dom';

import edit from '../img/default/edit.png'
import trash from '../img/default/trash.png'

import avatar from '../img/avatars/lufy.jpg'

const OpenedUser = ({ setCurrentSection }) => {
    const { token } = useContext(AuthContext);
    let navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState([]);
    const { id } = useParams();
    const [user, setUser] = useState([]);
    const [role, setRole] = useState('');
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState([0]);

    useEffect(() => {
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        async function fetchData() {
            const userResponse = await axios.get(`http://localhost:5000/api/users/${id}`);
            setUser(userResponse.data);

            const postsResponse = await axios.get(`http://localhost:5000/api/posts/by/author/${id}/${token}`);
            setPosts(postsResponse.data);

            const currentUserResponse = await axios.get(`http://localhost:5000/api/users/get/current/${token}`);
            setCurrentUser(currentUserResponse.data);
        }

        fetchData();
        //--------------------------------------------------
        // async function getUser() {
        //     setUser((await axios.get(`http://localhost:5000/api/users/${id}`)).data);
        // }
        // async function getPosts() {
        //     setPosts((await axios.get(`http://localhost:5000/api/posts/by/author/${id}/${token}`).data));
        // }
        // async function getCurrentUser() {
        //     setCurrentUser((await axios.get(`http://localhost:5000/api/users/get/current/${token}`).data));
        // }
        // getUser();
        // getPosts();
        // getCurrentUser();
        // setCurrentSection('Users');
        //--------------------------------------------------
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        setRole(getRoleById(user.role_id));
    }, [id, token, user.role_id, setCurrentSection]);

    const getRoleById = (roleId) => {
        switch (roleId) {
            case 1:
                return 'user';
            case 2:
                return 'admin';
            default:
                return 'none';
        }
    };
    //--------------------------------------------------
    //     if (user.role_id === 1)
    //         setRole('user');
    //     else if (user.role_id === 2)
    //         setRole('admin');
    //     else
    //         setRole('none');
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [token, user])
    //--------------------------------------------------

    async function DeleteUser() {
        await axios.delete(`http://localhost:5000/api/users/delete/${id}/${token}`);
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        console.log("User deleted")
        //--------------------------------------------------
        // console.log("aboba")
        //--------------------------------------------------
    }

    return (
        <div>
            <div className='opened_user'>
                <div className='opened_user_upperinfo'>
                    <div className='abobishe'>
                        <img src={avatar} className='opened_user_avatar' alt='avatar'>

                        </img>
                        <div className='opened_user_name'>
                            <span className='opened_user_fullname'>{user.full_name}</span>
                            <span className='opened_user_login'>{user.login}</span>
                        </div>
                    </div>
                    <div>
                        {// eslint-disable-next-line
                            currentUser.id == id
                                ? <img className='edit_img' src={edit} alt="edit" onClick={() => { navigate(`/users/edit/${token}`) }} />
                                : ''
                        }
                        {// eslint-disable-next-line
                            currentUser.role_id === 2 || currentUser.id == id
                                ? <img className='trash_img' src={trash} alt="trash" onClick={DeleteUser} />
                                : ''
                        }
                    </div>
                </div>
                <div className='opened_user_lowerinfo'>
                    <span className='opened_user_rating'>rating: {user.rating}</span>
                    <span className='opened_user_role'>role: {role}</span>
                </div>
            </div>
            <div className='opened_user_posts'>
                <div className='page_content'>
                    {posts.slice(page * 5, page * 5 + 5).map(post =>
                        <PostItem post={post} key={post.id} />
                    )}
                </div>
                <Pages quantity={posts.length} numberForPage={5} current={page} change={setPage} />
            </div>
        </div>
    )
}

export default OpenedUser;
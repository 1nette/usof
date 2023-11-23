import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import querystring from 'query-string';
import { useNavigate } from 'react-router-dom';
import CommentsList from './CommentsList';
import NewComment from './NewComment';
import { AuthContext } from '../context'

import '../styles/OpenedPost.css';
import like from '../img/default/like.png'
import likeClicked from '../img/default/likeClicked.png'
import dislike from '../img/default/dislike.png'
import dislikeClicked from '../img/default/dislikeClicked.png'
import comments from '../img/default/comments.png'
import block from '../img/default/block.png'
import ok from '../img/default/checked.png'
import trash from '../img/default/trash.png'
import edit from '../img/default/edit.png'

import avatar from '../img/avatars/lufy.jpg'

const OpenedPost = () => {
    let navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState({
        isAuthor: false,
        isAdmin: false
    });

    const { id } = useParams();
    const [post, setPost] = useState([]);
    const [rating, setRating] = useState({ likes: 0, dislikes: 0, yourLike: 0, yourDislike: 0 });
    const [userRating, setUserRating] = useState({ rating: 0 });
    const [commentsArray, setCommentsArray] = useState([]);
    const [categories, setCategories] = useState([]);

    // init
    async function getRating() {
        const response = await axios.get(`http://localhost:5000/api/posts/${id}/likes/${token}`);
        setRating(response.data);
    }

    async function getUserRating() {
        if (post.length !== 0) {
            const response = await axios.get(`http://localhost:5000/api/users/get/rating/${post.author_id}`);
            setUserRating(response.data);
        }
    }

    async function getComments() {
        const response = await axios.get(`http://localhost:5000/api/posts/get/comments/${id}`);
        setCommentsArray(response.data);
    }

    async function getCategories() {
        const response = await axios.get(`http://localhost:5000/api/posts/get/categories/${id}`);
        setCategories(response.data);
    }

    async function getUserInfo() {
        const response = await axios.get(`http://localhost:5000/api/posts/get/user/info/${token}/${id}`);
        setUserInfo(response.data);
    }

    useEffect(() => {
        async function getPost() {
            const response = await axios.get(`http://localhost:5000/api/posts/${id}/:token`);
            setPost(response.data[0]);
        }
        getPost();
        getUserInfo();
        getRating();
        getComments();
        getCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, userInfo])
    // init

    async function hitLike() {
        await axios.post(`http://localhost:5000/api/posts/${id}/like/${token}`, querystring.stringify({ isLike: 1 }));
        getRating();
    }

    async function hitDislike() {
        await axios.post(`http://localhost:5000/api/posts/${id}/like/${token}`, querystring.stringify({ isLike: 0 }));
        getRating();
    }

    async function DeletePost() {
        await axios.delete(`http://localhost:5000/api/posts/${id}/${token}`);
        navigate('/');
    }

    async function BanPost() {
        await axios.patch(`http://localhost:5000/api/posts/${id}/ban/${token}`);
    }

    function OpenEdit() {
        navigate(`/post/edit/${id}`);
    }

    return (
        <div className='post_page'>
            <div className='post_opened'>
                <div className='post_opened_title'>
                    {post.title}
                </div>

                <div className='post_opened_categories'>
                    {categories.map((c, index) =>
                        <div key={index} className='post_opened_category'>
                            <span>{c.title}</span>
                        </div>
                    )}
                </div>

                <div className='post_opened_content'>
                    {post.content}
                </div>

                <div className='post_opened_info'>
                    <div className='post_opened_user' onMouseEnter={getUserRating}>
                        <img src={avatar} className="post_opened_avatar" alt='avatar'></img>

                        <span>{post.full_name}</span>
                        <div className='popup_rating'>
                            <div>
                                {post.login}
                            </div>
                            <div>
                                rating: {userRating.rating}
                            </div>
                        </div>
                    </div>
                    <div className='post_opened_date'>{post.length === 0 ? "aboba" : post.publish_date.slice(0, 10)}</div>
                </div>

                <div className='post_opened_likesandcomments'>
                    <div className='post_opened_likes'>
                        <img src={rating.yourLike === 0 ? like : likeClicked} onClick={hitLike} alt='like' className='like'></img>
                        <span className='like_text'>{rating.likes}</span>
                        <span className='dislike_text'>{rating.dislikes}</span>
                        <img src={rating.yourDislike === 0 ? dislike : dislikeClicked} onClick={hitDislike} alt='dislike'></img>
                    </div>
                    <div className='post_opened_blockanddelete'>
                        {userInfo.isAuthor
                            ? <img src={edit} alt="edit" onClick={OpenEdit} />
                            : ''
                        }
                        {userInfo.isAuthor
                            ? <img src={trash} alt="trash" onClick={DeletePost} />
                            : ''
                        }
                        {userInfo.isAdmin
                            ? <img src={post.is_active === 1 ? block : ok} alt="block" onClick={BanPost} />
                            : ''
                        }
                    </div>
                    <div className='post_opened_comments'>
                        <span>{commentsArray.length}</span>
                        <img src={comments} alt="comments"></img>
                    </div>
                </div>
            </div>

            {token !== ':token'
                ? <NewComment postId={id} token={token} />
                : ''
            }

            <div className='comments_container'>
                <div className='comments_title'>
                    <span>Comments</span>
                </div>

                <CommentsList commentsArray={commentsArray} token={token} />
            </div>
        </div>
    )
}

export default OpenedPost;
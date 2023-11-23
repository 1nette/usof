import React, { useState, useEffect } from 'react';
import axios from 'axios'
import querystring from 'query-string';

import likeImg from '../img/default/like.png'
import likeClickedImg from '../img/default/likeClicked.png'
import dislikeImg from '../img/default/dislike.png'
import dislikeClickedImg from '../img/default/dislikeClicked.png'
import trash from '../img/default/trash.png'

import avatar from '../img/avatars/lufy.jpg'

const CommentsItem = ({ comment, token }) => {
    const [rating, setRating] = useState({ likes: 0, dislikes: 0, yourLike: 0, yourDislike: 0 });
    const [userInfo, setUserInfo] = useState({
        isAuthor: false,
        isAdmin: false
    });

    // init
    async function getRating() {
        const response = await axios.get(`http://localhost:5000/api/comments/${comment.id}/like/${token}`);
        setRating(response.data);
    }

    useEffect(() => {
        async function getUserInfo() {
            const response = await axios.get(`http://localhost:5000/api/comments/get/user/info/${token}/${comment.id}`);
            setUserInfo(response.data);
        }
        getRating();
        getUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])
    // init

    async function hitLike() {
        await axios.post(`http://localhost:5000/api/comments/${comment.id}/like/${token}`, querystring.stringify({ isLike: 1 }));
        getRating();
    }

    async function hitDislike() {
        await axios.post(`http://localhost:5000/api/comments/${comment.id}/like/${token}`, querystring.stringify({ isLike: 0 }));
        getRating();
    }

    async function DeleteComment() {
        await axios.delete(`http://localhost:5000/api/comments/${comment.id}/${token}`);
    }

    return (
        <div className='comment'>
            <div className='comment_author_name'>
                <img src={avatar} className='comment_avatar' alt='avatar'></img>
                <span>{comment.full_name}</span>
                <div className='comment_popup'>
                    {comment.login}
                </div>
            </div>
            <div className='comment_content'>
                {comment.content}
            </div>
            <div className='abobaaaboba'>
                <div className='comment_rating'>
                    <img src={rating.yourLike === 0 ? likeImg : likeClickedImg} onClick={hitLike} alt='like' />
                    <span className='comment_like_text'>{rating.likes}</span>
                    <span className='comment_dislike_text'>{rating.dislikes}</span>
                    <img src={rating.yourDislike === 0 ? dislikeImg : dislikeClickedImg} onClick={hitDislike} alt='dislike' />
                </div>
                <div className='comment_editdelete'>
                    {userInfo.isAuthor || userInfo.isAdmin
                        ? <img src={trash} alt="trash" onClick={DeleteComment} />
                        : ''
                    }
                </div>
            </div>

        </div>
    )
}

export default CommentsItem;
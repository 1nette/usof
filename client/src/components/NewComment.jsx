import React, { useState } from 'react';
import axios from 'axios'
import querystring from 'query-string';

const NewComment = ({ postId, token }) => {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    async function PostComment() {
        if (content === '') {
            setError('Comment is empty');
            return
        }

        try {
            await axios.post(`http://localhost:5000/api/posts/${postId}/comments/${token}`, querystring.stringify({ content: content }));
        }
        catch (e) {
            setError(e.response.data)
        }
    }

    return (
        <div className='comments_container'>
            <div className='new_comment'>
                <span>New comment:</span>
                <textarea type="text" rows={5} placeholder='enter your opinion...' onChange={e => setContent(e.target.value)} />
                <div className='auth_error'>{error}</div>
                <button className='auth_button' onClick={PostComment}>Post</button>
            </div>
        </div>
    )
}

export default NewComment;
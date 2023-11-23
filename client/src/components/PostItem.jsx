import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const PostItem = ({ post }) => {
    const [categories, setCategories] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        async function getCategories() {
            const response = await axios.get(`http://localhost:5000/api/posts/get/categories/${post.id}`);
            setCategories(response.data);
        }
        getCategories()
    }, [])

    const content = post.content.length > 150 ? post.content.slice(0, 150) + '...' : post.content
    return (
        <div className='post' onClick={() => { navigate(`/post/${post.id}`) }}>
            <div className={post.is_active === 0 ? 'post_title_banned' : 'post_title'}>
                <p>{post.title}</p>
            </div>
            <div className='categories'>
                {categories.map((c, index) =>
                    <div key={index} className='category'>
                        <span>{c.title}</span>
                    </div>
                )}
            </div>
            <div className='post_content'>
                <p>{content}</p>
            </div>
            <div className='post_info'>
                <div className='post_author'>
                    <p>{post.full_name}</p>
                </div>
                <div className='post_date'>
                    <p>{post.publish_date.slice(0, 10)}</p>
                </div>
            </div>
        </div>
    )
}

export default PostItem;
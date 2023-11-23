import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import axios from 'axios'
import querystring from 'query-string';
import { AuthContext } from '../context'

import '../styles/NewPost.css';

const NewPost = () => {
    const { token } = useContext(AuthContext);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoriesArray] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [error, setError] = useState('');

    const newPostFunc = async event => {
        event.preventDefault();

        if (selectedCategories.length === 0 || selectedCategories.length > 3) {
            setError("Categories count should be from 1 to 3");
            return;
        }

        let categories = '';
        selectedCategories.forEach(selectedCategory => {
            categories += selectedCategory.value + ',';
        });
        categories = categories.slice(0, categories.length - 1);

        try {
            await axios.post(`http://localhost:5000/api/posts/${token}`, querystring.stringify({ title: title, content: content, categories: categories }));
            setError("Post was created")
        }
        catch (e) {
            setError(e.response.data)
        }
    }

    useEffect(() => {
        async function getCategories() {
            const categories = (await axios.get(`http://localhost:5000/api/all/categories`)).data;

            categories.forEach(category => {
                categoriesArray.push({
                    value: category.title,
                    label: category.title
                })
            });
        }
        getCategories()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className='new_post_page'>
            <form className='new_post' onSubmit={newPostFunc}>

                <div className='new_post_title'>
                    <span className='new_post_span'>Post title: </span>
                    <input className='new_post_input' required type="text" placeholder='enter title...' onChange={e => setTitle(e.target.value)} />
                </div>

                <div className='new_post_categories'>
                    <span className='new_post_span'>Post categories: </span>
                    <Select isMulti options={categoriesArray} onChange={(item) => setSelectedCategories(item)} />
                </div>

                <div className='new_post_content'>
                    <span className='new_post_span'>Post content: </span>
                    <textarea className='new_post_input' required type="text" placeholder='enter content...' rows={15} onChange={e => setContent(e.target.value)} />
                </div>

                <div className='auth_error'>{error}</div>

                <div className='aboba'><button className='auth_button'>Create a post</button></div>

            </form>
        </div>
    )
}

export default NewPost;
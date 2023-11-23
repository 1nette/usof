import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'
import Pages from './Pages';
import PostItem from './PostItem';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context'

const PostList = ({ posts }) => {
    const { token } = useContext(AuthContext);
    let navigate = useNavigate();

    const [page, setPage] = useState([0]);
    const [categories, setCategories] = useState([]);
    const [selectCategory, setSelectCategory] = useState('all');
    const [sort, setSort] = useState('date');

    const filteredPosts = posts.filter((el) => {
        if (selectCategory === 'all') {
            return el;
        }
        else {
            return el.categories.toLowerCase().includes(selectCategory.toLowerCase())
        }
    })
    const sortedPosts = sort === 'date' ? filteredPosts : [...filteredPosts].sort((a, b) => b.likes - a.likes);

    useEffect(() => {
        async function getCategories() {
            const response = await axios.get(`http://localhost:5000/api/all/categories`);
            setCategories(response.data);
        }
        getCategories()
    }, [])

    if (posts.length !== 0) {
        return (
            <div>
                <div className='posts_filter'>
                    <div>
                        <span>Search by category:</span>
                        <select className='posts_select' value={selectCategory} onChange={e => setSelectCategory(e.target.value)}>
                            <option value="all">all</option>
                            {categories.map((c, index) =>
                                <option value={c.title} key={index}>{c.title}</option>
                            )}
                        </select>
                    </div>
                    <div>
                        <span>Sort by:</span>
                        <select className='posts_select' value={sort} onChange={e => setSort(e.target.value)}>
                            <option value="date">date</option>
                            <option value="rating">rating</option>
                        </select>
                    </div>
                </div>
                <div className='page_content'>
                    {sortedPosts.slice(page * 10, page * 10 + 10).map(post =>
                        <PostItem post={post} key={post.id} />
                    )}
                </div>
                <Pages quantity={sortedPosts.length} numberForPage={10} current={page} change={setPage} />

                {token === ':token'
                    ? ''
                    : <button className='new_post_button' onClick={() => { navigate(`/post/new/${token}`) }}>+</button>
                }
            </div>
        )
    }
    else {
        return (
            <div className='found_none'>No posts found</div>
        )
    }
}

export default PostList;
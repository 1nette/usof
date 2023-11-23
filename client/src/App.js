import React, { useState, useEffect } from 'react';
import PostList from './components/PostList';
import OpenedPost from './components/OpenedPost';
import NewPost from './components/NewPost';
import NewUser from './components/NewUser';
import EditUser from './components/EditUser';
import EditPost from './components/EditPost';
import NavBar from './components/NavBar';
import UserList from './components/UserList';
import OpenedUser from './components/OpenedUser';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import ResetPass from './components/ResetPass';
import ConfirmPass from './components/ConfirmPass';
import axios from 'axios'
import { AuthContext } from './context'

import './styles/style.css';
import avatar from './img/avatars/lufy.jpg'

const { BrowserRouter, Routes, Route } = require('react-router-dom');

function App() {
  const [token, setToken] = useState(':token');
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [section, setSection] = useState('Posts');

  useEffect(() => {
    async function getPosts() {
      const response = await axios.get(`http://localhost:5000/api/posts/${token}`);
      setPosts(response.data);
    }
    async function getCurrentUser() {
      const response = await axios.get(`http://localhost:5000/api/users/get/current/${token}`);
      setCurrentUser(response.data);
    }
    getPosts();
    getCurrentUser();

    if (localStorage.getItem('auth') == null) {
      setToken(':token')
    }
    else {
      setToken(localStorage.getItem('auth'))
    }
  }, [token, posts])

  return (
    <div className="App">

      <AuthContext.Provider value={{
        token,
        setToken
      }}>
        <BrowserRouter>

          <NavBar id={currentUser.id} avatar={avatar} currentSection={section} setCurrentSection={setSection} login={currentUser.length === 0 ? 'guest' : currentUser.login} />

          <Routes>

            <Route path='/' element={<PostList posts={posts} />} />
            <Route path='/post/:id' element={<OpenedPost />} />
            <Route path='/post/new/:token' element={<NewPost />} />
            <Route path='/post/edit/:id' element={<EditPost />} />

            <Route path='/users' element={<UserList setCurrentSection={setSection} />} />
            <Route path='/users/:id' element={<OpenedUser setCurrentSection={setSection} />} />
            <Route path='/users/new/:token' element={<NewUser />} />
            <Route path='/users/edit/:token' element={<EditUser />} />

            <Route path='/signup' element={<SignUp setCurrentSection={setSection} />} />
            <Route path='/login' element={<LogIn setCurrentSection={setSection} />} />
            <Route path='/reset_password' element={<ResetPass setCurrentSection={setSection} />} />
            <Route path='/confirm_password/:token' element={<ConfirmPass />} />

          </Routes>

        </BrowserRouter>
      </AuthContext.Provider>

    </div>
  );
}

export default App;
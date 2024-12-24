import React from 'react'
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/HomePage';
import Login from './pages/Login/login';
import Signin from './pages/Signin/signin';


const route = (
      <Router>
        <Routes>
          <Route path='/dashboard' exact element={<Home/>}></Route>
          <Route path='/login' exact element={<Login/>}></Route>
          <Route path='/signin' exact element={<Signin/>}></Route>
        </Routes>
      </Router>
)

const App = () => {
  return(

    <div>
      {route}
    </div>

  );
}


export default App;
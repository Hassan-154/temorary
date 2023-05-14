import React, { useState } from 'react';
import './navbar.scss';
import { BiShoppingBag } from 'react-icons/bi';
import { FiMenu } from 'react-icons/fi';

function Navbar() {
    const [showLinks, setShowLinks] = useState(false);

    const handleClick = () => {
      setShowLinks(!showLinks);
    };
  return (
    <nav>
      <div className="logo">
        <BiShoppingBag size={32}/>
      </div>
      <div className={showLinks ? 'nav-links show' : 'nav-links'}>
        <li><a href="#">Link 1</a></li>
        <li><a href="#">Link 2</a></li>
        <li><a href="#">Link 3</a></li>
        <li><a href="#">Link 4</a></li>
      </div>
      <div className="burger" onClick={handleClick}>
        <FiMenu size={30}/>
      </div>
    </nav>
  )
}

export default Navbar
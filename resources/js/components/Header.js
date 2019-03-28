import React from 'react';
import {Link} from 'react-router-dom';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-light navbar-laravel">
      <div className="container">
        <Link className="navbar-brand" to="/">Taskman</Link>
      </div>
    </nav>
  );
}

export default Header;

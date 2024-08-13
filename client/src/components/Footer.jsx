import React from 'react';
import '../App.css';

const Footer = () => {
  return (
    <footer className="w-100 fixed-bottom bg-light py-1 text-center mt-3">
      <div className="text-dark mt-4">
        <div className="d-flex justify-content-center gap-4">
          <a href="https://github.com/CinosMagician" target="_blank" className="text-decoration-none navi">Lachlan</a>
          <a href="https://github.com/roughnut" target="_blank" className="text-decoration-none navi">Jeremy</a>
        </div>
        <p className="text-muted small mt-2">&copy; 2024</p>
      </div>
    </footer>
  );
};

export default Footer;
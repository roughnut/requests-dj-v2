import React from 'react';
import DiscoBall from './DiscoBall';
import '../App.css';

// CSS style still in Tailwind, needs to be converted to Bootstrap.

const Footer = () => {
  return (
    <footer className="w-full bottom-0 left-0 right-0 mx-auto bg-custom-charcoal py-4 flex-wrap text-center mt-8">
      <DiscoBall />
      <div className="text-white mt-4">
        <div className="flex justify-center gap-4">
          <a href="https://github.com/CinosMagician" target="_blank" className="hover:text-custom-mandalay hover:no-underline nav">Lachlan</a>
          <a href="https://github.com/roughnut" target="_blank" className="hover:text-custom-mandalay hover:no-underline nav">Jeremy</a>
        </div>
        <p className="text-custom-brown mx-auto text-sm mt-2">&copy; 2024</p>
      </div>
    </footer>
  );
};

export default Footer;
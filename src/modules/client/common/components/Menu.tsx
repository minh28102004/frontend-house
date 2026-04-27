'use client';
import React, { useEffect, useState } from 'react';
import MenuMobile from './menu/MenuMobile';
import MenuPc from './menu/MenuPc';

const Menu = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile ? <MenuMobile /> : <MenuPc />;
};

export default Menu;
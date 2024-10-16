import React from 'react';
import { Outlet} from "react-router-dom";
import Header from './Header';
import '../redirect_portal/redirect_style.css';

function Layout() {
 // alert(colorThem)
  return (
    <div id='admin2'>
    <Header/>
    <Outlet/>
  </div>
  )
};

export default Layout;
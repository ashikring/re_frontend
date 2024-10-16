import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Router from "../../routes/route";
import "../redirect_portal/redirect_style.css";
import { Box, Tab, Tabs } from "@mui/material";

function Navbar({selectedValue}) {
  const navigate = useNavigate();
  const location = useLocation();
  const current_user = localStorage.getItem("current_user");
    const user = localStorage.getItem(`user_${current_user}`)
  const [value, setValue] = useState(() => {
    // Determine the default active tab based on the location pathname
    switch (location.pathname) {
      case Router.REDIRECT_DASHBOARD:
        return 0;
      case Router.REDIRECT_CAMPAIGNS:
        return 1;
      case Router.REDIRECT_DESTINATION:
        return 2;
      case Router.REDIRECT_CALL_ACTIVE:
        return 3;
      case Router.REDIRECT_XML_CDR:
        return 4;
      case Router.REDIRECT_CALL_BLOCK:
        return 5;
      case Router.REDIRECT_MINUTES_LOG:
        return 6;
      default:
        return 0; // Set default active tab
    }
  });

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    // Perform navigation based on the selected tab index
    switch (newValue) {
      case 0:
        navigate(Router.REDIRECT_DASHBOARD);
        break;
      case 1:
        navigate(Router.REDIRECT_CAMPAIGNS);
        break;
      case 2:
        navigate(Router.REDIRECT_DESTINATION);
        break;
      case 3:
        navigate(Router.REDIRECT_CALL_ACTIVE);
        break;
      case 4:
        navigate(Router.REDIRECT_XML_CDR);
        break;
      case 5:
        navigate(Router.REDIRECT_CALL_BLOCK);
        break;
      case 6:
        navigate(Router.REDIRECT_MINUTES_LOG);
        break;
      default:
        break;
    }
  };

  return (<>
  {user?.user_type === "admin" ?(<></>):(<><Box sx={{ width: "100%",
  //  backgroundColor: "#0e397f" 
   }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }} className="redirect_header_row">
        <Tabs
          value={value}
          onChange={handleTabChange}
          aria-label="basic tabs example"
          className="redirect_tab"
        >
          <Tab label="Dashboard" className="tabbs" />
          <Tab label="Manage Campaign" className="tabbs" />
          <Tab label="DID/TFN NUMBER" className="tabbs" />
          <Tab label="Active Calls" className="tabbs" />
          <Tab label="Reports" className="tabbs" />
          <Tab label="Call Block" className="tabbs" />
          <Tab label="Minutes Log" className="tabbs" />
        </Tabs>
      </Box>
    </Box></>)}
    
    </>
  );
}

export default Navbar;


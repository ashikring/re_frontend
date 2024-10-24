import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../../src/style.css";
import "../redirect_portal/redirect_style.css";
import { toast } from "react-toastify";
import axios from "axios";
import socketIOClient from "socket.io-client";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import { Dropdown } from "react-bootstrap";
import LiveCall from "../../pages/LiveCall";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import CallIcon from "@mui/icons-material/Call";
import { api } from "../../mockData";

function Header() {
  const [selectedValue, setSelectedValue] = useState(""); // State to hold the selected value
  const [number, setNumber] = useState(0);
  const [minutest, setMinutest] = useState([]);
  const current_user = localStorage.getItem("current_user");
  const user = JSON.parse(localStorage.getItem(`user_${current_user}`));
  const navigate = useNavigate();

  const handleSelect = (eventKey) => {
    // When a Dropdown.Item is clicked, update the selected value
    setSelectedValue(eventKey);
  };

  useEffect(() => {
    const socket = socketIOClient(`${api.dev}`);

    // Get the current user information from localStorage
    const current_user = localStorage.getItem("current_user");
    const user = JSON.parse(localStorage.getItem(`user_${current_user}`));

    // Listen for events from the server
    socket.on("call_details", (data) => {
      // Handle the received data (e.g., update state, trigger a re-fetch)
      if (data?.data !== undefined) {
        // Filter the data based on UserId matching user.uid
        const filteredData = Object.keys(data.data)
          .map((key) => ({
            id: key,
            ...data.data[key],
          }))
          .filter((item) => item.UserId === user.uid); // Filter by UserId

        // Get the count of filtered objects
        const newDataCount = filteredData.length;
        setNumber(newDataCount);
      }
    });

    return () => {
      // Disconnect the socket when the component unmounts
      socket.disconnect();
    };
  }, []); // Empty dependency array ensures this effect runs once on mount

  const logout = () => {
    // let data = JSON.stringify({
    //   "user_uuid": user?.user_uuid
    // });

    // let config = {
    //   method: 'post',
    //   maxBodyLength: Infinity,
    //   url: 'http://95.217.227.234:5000/logout',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   data : data
    // };

    // axios.request(config)
    // .then((res) => {
    //   if (res?.data?.message !== "") {
    toast.info("Logout Successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1500,
    });
    localStorage.removeItem("user");
    navigate("/");
    //   }
    // })
    // .catch((error) => {
    //   console.log(error);
    // });

    // axios
    //   .get("https://ikalyuga.com/api/index.php?action=logout", {})
    //   .then((res) => {
    //     if (res?.data?.response?.message !== "") {
    //       toast.info(res.data.response.message, {
    //         position: toast.POSITION.TOP_RIGHT,
    //         autoClose: 1500,
    //       });
    //       localStorage.removeItem("user");
    //       navigate("/");
    //     }
    //   });
  };

  const minutes = async() =>{
    const current_user = localStorage.getItem("current_user");
    const token = JSON.parse(localStorage.getItem(`user_${current_user}`));
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${api.dev}/api/userminute`,
        headers: {
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${token.access_token} `
        },
      };
       await axios
        .request(config)
        .then((response) => {
          setMinutest(response.data.data)
        })
        .catch((error) => {
          let errorMessage = "An error occurred while fetching data.";
          if (error.response) {
            if (error.response.status === 403) {
              errorMessage = "Permission Denied";
            } else if (error.response.status === 400 || error.response.status === 401 || error.response.status === 500) {
              errorMessage = error.response.data.message || "Bad Request";
            }
          }
        });
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    minutes();
    if (selectedValue === "Manage") {
      navigate("/manage");
    }
  }, [selectedValue]); // This effect runs whenever selectedValue changes

  return (
    <>
      <Box sx={{ flexGrow: 1 }} className="manage_boxx">
        <AppBar position="static" className="manage_top_header">
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
              className="d-flex align-items-center"
            >
              <a href="/redirect_portal">
                <img
                  src="/img/logo_white11.png"
                  alt="Manage Logo"
                  className="img-fluid d-block"
                  style={{ cursor: "pointer", width: "85%" }}
                />
              </a>
            </Typography>

            <div className="manage_rgiht_bdr d-flex align-items-center">
            <p style={{color: "#fff",
                      textTransform: "capitalize",
                      fontSize: "14px",margin:'0'}}>R. Minutes: <span style={{fontSize:'17px',fontWeight:'600'}}>{minutest[0]?.remaining_minutes}</span></p>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                className="manage_call"
              >
                <CallIcon className="call_icon" />
                <div>
                  <sub
                    style={{
                      color: "#000",
                      textTransform: "capitalize",
                      fontSize: "14px",
                    }}
                    className="live_icon"
                  >
                    {number}
                  </sub>
                </div>
                Live
                {/* <LiveCall /> */}
              </IconButton>
              <div className="dshbrd_hdr_icon">
                <ul>
                  <li>
                    <ul className="hdr_profile">
                      <li>
                        {/* Add a class to the image element */}
                        <img
                          src="/img/nav_author.jpg"
                          className="img-fluid d-block rounded-circle" // Apply rounded-circle class for circular display
                          alt="profile"
                        />
                        <div className="profile_name">
                          <b>{user?.user_name}</b>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              {/* {user?.user_type === "admin" ? (
                <></>
              ) : (
                <>
                  <Dropdown onSelect={handleSelect}>
                    <Dropdown.Toggle
                      className="dropbtn"
                      id="dropdown-basic"
                      style={{
                        color: "#fff",
                        textTransform: "capitalize",
                        fontSize: "14px",
                      }}
                    >
                      Services
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {selectedValue === "Manage" ? (
                        <>
                          <Dropdown.Item eventKey="Redirect">
                            Redirect
                          </Dropdown.Item>
                          <Dropdown.Item href="/sip" eventKey="Sip">
                            Sip
                          </Dropdown.Item>
                        </>
                      ) : (
                        <>
                          <Dropdown.Item href="/manage_portal">
                            Manage
                          </Dropdown.Item>
                          <Dropdown.Item href="/sip_portal" eventKey="Sip">
                            Sip
                          </Dropdown.Item>
                        </>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              )} */}

              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                style={{ paddingRight: "0" }}
                onClick={logout}
              >
                <LogoutIcon className="call_icon " />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {/* <!--navbar-sec--> */}
        <Navbar selectedValue={selectedValue} />
      </Box>
    </>
  );
}

export default Header;

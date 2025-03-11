import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import "../redirect_portal/redirect_style.css";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { api } from "../../mockData";

function Layout({ userThem, handleClickUser,toggleDrawer, open, setOpen}) {
  const [minutest, setMinutest] = useState([]);
  const [promotional, setPromotional] = useState([]);
  const [openOffer, setOpenOffer] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const minutes = async () => {
    const current_user = localStorage.getItem("current_user");
    const token = JSON.parse(localStorage.getItem(`user_${current_user}`));
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${api.dev}/api/userminute`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access_token} `,
        },
      };
      await axios
        .request(config)
        .then((response) => {
          setMinutest(response.data.data);
        })
        .catch((error) => {
          let errorMessage = "An error occurred while fetching data.";
          if (error.response) {
            if (error.response.status === 403) {
              errorMessage = "Permission Denied";
            } else if (
              error.response.status === 400 ||
              error.response.status === 401 ||
              error.response.status === 500
            ) {
              errorMessage = error.response.data.message || "Bad Request";
            }
          }
        });
    } catch (error) {
      console.log("error", error);
    }
  };
  const promotionalOffer = async () => {
    const current_user = localStorage.getItem("current_user");
    const token = JSON.parse(localStorage.getItem(`user_${current_user}`));
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${api.dev}/api/userpromotional`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access_token} `,
        },
      };
      await axios
        .request(config)
        .then((response) => {
          setPromotional(response.data.data);
        })
        .catch((error) => {
          let errorMessage = "An error occurred while fetching data.";
          if (error.response) {
            if (error.response.status === 403) {
              errorMessage = "Permission Denied";
            } else if (
              error.response.status === 400 ||
              error.response.status === 401 ||
              error.response.status === 500
            ) {
              errorMessage = error.response.data.message || "Bad Request";
            }
          }
        });
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    if (minutest !== undefined && minutest.length > 0) {
      if (minutest[0]?.remaining_minutes === 390) {
        setOpenAlert(true);
      } else if (minutest[0]?.remaining_minutes > 3050) {
        setOpenAlert(false);
      }
    }
    if (promotional !== undefined && promotional.length > 0) {
      if (promotional[0]?.is_active === 0) {
        setOpenOffer(true);
      } else if (promotional[0]?.is_active === 1) {
        setOpenOffer(false);
      }
    }
  }, [minutest, promotional]);
  useEffect(() => {
    minutes();
    promotionalOffer();
  }, []);

  const handleClose = () => {
    setOpenAlert(false);
  };
  // alert(userColorTheme)
  return (
    <div
      // id='admin2'
      className={`App ${userThem} `}
      id="admin1"
    >
      <Header userThem={userThem} handleClickUser={handleClickUser} toggleDrawer={toggleDrawer} open={open} setOpen={setOpen}/>
      {/* <Dialog open={openAlert} onClose={handleClose}>
        <DialogTitle>Important Notification</DialogTitle>
        <DialogContent>
          <Typography>
            You have {minutest[0]?.remaining_minutes} used minutes.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* offer dialog */}
      {/* <Dialog
        open={openOffer}
        onClose={() => setOpenOffer(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ textAlign: "center", padding: 2 }}>
          <Box
            component="img"
            src={"/img/errorpage.jpg"}
            alt="Dialog Image"
            sx={{
              width: "100%", // Full width inside dialog
              height: "auto", // Maintain aspect ratio
              maxHeight: "400px", // Limit max height for better UI
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
          <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", mt: 2 }}>
            {promotional[0].title}
          </DialogTitle>
          <Typography variant="body1" sx={{ mt: 1 }}>
          {promotional[0].content}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={() => setOpenOffer(false)}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog> */}
      <Outlet />
    </div>
  );
}

export default Layout;

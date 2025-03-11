import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { StyledDataGrid } from "../../pages/CustomDataGrid";
import { GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/actions/userAction";
import {
  createAdminPromotion,
  getAdminPromotion,
} from "../../redux/actions/adminPortal/adminPortal_promotionAction";
import { render } from "@testing-library/react";

const drawerWidth = 240;
function AdminPromotional({ colorThem }) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [selectfile, setSelectfile] = useState("");
  const [userId, setUserId] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [response, setResponse] = useState("");

  const handleReset = () => {
    setUserId([]);
    setTitle("");
    setContent("");
    setSelectfile("");
  };

  const handleSlctFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectfile(file);
    }
  };

  useEffect(() => {
    dispatch(getAllUsers(""));
    dispatch(getAdminPromotion());
  }, [dispatch, response]);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("title", title);
    formData.append("content", content);
    if (selectfile) {
      formData.append("files", selectfile);
    }

    dispatch(createAdminPromotion(formData, handleReset, setResponse));
  };

  const columns = [
    {
      field: "username",
      headerName: "User Name",
      headerClassName: "custom-header",
      width: 120,
      headerAlign: "center",
      align: "center",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "title",
      headerName: "Title",
      headerClassName: "custom-header",
      width: 120,
      headerAlign: "center",
      align: "center",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "content",
      headerName: "Content",
      headerClassName: "custom-header",
      width: 120,
      headerAlign: "center",
      align: "center",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "file_name",
      headerName: "Image",
      width: 130,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "file_data",
      headerName: "Image",
      width: 130,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <img
            src={params.value}
            alt="promotion"
            style={{ width: "100px", height: "100px" }}
          />
        );
      },
    },
  ];

  const rows = useMemo(() => {
    const calculatedRows = [];
    state?.getAdminPromotion?.promotions &&
      state?.getAdminPromotion?.promotions?.forEach((item, index) => {
        calculatedRows.push({
          id: index + 1,
          content: item.content,
          file_data: item.file_data,
          user_id: item.user_id,
          promoId: item.id,
          file_name: item.file_name,
          title: item.title,
          is_active: item.is_active,
          username: item.username,
        });
      });
    return calculatedRows;
  }, [state?.getAdminPromotion?.promotions]);

  return (
    <div className={`App ${colorThem} `}>
      <div className="contant_box">
        <Box
          className="right_sidebox mobile_top_pddng"
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <h3>Promotions</h3>
          <Grid container style={{ padding: "20px 0" }}>
            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <FormControl fullWidth style={{ margin: "5px 0 5px 0" }}>
                <InputLabel id="demo-simple-select-label">UserName</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="UserName"
                  style={{ textAlign: "left" }}
                  multiple
                  value={userId || []}
                  onChange={(e) => {
                    setUserId(e.target.value);
                  }}
                  renderValue={
                    (selected) =>
                      state?.allUsers?.users
                        ?.filter((user) => selected.includes(user.id)) // Find selected users
                        .map((user) => user.username) // Get usernames
                        .join(", ") // Join usernames with commas
                  }
                  required
                >
                  {state?.allUsers?.users
                    ?.filter(
                      (item) =>
                        item.username !== "superadmin" &&
                        item.username !== "admin"
                    )
                    .map((item, index) => {
                      return (
                        <MenuItem key={index} value={item.id}>
                          <Checkbox checked={userId.includes(item.id)} />{" "}
                          {/* Add Checkbox */}
                          {item.username}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>

              <TextField
                style={{ width: "100%", margin: "4px 0" }}
                type="text"
                label="Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                style={{ width: "100%", margin: "4px 0" }}
                id="outlined-multiline-flexible"
                label="Content"
                multiline
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <label htmlFor="image-upload">
                <Button variant="contained" color="primary" component="span">
                  Select Image
                </Button>
              </label>
            </Grid>

            <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
              <Box className="p-3 promotion_image">
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="image-upload"
                  type="file"
                  onChange={handleSlctFile}
                />
                {selectfile && (
                  <Box
                    component="img"
                    src={URL.createObjectURL(selectfile)}
                    sx={{
                      maxWidth: {
                        xs: "19rem",
                        sm: "19rem",
                        md: "18rem",
                        lg: "20rem",
                        xl: "25rem",
                      },
                      minWidth: "6rem",
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                )}
              </Box>
            </Grid>
            <Button
              variant="contained"
              color="success"
              component="span"
              onClick={handleSubmit}
              className="mt-3 align-items-center"
            >
              Submit
            </Button>
          </Grid>
          <div style={{ height: "100%", width: "100%" }}>
            <StyledDataGrid
              rows={rows}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
              autoHeight
            />
          </div>
        </Box>
      </div>
    </div>
  );
}

export default AdminPromotional;

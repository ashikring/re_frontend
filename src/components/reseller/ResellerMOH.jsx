import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  Box,
  Button,
  Checkbox,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  createTheme,
} from "@mui/material";
import { Close, Edit } from "@mui/icons-material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton } from "@mui/x-data-grid";
import Backdrop from "@mui/material/Backdrop";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { ThemeProvider } from "@emotion/react";
import { makeStyles } from "@mui/styles";
import {
  createAdminMoh,
  getAdminMoh,
  updateAdminMoh,
} from "../../redux/actions/adminPortal_mohAction";
import { getAllUsers } from "../../redux/actions/userAction";
import axios from "axios";
import { api } from "../../mockData";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const drawerWidth = 240;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const useStyles = makeStyles({
  borderedGreen: {
    borderLeft: "3px solid green", // Add your border styling here
    boxShadow: "2px -1px 4px -3px #686868",
    margin: "4px 4px 1px 4px !important",
  },
  borderedRed: {
    borderLeft: "3px solid red", // Add your border styling here
    boxShadow: "2px -1px 4px -3px #686868",
    margin: "4px 4px 1px 4px !important",
  },
});

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          "& .MuiDataGrid-row": {
            minHeight: "auto", // Adjust row height to make it more compact
          },
        },
      },
      defaultProps: {
        density: "compact", // Set default density to compact
      },
    },
  },
});

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton/>
      <GridToolbarDensitySelector />
      <GridToolbarFilterButton/>
    </GridToolbarContainer>
  );
};

function ResellerMOH({ colorThem }) {
  const token = JSON.parse(localStorage.getItem("reseller"));
  const [userId, setUserId] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [values, setValues] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [response, setResponse] = useState("");
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setUserId("");
    setRecordings([]);
    setName("");
    setValues([]);
  };

  // ======Edite-------->
  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setId("");
    setName("");
    setRecordings([]);
    setUserId("");
    setValues([]);
  }, [setOpenModal, setId, setName, setRecordings, setValues]);
  // ======End-Edite-------->

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      name: name,
      user_id: userId,
      recordings: recordings,
    });
    dispatch(
      createAdminMoh(
        data,
        setOpen,
        setResponse,
        setName,
        setUserId,
        setRecordings,
        setValues
      )
    );
  };

  const handleButtonClick = useCallback((row) => {
    setOpenModal(true);
    setUserId(row?.user_id);
    setName(row?.name); // Generate numeric IDs for playlist_entries
    // const numericEntries = row?.playlist_entries.map((entry, index) => index + 1);
    // setRecordings(numericEntries);
  }, []); // Memoize event handler

  const handleUpdate = (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      name: name,
      recordings: recordings,
    });
    dispatch(
      updateAdminMoh(
        data,
        setOpenModal,
        setResponse,
        setName,
        setUserId,
        setRecordings,
        setValues
      )
    );
  };

  useEffect(() => {
    dispatch(getAdminMoh());
    dispatch(getAllUsers(""));
  }, [response]);

  useEffect(() => {
    if (userId !== "") {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${api.dev}/api/getuserrecordings?user_id=${userId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access_token} `,
        },
      };
      axios
        .request(config)
        .then((response) => {
          setValues(response?.data);
        })
        .catch((error) => {
        });
    }
  }, [userId]);

  const columns = [
    {
      field: "username",
      headerName: "UserName",
      width: 200,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },

    {
      field: "playlist_entries",
      headerName: "Playlist",
      width: 550,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <span>
          {params.value &&
            params.value.map((entry, index) => (
              <span key={index}>
                {entry}
                {index < params.value.length - 1 && ", "}
              </span>
            ))}
        </span>
      ),
    },

    {
      field: "action",
      headerName: "Action",
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            <IconButton onClick={() => handleButtonClick(params.row)}>
              <Edit
                index={params.row.id}
                style={{ cursor: "pointer", color: "#0e397f" }}
              />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const mockDataTeam = useMemo(() => {
    const calculatedRows = [];
    state?.getAdminMoh?.getMoh &&
      state?.getAdminMoh?.getMoh?.forEach((item, index) => {
        calculatedRows.push({
          id: index + 1,
          name: item.name,
          playlist_entries: item.playlist_entries,
          user_id: item.user_id,
          mohId: item.id,
          username: item.username,
        });
      });
    return calculatedRows;
  }, [state?.getAdminMoh?.getMoh]);

  return (
    <>
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
            <div className="col-lg-12">
              <div className="">
                {/* <!----> */}
                <div className="tab-content" id="pills-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="pills-home"
                    role="tabpanel"
                    aria-labelledby="pills-home-tab"
                  >
                    {/* <!--role-contet--> */}
                    <div
                      className="cntnt_title"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "end",
                      }}
                    >
                      <div>
                        <h3>Music On Hold</h3>
                        {/* <p>
                              Use this to configure your SIP extensions.
                              </p> */}
                      </div>

                      <IconButton
                        className="all_button_clr"
                        onClick={handleOpen}
                      >
                        Add
                        <AddOutlinedIcon />
                      </IconButton>

                      <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={open}
                        closeAfterTransition
                        slots={{ backdrop: Backdrop }}
                        slotProps={{
                          backdrop: {
                            timeout: 500,
                          },
                        }}
                      >
                        <Fade in={open} className="bg_imagess">
                          <Box
                            sx={style}
                            borderRadius="10px"
                            textAlign="center"
                          >
                            <IconButton
                              onClick={handleClose}
                              sx={{ float: "inline-end" }}
                            >
                              <Close />
                            </IconButton>
                            <br />
                            <Typography
                              id="transition-modal-title"
                              variant="h6"
                              component="h2"
                              color={"#092b5f"}
                              fontSize={"18px"}
                              fontWeight={"600"}
                              marginBottom={"16px"}
                            >
                              Add Music On Hold
                            </Typography>
                            <form
                              style={{
                                textAlign: "center",
                                textAlign: "center",
                                height: "auto",
                                overflow: "auto",
                                paddingTop: "10px",
                                padding: "5px",
                              }}
                            >
                              <TextField
                                style={{
                                  width: "100%",
                                  margin: " 5px 0 5px 0",
                                }}
                                type="text"
                                label="Name"
                                variant="outlined"
                                padding={"0px 0 !important"}
                                name="name"
                                value={name}
                                onChange={(e) => {
                                  setName(e.target.value);
                                }}
                              />
                              <br />
                              <FormControl
                                fullWidth
                                style={{ width: "100%", margin: "7px 0" }}
                              >
                                <InputLabel id="demo-simple-select-label">
                                  UserName
                                </InputLabel>

                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label="UserName"
                                  helperText="Select the language."
                                  style={{ textAlign: "left" }}
                                  value={userId}
                                  onChange={(e) => {
                                    setUserId(e.target.value);
                                  }}
                                  required
                                >
                                  {state?.allUsers?.users?.map(
                                    (item, index) => {
                                      return (
                                        <MenuItem key={index} value={item?.id}>
                                          {item.username}
                                        </MenuItem>
                                      );
                                    }
                                  )}
                                </Select>
                              </FormControl>

                              <FormControl
                                style={{
                                  width: "100%",
                                  margin: " 5px 0 5px 0",
                                }}
                              >
                                <InputLabel id="demo-multiple-checkbox-label">
                                  Recordings
                                </InputLabel>
                                <Select
                                  style={{ textAlign: "left" }}
                                  labelId="demo-multiple-checkbox-label"
                                  label="Recordings"
                                  id="demo-multiple-checkbox"
                                  multiple
                                  fullWidth
                                  value={recordings}
                                  onChange={(e) => {
                                    setRecordings(e.target.value);
                                  }}
                                  input={<OutlinedInput label="Recordings" />}
                                  renderValue={(selected) =>
                                    selected
                                      .map(
                                        (value) =>
                                          values?.data.find(
                                            ([num, name]) => num === value
                                          )[1]
                                      )
                                      .join(", ")
                                  }
                                  MenuProps={MenuProps}
                                >
                                  {values?.data?.map(([num, name]) => (
                                    <MenuItem key={name} value={num}>
                                      <Checkbox
                                        checked={recordings.includes(num)}
                                      />
                                      <ListItemText primary={name} />
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <br />

                              <Button
                                variant="contained"
                                className="all_button_clr"
                                color="primary"
                                sx={{
                                  fontSize: "16px !impotant",
                                  background:
                                    "linear-gradient(180deg, #0E397F 0%, #001E50 100%) !important",
                                  marginTop: "20px",
                                  padding: "10px 20px !important",
                                  textTransform: "capitalize !important",
                                }}
                                onClick={handleClose}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="contained"
                                className="all_button_clr"
                                color="primary"
                                sx={{
                                  fontSize: "16px !impotant",
                                  background: "#092b5f",
                                  marginTop: "20px",
                                  padding: "10px 20px !important",
                                  textTransform: "capitalize !important",
                                }}
                                onClick={handleSubmit}
                              >
                                save
                              </Button>
                            </form>
                          </Box>
                        </Fade>
                      </Modal>

                      {/* ==Edite-modal== */}

                      <Dialog
                        open={openModal}
                        onClose={handleCloseModal}
                        sx={{ textAlign: "center" }}
                      >
                        <Box>
                          <IconButton
                            onClick={handleCloseModal}
                            sx={{
                              float: "inline-end",
                              margin: "10px 10px 0px 0px",
                            }}
                          >
                            <Close />
                          </IconButton>
                        </Box>
                        <DialogTitle
                          sx={{
                            color: "#07285d",
                            fontWeight: "600",
                            width: "500px",
                          }}
                        >
                          Edit Music On Hold
                        </DialogTitle>
                        <DialogContent>
                          <form>
                            {/* <SelectComponent handleClose={handleClose} /> */}
                            <Typography variant="body1">
                              <br />
                              <form
                                style={{
                                  textAlign: "center",
                                  // height: "348px",
                                  height: "auto",
                                  // overflow: "auto",
                                  paddingTop: "10px",
                                  padding: "5px",
                                  width: "auto",
                                }}
                              >
                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Name"
                                  variant="outlined"
                                  padding={"0px 0 !important"}
                                  name="name"
                                  value={name}
                                  onChange={(e) => {
                                    setName(e.target.value);
                                  }}
                                />
                                <br />
                                <FormControl
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                >
                                  <InputLabel id="demo-multiple-checkbox-label">
                                    Recordings
                                  </InputLabel>
                                  <Select
                                    style={{ textAlign: "left" }}
                                    labelId="demo-multiple-checkbox-label"
                                    label="Recordings"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    fullWidth
                                    value={recordings}
                                    onChange={(e) => {
                                      setRecordings(e.target.value);
                                    }}
                                    input={<OutlinedInput label="Recordings" />}
                                    renderValue={(selected) =>
                                      selected
                                        .map(
                                          (value) =>
                                            values?.data.find(
                                              ([num, name]) => num === value
                                            )[1]
                                        )
                                        .join(", ")
                                    }
                                    MenuProps={MenuProps}
                                  >
                                    {values?.data?.map(([num, name]) => (
                                      <MenuItem key={name} value={num}>
                                        <Checkbox
                                          checked={recordings.includes(num)}
                                        />
                                        <ListItemText primary={name} />
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </form>
                            </Typography>
                          </form>
                        </DialogContent>
                        <DialogActions
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            paddingBottom: "20px",
                          }}
                        >
                          <Button
                            variant="contained"
                            sx={{
                              fontSize: "16px !impotant",
                              background:
                                "linear-gradient(180deg, #0E397F 0%, #001E50 100%) !important",
                              marginTop: "20px",
                              marginLeft: "0px !important",
                              padding: "10px 20px !important",
                              textTransform: "capitalize !important",
                            }}
                            className="all_button_clr"
                            color="info"
                            onClick={handleCloseModal}
                            autoFocus
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            sx={{
                              fontSize: "16px !impotant",
                              marginTop: "20px",
                              padding: "10px 20px !important",
                              textTransform: "capitalize !important",
                              marginLeft: "0px !important",
                              marginRight: "0px !important",
                            }}
                            className="all_button_clr"
                            color="error"
                            onClick={handleUpdate}
                          >
                            Update
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>

                    <div className="row">
                      <ThemeProvider theme={theme}>
                      <div style={{ height: '100%', width: '100%' }}>
                          <DataGrid
                            // checkboxSelection
                            className="tbl_innr_box"
                            rows={mockDataTeam}
                            columns={columns}
                            // headerClassName="custom-header"
                            components={{ Toolbar: GridToolbar }}
                            slots={{
                              toolbar: CustomToolbar,
                            }}
                            autoHeight
                          />
                        </div>
                      </ThemeProvider>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
}

export default ResellerMOH;

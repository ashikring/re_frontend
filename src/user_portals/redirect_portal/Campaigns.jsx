import React, { useCallback, useEffect, useState } from "react";
import "../../../src/style.css";
import { Link, useNavigate } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import { ThemeProvider } from "@mui/styles";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { Delete, Edit, Visibility, Close } from "@mui/icons-material";
import {
  createRedirectCampaign,
  deleteRedirectCampaign,
  getRedirectCampaign,
  updateRedirectCampaign,
} from "../../redux/actions/redirectPortal/redirectPortal_campaignAction";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  // backgroundColor: "rgb(9, 56, 134)",
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarFilterButton />
      {/* <GridToolbarExport /> */}
    </GridToolbarContainer>
  );
}

function Campaigns() {
  const current_user = localStorage.getItem("current_user");
  const user_id = JSON.parse(localStorage.getItem(`user_${current_user}`));
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [open, setOpen] = React.useState(false);
  const [response, setResponse] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [buyerOpen, setBuyerOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [strategy, setStrategy] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [alertMessage, setAlertMessage] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setCampaignName("");
    setDescription("");
  };
  const handleAlertClose = () => {
    setAlertMessage(false);
  };
  const handleAddBuyerOpen = () => setBuyerOpen(true);
  const handleAddBuyerClose = () => setBuyerOpen(false);
  const handleEditCampaignOpen = () => setEdit(true);
  const handleEditCampaignClose = () => {
    setEdit(false);
    setCampaignName("");
    setDescription("");
  };

  useEffect(() => {
    dispatch(getRedirectCampaign());
  }, [response]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "campaignName":
        setCampaignName(value);
        break;
      case "strategy":
        setStrategy(value);
        break;
      case "status":
        setStatus(value);
        break;
      case "description":
        setDescription(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    const data = JSON.stringify({
      user_id: user_id.uid,
      group_name: campaignName,
      description: description,
    });
    dispatch(createRedirectCampaign(data, setResponse, handleClose));
  };

  const handleUpdate = () => {
    const data = JSON.stringify({
      id: campaignId,
      user_id: user_id.uid,
      group_name: campaignName,
      description: description,
    });
    dispatch(
      updateRedirectCampaign(data, setResponse, handleEditCampaignClose)
    );
  };

  const handleMessage = useCallback(
    (data) => {
      setName(data?.group_name);
      setId(data?.campaignId);
      setAlertMessage(true);
    },
    [setName]
  ); // Memoize event handler

  const handleDelete = useCallback(() => {
    dispatch(deleteRedirectCampaign(JSON.stringify({ id: id }), setResponse));
    setAlertMessage(false);
  }, [dispatch, setResponse, id]);

  const handleEdit = (data) => {
    handleEditCampaignOpen();
    setCampaignName(data?.group_name);
    setDescription(data?.description);
    setCampaignId(data?.campaignId);
  };

  const handleView = (data) => {
    navigate("/redirect_portal/buyer_view", { state: { data: data } });
  };

  const columns = [
    {
      field: "group_name",
      headerName: "Campaign Name",
      headerClassName: "redirect_custom-header",
      headerAlign: "center",
      width: 150,
      align: "center",
    },

    {
      field: "description",
      headerName: "Description",
      width: 150,
      headerClassName: "redirect_custom-header",
      headerAlign: "center",
      align: "center",
    },

    {
      field: "add_buyer",
      headerName: "Add Buyer",
      flex: 1,
      headerClassName: "redirect_custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
            onClick={handleAddBuyerOpen}
          >
            {params.row.add_buyer}
          </div>
        );
      },
    },
    {
      field: "view_buyer",
      headerName: "View Buyer",
      flex: 1,
      headerClassName: "redirect_custom-header",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 140,
      renderCell: (params) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            <Tooltip title="view" disableInteractive interactive>
              <IconButton onClick={() => handleView(params.row)}>
                <Visibility style={{ cursor: "pointer", color: "grey" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="edit" disableInteractive interactive>
              <IconButton onClick={() => handleEdit(params.row)}>
                <Edit
                  index={params.row.id}
                  style={{ cursor: "pointer", color: "#42765f" }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="delete" disableInteractive interactive>
              <IconButton onClick={() => handleMessage(params.row)}>
                <Delete style={{ cursor: "pointer", color: "red" }} />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const mockDataTeam = [];
  state?.getRedirectCampaign?.RedirectCampaign?.data &&
    state?.getRedirectCampaign?.RedirectCampaign?.data?.forEach(
      (item, index) => {
        mockDataTeam.push({
          id: index + 1,
          description: item.description,
          group_name: item.group_name,
          user_id: item.user_id,
          campaignId: item.id,
        });
      }
    );
  return (
    <>
      <div className="main">
        <section className="sidebar-sec">
          <div className="container-fluid">
            <div className="row">
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

                      <div className="tab_cntnt_box">
                        <div
                          className="cntnt_title"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "end",
                          }}
                        >
                          <div>
                            <h3>Campaigns</h3>
                            <p>
                              A ring group is a set of destinations that can be
                              called with a ring strategy.
                            </p>
                          </div>

                          {/* ========= */}
                          <box>
                            <IconButton
                              className="redirect_all_button_clr"
                              onClick={handleOpen}
                            >
                              Add Campaign
                              <AddOutlinedIcon />
                            </IconButton>
                          </box>
                        </div>
                        {/* -----   Add Campaigns Modal Start   ----- */}

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
                              borderRadius={"10px"}
                              textAlign={"center"}
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
                              >
                                Add Campaign
                              </Typography>
                              <Typography
                                id="transition-modal-description"
                                sx={{ mt: 2 }}
                                fontSize={"16px"}
                                color={"#000"}
                                paddingBottom={"10px"}
                              ></Typography>
                              <form style={{ textAlign: "center" }}>
                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Campaign Name"
                                  variant="outlined"
                                  padding={"0px 0 !important"}
                                  value={campaignName}
                                  onChange={(e) =>
                                    setCampaignName(e.target.value)
                                  }
                                />
                                <br />
                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Description"
                                  variant="outlined"
                                  value={description}
                                  onChange={(e) =>
                                    setDescription(e.target.value)
                                  }
                                />
                                <br />

                                <Button
                                  variant="contained"
                                  className="redirect_all_button_clr"
                                  color="primary"
                                  sx={{
                                    background: "#092b5f",
                                    marginTop: "20px",
                                  }}
                                  onClick={handleSubmit}
                                >
                                  save
                                </Button>
                              </form>
                            </Box>
                          </Fade>
                        </Modal>
                        {/* -----   Add Campaigns Modal End   ----- */}

                        {/* Delete Confirmation Modal Start  */}
                        <Dialog
                          open={alertMessage}
                          onClose={handleAlertClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                          sx={{ textAlign: "center" }}
                          //className="bg_imagess"
                        >
                          <DialogTitle
                            id="alert-dialog-title"
                            sx={{ color: "#07285d", fontWeight: "600" }}
                          >
                            {"Delete Confirmation"}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText
                              id="alert-dialog-description"
                              sx={{ paddingBottom: "0px !important" }}
                            >
                              Are you sure you want to delete {name} ?
                            </DialogContentText>
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
                              onClick={handleAlertClose}
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
                              onClick={handleDelete}
                              startIcon={<DeleteIcon />}
                            >
                              Delete
                            </Button>
                          </DialogActions>
                        </Dialog>
                        {/* Delete Confirmation Modal End  */}

                        <ThemeProvider theme={theme}>
                          <div style={{ height: "100%", width: "100%" }}>
                            <DataGrid
                              className="custom_header_redirect"
                              rows={mockDataTeam}
                              columns={columns}
                              density="compact"
                              // getRowClassName={(params) =>
                              //   isRowBordered(params)
                              //     ? "borderedGreen"
                              //     : "borderedRed"
                              // }
                              components={{ Toolbar: GridToolbar }}
                              slots={{
                                toolbar: CustomToolbar,
                              }}
                              autoHeight // Automatically adjust the height to fit all rows
                            />
                          </div>
                        </ThemeProvider>
                      </div>
                    </div>
                  </div>
                  {/* -----   Add Buyer Modal Start   ----- */}
                  <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={buyerOpen}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                      backdrop: {
                        timeout: 500,
                      },
                    }}
                    borderRadius={"10px"}
                  >
                    <Fade in={buyerOpen} className="bg_imagess">
                      <Box sx={style} borderRadius={"10px"}>
                        <IconButton
                          onClick={handleAddBuyerClose}
                          sx={{ float: "inline-end", borderRadius: "10px;" }}
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
                          textAlign={"center"}
                        >
                          Add Buyer
                        </Typography>
                        <Typography
                          id="transition-modal-description"
                          sx={{ mt: 2 }}
                          fontSize={"16px"}
                          color={"#000"}
                          paddingBottom={"10px"}
                          textAlign={"center"}
                        >
                          {/* A ring group is a set of destinations that can be called with a ring strategy. */}
                        </Typography>
                        <form style={{ textAlign: "center" }}>
                          <TextField
                            style={{ width: "100%", margin: " 5px 0 5px 0" }}
                            type="text"
                            label="Name"
                            variant="outlined"
                          />
                          <br />
                          <TextField
                            style={{ width: "100%", margin: " 5px 0 5px 0" }}
                            type="text"
                            label="DID/TFN Number"
                            variant="outlined"
                          />
                          <br />
                          <TextField
                            style={{ width: "100%", margin: " 5px 0 5px 0" }}
                            type="text"
                            label="Weightage"
                            variant="outlined"
                          />
                          <br />
                          <TextField
                            style={{ width: "100%", margin: " 5px 0 5px 0" }}
                            type="text"
                            label="Ringing Timeout"
                            variant="outlined"
                          />
                          <br />
                          <TextField
                            style={{ width: "100%", margin: " 5px 0 5px 0" }}
                            type="text"
                            label="Max Calls In A Day"
                            variant="outlined"
                          />
                          <br />
                          <TextField
                            style={{ width: "100%", margin: " 5px 0 5px 0" }}
                            type="text"
                            label="No CC (Concurrent Call)"
                            variant="outlined"
                          />
                          <br />

                          <Button
                            variant="contained"
                            className="redirect_all_button_clr"
                            color="primary"
                            sx={{
                              background: "#092b5f",
                              marginTop: "20px",
                            }}
                          >
                            save
                          </Button>
                        </form>
                      </Box>
                    </Fade>
                  </Modal>
                  {/* -----   Add Buyer Modal End   ----- */}
                  {/* ----------------------------------------------
                     ----------------------------------------------
                     ----------------------------------------------
                     ---------------------------------------------- */}
                  {/* -----   Edit Campaign Modal Start   ----- */}
                  <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={edit}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                      backdrop: {
                        timeout: 500,
                      },
                    }}
                  >
                    <Fade in={edit}>
                      <Box sx={style} borderRadius={"10px"}>
                        <IconButton
                          onClick={handleEditCampaignClose}
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
                          textAlign={"center"}
                        >
                          Update Campaign
                        </Typography>
                        <Typography
                          id="transition-modal-description"
                          sx={{ mt: 2 }}
                        ></Typography>
                        <form style={{ textAlign: "center" }}>
                          <TextField
                            style={{ width: "100%", margin: " 5px 0 5px 0" }}
                            type="text"
                            label="Campaign Name"
                            variant="outlined"
                            name="campaignName"
                            value={campaignName}
                            onChange={handleChange}
                          />
                          <br />
                          <TextField
                            style={{ width: "100%", margin: " 5px 0 5px 0" }}
                            type="text"
                            label="Description"
                            variant="outlined"
                            name="description"
                            value={description}
                            onChange={handleChange}
                          />
                          <br />

                          <Button
                            variant="contained"
                            className="redirect_all_button_clr"
                            color="primary"
                            sx={{
                              fontSize: "16px !impotant",
                              marginTop: "20px",
                              padding: "10px 20px !important",
                              textTransform: "capitalize !important",
                            }}
                            onClick={handleUpdate}
                          >
                            Update
                          </Button>
                        </form>
                      </Box>
                    </Fade>
                  </Modal>
                  {/* -----   Edit Campaign Modal End   ----- */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Campaigns;

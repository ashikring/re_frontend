import React, { useCallback, useEffect, useState } from "react";
import "../../../src/style.css";
import Backdrop from "@mui/material/Backdrop";
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
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
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
import {
  Delete,
  Edit,
  PlayArrow,
  Close,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createRedirectBuyer,
  deleteRedirectBuyer,
  getRedirectBuyer,
  updateRedirectBuyer,
} from "../../redux/actions/redirectPortal/redirectPortal_buyerAction";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { GET_REDIRECT_BUYER_SUCCESS } from "../../redux/constants/redirectPortal/redirectPortal_buyerConstants";
import { ThemeProvider } from "@mui/styles";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { makeStyles } from "@mui/styles";
import DeleteIcon from "@mui/icons-material/Delete";

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
  formControl: {
    "& .MuiInputBase-root": {
      color: "#666",
      borderColor: "transparent",
      borderWidth: "1px",
      borderStyle: "solid",
      height: "45px",
      minWidth: "120px",
      justifyContent: "center",
    },
    "& .MuiSelect-select.MuiSelect-select": {
      paddingRight: "0px",
    },
    "& .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root": {
      top: "-4px",
    },
  },
  select: {
    width: "auto",
    fontSize: "12px",
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
  selectIcon: {
    position: "relative",
    color: "#6EC177",
    fontSize: "14px",
  },
  paper: {
    borderRadius: 12,
    marginTop: 8,
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
    "& li": {
      fontWeight: 200,
      paddingTop: 8,
      paddingBottom: 8,
      fontSize: "12px",
    },
    "& li.Mui-selected": {
      color: "white",
      background: "#6EC177",
    },
    "& li.Mui-selected:hover": {
      background: "#6EC177",
    },
  },
});
// ============>

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 52,
  height: 31,
  padding: 0,
  borderRadius: "33px",
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 27,
    height: 27,
    // right: '0px',
    // position: 'relative',
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

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

function BuyerView() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [buyerOpen, setBuyerOpen] = useState(false);
  const [response, setResponse] = useState("");
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [buyerId, setBuyerId] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [status, setStatus] = useState("");
  const [forwardNumber, setForwardNumber] = useState("");
  const [cc, setCc] = useState("");
  const [weightage, setWeightage] = useState("");
  const [dailyLimit, setDailyLimit] = useState("");
  const [redirectId, setRedirectId] = useState("");
  const [deleteRow, setDeleteRow] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [followWorkTime, setFollowWorkTime] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const handleAddBuyerOpen = () => setOpen(true);
  const handleAddBuyerClose = () => {
    setOpen(false);
    setWeightage("");
    setForwardNumber("");
    setBuyerName("");
    setDailyLimit("");
    setCc("");
    setFromDate(null);
    setToDate(null);
  };
  const handleAlertClose = () => {
    setAlertMessage(false);
  };
  const handleEditrOpen = () => setEdit(true);
  const handleEditClose = () => {
    setEdit(false);
    setWeightage("");
    setForwardNumber("");
    setBuyerName("");
    setDailyLimit("");
    setCc("");
    setStatus("");
    setFromDate(null);
    setToDate(null);
    setFollowWorkTime(false);
  };

  const handleEdit = (data) => {
    handleEditrOpen();
    setForwardNumber(data?.forward_number);
    setBuyerName(data?.buyer_name);
    setCc(data?.cc);
    setWeightage(data?.weightage);
    setDailyLimit(data?.daily_limit);
    setStatus(data?.status);
    setBuyerId(data?.buyer_id);
    setRedirectId(data?.redirect_group_id);
    setFromDate(data.working_start_time);
    setToDate(data.working_end_time);
    setFollowWorkTime(data.follow_working_time === false ? "f" : "t");
  };

  const handleFromDateChange = (date) => {
    if (dayjs(date, "HH:mm", true).isValid()) {
      // Convert the selected date to the desired format before updating state
      setFromDate(dayjs(date).format("HH:mm"));
    } else {
      setFromDate(null);
    }
  };
  const handleToDateChange = (date) => {
    if (dayjs(date, "HH:mm", true).isValid()) {
      // Convert the selected date to the desired format before updating state
      setToDate(dayjs(date).format("HH:mm"));
    } else {
      setToDate(null);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "forwardNumber":
        const trimmedValue = value.trim();
        setForwardNumber(trimmedValue);
        break;
      case "buyerName":
        setBuyerName(value);
        break;
      case "dailyLimit":
        setDailyLimit(value);
        break;
      case "cc":
        setCc(value);
        break;
      case "weightage":
        setWeightage(value);
        break;
      case "status":
        setSelectedValue(value);
        break;

      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      redirect_group_id: location.state.data.campaignId,
      buyer_name: buyerName,
      forward_number: forwardNumber,
      cc: cc,
      weightage: weightage,
      daily_limit: dailyLimit,
      working_start_time: fromDate,
      working_end_time: toDate,
      follow_working_time: followWorkTime,
    });
    dispatch(createRedirectBuyer(data, setResponse, handleAddBuyerClose));
  };

  const handleMessage = useCallback(
    (data) => {
      setName(data?.buyer_name);
      setId(data?.buyer_id);
      setAlertMessage(true);
    },
    [setName]
  ); // Memoize event handler

  const handleDelete = useCallback(() => {
    dispatch(deleteRedirectBuyer(JSON.stringify({ id: id }), setResponse));
    setAlertMessage(false);
  }, [dispatch, setResponse, id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      id: buyerId,
      redirect_group_id: redirectId,
      buyer_name: buyerName,
      cc: cc,
      daily_limit: dailyLimit,
      forward_number: forwardNumber,
      status: status,
      weightage: weightage,
      working_start_time: fromDate,
      working_end_time: toDate,
      follow_working_time: followWorkTime,
    });
    dispatch(updateRedirectBuyer(data, handleEditClose, setResponse));
  };

  useEffect(() => {
    dispatch(getRedirectBuyer(location.state.data.campaignId));
  }, [location.state.data.campaignId, response]);

  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 100,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 140,
      renderCell: (params) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
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
    {
      field: "buyer_name",
      headerName: "Buyer Name",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 150,
      align: "center",
      renderCell: (params) => {
        const formattedDate = dayjs(params.row.createdAt).format(
          "DD MMM, YYYY"
        );
        return (
          <>
            <p style={{ margin: "0", lineHeight: "14px" }}>
              {params.row.buyer_name}
              <br />
              <i style={{ margin: "0", fontSize: "11px" }}>
                {" "}
                <b>Created: {formattedDate}</b>
              </i>
            </p>
          </>
        );
      },
    },
    // {
    //   field: "group_name",
    //   headerName: "Group Name",
    //   headerClassName: "custom-header",
    //   headerAlign: "center",
    //   width: 140,
    //   align: "center",
    // },
    {
      field: "username",
      headerName: "User Name",
      width: 100,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: (params) => {
        return (
          <>
            {params.row.status === true ? (
              <>
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{
                    color: "green",
                    border: "1px solid green",
                    padding: "5px 4.5px",
                    borderRadius: "5px",
                  }}
                >
                  Active
                </div>
              </>
            ) : (
              <>
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{
                    color: "red",
                    border: "1px solid red",
                    padding: "5px 4.5px",
                    borderRadius: "5px",
                  }}
                >
                  Deactive
                </div>
              </>
            )}
          </>
        );
      },
    },
    {
      field: "forward_number",
      headerName: "Forward Number",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 140,
      align: "center",
    },
    {
      field: "cc",
      headerName: "CC",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 50,
      align: "center",
    },
    {
      field: "current_cc",
      headerName: "Current CC",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 100,
      align: "center",
    },
    {
      field: "current_daily_limit",
      headerName: "Current Daily Limit",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 150,
      align: "center",
    },
    {
      field: "daily_limit",
      headerName: "Daily Limit",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 100,
      align: "center",
    },
    {
      field: "weightage",
      headerName: "Weightage",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 100,
      align: "center",
    },

    {
      field: "working_start_time",
      headerName: "Start Time",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 90,
      align: "center",
    },
    {
      field: "working_end_time",
      headerName: "End Time",
      width: 90,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },
  ];

  const mockDataTeam = [];
  state?.getRedirectBuyer?.RedirectBuyer?.data &&
    state?.getRedirectBuyer?.RedirectBuyer?.data?.forEach((item, index) => {
      mockDataTeam.push({
        id: index + 1,
        cc: item.cc,
        group_name: item.group_name,
        created_at: item.created_at,
        current_cc: item.current_cc,
        current_daily_limit: item.current_daily_limit,
        daily_limit: item.daily_limit,
        follow_working_time: item.follow_working_time,
        forward_number: item.forward_number,
        buyer_name: item.buyer_name,
        buyer_id: item.id,
        redirect_group_id: item.redirect_group_id,
        status: item.status,
        username: item.username,
        weightage: item.weightage,
        working_end_time: item.working_end_time,
        working_start_time: item.working_start_time,
      });
    });
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
                        {/* <div className="cntnt_title"> */}
                        <div
                          className="cntnt_title"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <h3 style={{ margin: "0px" }}>Buyer View</h3>

                          <FormGroup
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginRight: "30px",
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={1}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Typography style={{ fontSize: "15px" }}>
                                All
                              </Typography>
                              <FormControlLabel
                                control={<IOSSwitch defaultChecked />}
                              />
                              <Typography style={{ fontSize: "15px" }}>
                                Active
                              </Typography>
                            </Stack>
                          </FormGroup>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "end",
                            marginBottom: "40px",
                          }}
                        >
                          <p style={{ fontSize: "17px", color: "#000" }}>
                            <b className="fnt_bld"> Campaign Name:</b>{" "}
                            {location.state.data.group_name}
                          </p>

                          <div>
                            <IconButton
                              style={{
                                padding: "10px",
                                fontSize: "15px",
                                borderRadius: "5px",
                                border: "none",
                                //backgroundColor: "rgb(9, 56, 134)",
                                color: "#fff",
                                marginLeft: "auto",
                                marginRight: "30px",
                              }}
                              className="redirect_all_button_clr"
                              onClick={() => {
                                dispatch({
                                  type: GET_REDIRECT_BUYER_SUCCESS,
                                  payload: [],
                                });
                                navigate("/redirect_portal/campaigns");
                              }}
                            >
                              <ArrowBackIcon style={{ fontSize: "24px" }} />
                              {/* Back */}
                            </IconButton>

                            <IconButton
                              style={{
                                padding: "10px",
                                fontSize: "15px",
                                borderRadius: "5px",
                                border: "none",
                                //backgroundColor: "rgb(9, 56, 134)",
                                color: "#fff",
                                marginLeft: "auto",
                                marginRight: "30px",
                              }}
                              className="redirect_all_button_clr"
                              onClick={handleAddBuyerOpen}
                            >
                              Add Buyer
                              <AddOutlinedIcon />
                            </IconButton>
                          </div>
                        </div>
                        {/* </div> */}
                        {/* -----   Add Buyer Modal Start   ----- */}

                        <Modal
                          aria-labelledby="transition-modal-title"
                          aria-describedby="transition-modal-description"
                          open={open}
                          closeAfterTransition
                          slots={{ Backdrop: Backdrop }}
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
                                onClick={handleAddBuyerClose}
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
                                Add Buyer
                              </Typography>
                              <Typography
                                id="transition-modal-description"
                                sx={{ mt: 2 }}
                                fontSize={"16px"}
                                color={"#000"}
                                paddingBottom={"10px"}
                              >
                                {/* A ring group is a set of destinations that can
                                be called with a ring strategy. */}
                              </Typography>
                              <form
                                style={{
                                  textAlign: "center",
                                  height: "348px",
                                  overflow: "auto",
                                  paddingTop: "10px",
                                  padding: "5px",
                                  overflowX: "clip",
                                }}
                              >
                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Buyer Name"
                                  variant="outlined"
                                  name="buyerName"
                                  value={buyerName}
                                  onChange={(e) => {
                                    setBuyerName(e.target.value);
                                  }}
                                />
                                <br />
                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="number"
                                  label="Forword Number"
                                  variant="outlined"
                                  name="forwardNumber"
                                  value={forwardNumber}
                                  onChange={(e) => {
                                    setForwardNumber(e.target.value);
                                  }}
                                />
                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="CC (Concurrent Call)"
                                  variant="outlined"
                                  name="cc"
                                  value={cc}
                                  onChange={(e) => {
                                    setCc(e.target.value);
                                  }}
                                />

                                <br />
                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Weightage"
                                  variant="outlined"
                                  name="weightage"
                                  value={weightage}
                                  onChange={(e) => {
                                    setWeightage(e.target.value);
                                  }}
                                />
                                <br />
                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Daily Limit"
                                  variant="outlined"
                                  value={dailyLimit}
                                  onChange={(e) => {
                                    setDailyLimit(e.target.value);
                                  }}
                                />
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                  className={classes.formControl}
                                >
                                  <DemoContainer
                                    components={["TimePicker"]}
                                    sx={{ width: "100%" }}
                                  >
                                    <MobileTimePicker
                                      className="frm_date"
                                      label="Working Start Time"
                                      value={
                                        fromDate
                                          ? dayjs(fromDate, "HH:mm")
                                          : null
                                      }
                                      onChange={handleFromDateChange}
                                      renderInput={(props) => (
                                        <TextField
                                          {...props}
                                          style={{ width: "100%" }}
                                          InputProps={{
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <AccessTimeIcon />
                                              </InputAdornment>
                                            ),
                                          }}
                                        />
                                      )}
                                    />
                                  </DemoContainer>
                                </LocalizationProvider>

                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                  className={classes.formControl}
                                >
                                  <DemoContainer
                                    components={["TimePicker"]}
                                    sx={{ width: "100%" }}
                                  >
                                    <MobileTimePicker
                                      className="frm_date"
                                      label="Working End Time"
                                      value={
                                        toDate ? dayjs(toDate, "HH:mm") : null
                                      } // Convert selectedDate to a dayjs object
                                      onChange={handleToDateChange}
                                      renderInput={(props) => (
                                        <TextField
                                          {...props}
                                          style={{ width: "100%" }}
                                        /> // Ensures TextField takes full width
                                      )}
                                    />
                                  </DemoContainer>
                                </LocalizationProvider>
                              </form>
                              <Box>
                                <Button
                                  variant="contained"
                                  className="all_button_clr"
                                  color="primary"
                                  sx={{
                                    fontSize: "16px !impotant",
                                    background: "#092b5f",

                                    marginLeft: "10px !important",
                                    padding: "10px 20px !important",
                                    textTransform: "capitalize !important",
                                  }}
                                  onClick={handleSubmit}
                                >
                                  Save
                                </Button>
                              </Box>
                            </Box>
                          </Fade>
                        </Modal>
                        {/* -----   Add Buyer Modal End   ----- */}

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

                        {/* -----   Edit Modal Start   ----- */}

                        <Modal
                          aria-labelledby="transition-modal-title"
                          aria-describedby="transition-modal-description"
                          open={edit}
                          closeAfterTransition
                          slots={{ Backdrop: Backdrop }}
                          slotProps={{
                            backdrop: {
                              timeout: 500,
                            },
                          }}
                        >
                          <Fade in={edit} className="bg_imagess">
                            <Box
                              sx={style}
                              borderRadius={"10px"}
                              textAlign={"center"}
                            >
                              <IconButton
                                onClick={handleEditClose}
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
                                Update Buyer
                              </Typography>
                              <Typography
                                id="transition-modal-description"
                                sx={{ mt: 2 }}
                                fontSize={"16px"}
                                color={"#000"}
                                paddingBottom={"10px"}
                              >
                                {/* A ring group is a set of destinations that can
                                be called with a ring strategy. */}
                              </Typography>
                              <form
                                style={{
                                  textAlign: "center",
                                  height: "348px",
                                  overflow: "auto",
                                  paddingTop: "10px",
                                  padding: "5px",
                                  overflowX: "clip",
                                }}
                              >
                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Buyer Name"
                                  variant="outlined"
                                  name="buyerName"
                                  value={buyerName}
                                  onChange={handleChange}
                                />
                                <br />
                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Forword Number"
                                  variant="outlined"
                                  name="forwardNumber"
                                  value={forwardNumber}
                                  onChange={handleChange}
                                />
                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="CC (Concurrent Call)"
                                  variant="outlined"
                                  name="cc"
                                  value={cc}
                                  onChange={handleChange}
                                />

                                <br />
                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Weightage"
                                  variant="outlined"
                                  name="weightage"
                                  value={weightage}
                                  onChange={handleChange}
                                />
                                <br />
                                <TextField
                                  style={{
                                    width: "100%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Daily Limit"
                                  variant="outlined"
                                  name="dailyLimit"
                                  value={dailyLimit}
                                  onChange={handleChange}
                                />

                                <FormControl
                                  fullWidth
                                  style={{ margin: " 5px 0 5px 0" }}
                                >
                                  <InputLabel id="demo-simple-select-label">
                                    Status
                                  </InputLabel>
                                  <Select
                                    style={{ textAlign: "left" }}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={status}
                                    label="Status"
                                    onChange={(e) => setStatus(e.target.value)}
                                  >
                                    <MenuItem value={true}>Active</MenuItem>
                                    <MenuItem value={false}>Deactive</MenuItem>
                                  </Select>
                                </FormControl>

                                <FormControl
                                  fullWidth
                                  style={{ margin: " 5px 0 5px 0" }}
                                >
                                  <InputLabel id="demo-simple-select-label">
                                    Follow Work Time
                                  </InputLabel>
                                  <Select
                                    style={{ textAlign: "left" }}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Follow Work Time"
                                    value={followWorkTime}
                                    onChange={(e) =>
                                      setFollowWorkTime(e.target.value)
                                    }
                                  >
                                    <MenuItem value={"t"}>True</MenuItem>
                                    <MenuItem value={"f"}>False</MenuItem>
                                  </Select>
                                </FormControl>

                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                  className={classes.formControl}
                                >
                                  <DemoContainer
                                    components={["TimePicker"]}
                                    sx={{ width: "100%" }}
                                  >
                                    <MobileTimePicker
                                      className="frm_date"
                                      label="Working Start Time"
                                      value={
                                        fromDate
                                          ? dayjs(fromDate, "HH:mm")
                                          : null
                                      } // Convert selectedDate to a dayjs object
                                      onChange={handleFromDateChange}
                                      renderInput={(props) => (
                                        <TextField
                                          {...props}
                                          style={{ width: "100%" }}
                                        /> // Ensures TextField takes full width
                                      )}
                                    />
                                  </DemoContainer>
                                </LocalizationProvider>

                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                  className={classes.formControl}
                                >
                                  <DemoContainer
                                    components={["TimePicker"]}
                                    sx={{ width: "100%" }}
                                  >
                                    <MobileTimePicker
                                      className="frm_date"
                                      label="Working End Time"
                                      value={
                                        toDate ? dayjs(toDate, "HH:mm") : null
                                      } // Convert selectedDate to a dayjs object
                                      onChange={handleToDateChange}
                                      renderInput={(props) => (
                                        <TextField
                                          {...props}
                                          style={{ width: "100%" }}
                                        /> // Ensures TextField takes full width
                                      )}
                                    />
                                  </DemoContainer>
                                </LocalizationProvider>
                              </form>
                              <Box>
                                <Button
                                  variant="contained"
                                  className="all_button_clr"
                                  color="primary"
                                  sx={{
                                    fontSize: "16px !impotant",
                                    background: "#092b5f",

                                    marginLeft: "10px !important",
                                    padding: "10px 20px !important",
                                    textTransform: "capitalize !important",
                                  }}
                                  onClick={handleUpdate}
                                >
                                  Update
                                </Button>
                              </Box>
                            </Box>
                          </Fade>
                        </Modal>
                        {/* -----   Edit Modal End   ----- */}

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
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default BuyerView;
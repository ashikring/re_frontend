import React, { useCallback, useEffect, useState } from "react";
import "../../../src/style.css";
import Box from "@mui/material/Box";
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
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import {
  Edit,
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
import Menu from "@mui/material/Menu";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import axios from "axios";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { api } from "../../mockData";
import { toast } from "react-toastify";
import { StyledDataGrid } from "../../pages/CustomDataGrid";

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
// ---------------><-----------------

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
        density: "standard", // Set default density to standard
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
const InitialValues = {
  buyerId: "",
  buyerName: "",
  status: "",
  forwardNumber: "",
  cc: "",
  weightage: "",
  dailyLimit: "",
  redirectId: "",
  fromDate: null,
  toDate: null,
  followWorkTime: false,
  ringTimeout: 60,
};

function BuyerView({ userThem }) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [response, setResponse] = useState("");
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  const [campaignNumbers, setCampaignNumbers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isSwitchChecked, setIsSwitchChecked] = useState(false);
  const [buyerData, setBuyerData] = useState(InitialValues);

  const handleSwitchChange = (event) => {
    setIsSwitchChecked(event.target.checked);
  };

  const handleAddBuyerOpen = () => setOpen(true);
  const handleAddBuyerClose = () => {
    setOpen(false);
    setBuyerData({
      buyerId: "",
      buyerName: "",
      status: "",
      forwardNumber: "",
      cc: "",
      weightage: "",
      dailyLimit: "",
      redirectId: "",
      fromDate: null,
      toDate: null,
      followWorkTime: false,
      ringTimeout: 60,
    });
  };

  const handleAlertClose = () => {
    setAlertMessage(false);
  };

  const handleEditrOpen = () => setEdit(true);
  const handleEditClose = () => {
    setEdit(false);
    setBuyerData({
      buyerId: "",
      buyerName: "",
      status: "",
      forwardNumber: "",
      cc: "",
      weightage: "",
      dailyLimit: "",
      redirectId: "",
      fromDate: null,
      toDate: null,
      followWorkTime: false,
      ringTimeout: 60,
    });
  };

  const handleSelectionChange = (selection) => {
    setSelectedRows(selection);
  };

  const handleEdit = (data) => {
    handleEditrOpen();
    setBuyerData({
      buyerId: data?.buyer_id,
      buyerName: data?.buyer_name,
      status: data?.status,
      forwardNumber: data?.forward_number,
      cc: data?.cc,
      weightage: data?.weightage,
      dailyLimit: data?.daily_limit,
      redirectId: data?.redirect_group_id,
      fromDate: data.working_start_time,
      toDate: data.working_end_time,
      followWorkTime: data.follow_working_time === false ? "f" : "t",
      ringTimeout: data.ring_timeout,
    });
  };

  const handleFromDateChange = (date) => {
    if (dayjs(date, "HH:mm", true).isValid()) {
      setBuyerData((prevData) => ({
        ...prevData,
        fromDate: dayjs(date).format("HH:mm"),
      }));
    } else {
      setBuyerData((prevData) => ({
        ...prevData,
        fromDate: null,
      }));
    }
  };

  const handleToDateChange = (date) => {
    if (dayjs(date, "HH:mm", true).isValid()) {
      setBuyerData((prevData) => ({
        ...prevData,
        toDate: dayjs(date).format("HH:mm"),
      }));
    } else {
      setBuyerData((prevData) => ({
        ...prevData,
        toDate: null,
      }));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBuyerData((prevData) => ({
      ...prevData,
       [name]: name === "forwardNumber" ? value.trim() : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      redirect_group_id: location.state.data.campaignId,
      buyer_name: buyerData.buyerName,
      forward_number: buyerData.forwardNumber,
      cc: buyerData.cc,
      weightage: buyerData.weightage,
      daily_limit: buyerData.dailyLimit,
      working_start_time: buyerData.fromDate,
      working_end_time: buyerData.toDate,
      follow_working_time: buyerData.followWorkTime === false ? "f" : "t",
      ring_timeout: JSON.parse(buyerData.ringTimeout),
    });
    dispatch(createRedirectBuyer(data, setResponse, handleAddBuyerClose));
  };

  const handleMessage = useCallback(
    (data) => {
      setBuyerData((prevData) => ({
        ...prevData,
        buyerName: data?.buyer_name,
        buyerId: data?.buyer_id,
      }));
      setAlertMessage(true);
    },
    [setBuyerData]
  );

  const handleUpdate = (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      id: buyerData.buyerId,
      redirect_group_id: buyerData.redirectId,
      buyer_name: buyerData.buyerName,
      cc: buyerData.cc,
      daily_limit: buyerData.dailyLimit,
      forward_number: buyerData.forwardNumber,
      status: buyerData.status,
      weightage: buyerData.weightage,
      working_start_time: buyerData.fromDate,
      working_end_time: buyerData.toDate,
      follow_working_time: buyerData.followWorkTime,
      ring_timeout: JSON.parse(buyerData.ringTimeout),
    });
    dispatch(updateRedirectBuyer(data, handleEditClose, setResponse));
  };

  useEffect(() => {
    dispatch(getRedirectBuyer(location.state.data.campaignId));
  }, [location.state.data.campaignId, response]);

  useEffect(() => {
    const current_user = localStorage.getItem("current_user");
    const token = JSON.parse(localStorage.getItem(`user_${current_user}`));

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access_token} `,
        },
      };
      axios
        .get(
          `${api.dev}/api/getdidfromgroup?group_id=${location.state.data.campaignId}`,
          config
        )
        .then((res) => {
          setCampaignNumbers(res?.data?.data);
        });
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2500,
      });
    }
  }, []);

  const handleTrigger = (val) => {
    let data = JSON.stringify({
      id: val.buyer_id,
      status: val.status === true ? false : true,
      redirect_group_id: val?.redirect_group_id,
      buyer_name: val.buyer_name,
      cc: val.cc,
      daily_limit: val.daily_limit,
      forward_number: val.forward_number,
      weightage: val.weightage,
      working_start_time: val.working_start_time,
      working_end_time: val.working_end_time,
      follow_working_time: val.follow_working_time === false ? "f" : "t",
    });
    if (
      window.confirm(
        `Are you sure! Do you want to ${
          val.status === true ? "Deactive" : "Active"
        }`
      )
    ) {
      setResponse(data);
      dispatch(updateRedirectBuyer(data, setResponse));
    }
  };

  const columns = [
    {
      field: "action",
      headerName: "Action",
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 85,
      renderCell: (params) => (
        <div className="d-flex justify-content-between align-items-center">
          <Tooltip title="Edit" disableInteractive interactive>
            <IconButton onClick={() => handleEdit(params.row)}>
              <Edit
                index={params.row.id}
                style={{ cursor: "pointer", color: "#42765f" }}
              />
            </IconButton>
          </Tooltip>
          {params.row.status === true ? (
            <Tooltip title="Deactive" disableInteractive interactive>
              <IconButton onClick={() => handleTrigger(params.row)}>
                <PauseIcon style={{ cursor: "pointer", color: "#254336" }} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Active" disableInteractive interactive>
              <IconButton onClick={() => handleTrigger(params.row)}>
                <PlayArrowIcon
                  style={{ cursor: "pointer", color: "#ff7d00" }}
                />
              </IconButton>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      field: "buyer_name",
      headerName: "Buyer Name",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 150,
      align: "center",
      renderCell: (params) => {
        const formattedDate = dayjs(params.row.created_at).format(
          "DD MMM, YYYY"
        );
        return (
          <p style={{ margin: "0", lineHeight: "20px" }}>
            {params.row.buyer_name}
            <br />
            <i style={{ margin: "0", fontSize: "13px" }}>
              <b>Created: {formattedDate}</b>
            </i>
          </p>
        );
      },
    },
    {
      field: "forward_number",
      headerName: "Forward Number",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 150,
      align: "center",
      renderCell: ((params)=>{
        return(
          <span style={{fontWeight: "bold"}}>
            {params.row.forward_number}
          </span>
        )
      })
    },
    {
      field: "cc",
      headerName: "CC Limit",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 110,
      align: "center",
    },
    {
      field: "current_cc",
      headerName: "Live Calls",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 110,
      align: "center",
      renderCell: ((params)=>{
        return(
          <span style={{fontWeight: "bold"}}>
            {params.row.current_cc}
          </span>
        )
      })
    },
    {
      field: "daily_limit",
      headerName: "Daily Limit",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 110,
      align: "center",
    },
    {
      field: "current_daily_limit",
      headerName: "Current Daily Limit",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 165,
      align: "center",
      renderCell: ((params)=>{
        return(
          <span style={{fontWeight: "bold"}}>
            {params.row.current_daily_limit}
          </span>
        )
      })
    },
    {
      field: "weightage",
      headerName: "Weightage",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 110,
      align: "center",
    },
    {
      field: "ring_timeout",
      headerName: "Ring Timeout",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 120,
      align: "center",
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: (params) => (
        <Tooltip
          title={params.row.status === true ? "Active" : "Deactivated"}
          disableInteractive
          interactive
        >
          <div
            className="d-flex justify-content-between align-items-center"
            style={{
              color: params.row.status === true ? "#254336" : "#ff7d00",
              padding: "5px 4.5px",
              fontWeight: "bold"
            }}
          >
            {params.row.status === true ? "Active" : "Deactivated"}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "follow_working_time",
      headerName: "Follow Working Time",
      width: 170,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: (params) => (
        <div
          className="d-flex justify-content-between align-items-center"
          style={{
            color: params.row.follow_working_time === true ? "green" : "red",
            padding: "5px 4.5px",
          }}
        >
          {params.row.follow_working_time === true ? "Yes" : "No"}
        </div>
      ),
    },
    {
      field: "working_start_time",
      headerName: "Start Time",
      headerClassName: "custom-header",
      headerAlign: "center",
      width: 110,
      align: "center",
    },
    {
      field: "working_end_time",
      headerName: "End Time",
      width: 110,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },
  ];

  const mockDataTeam = [];
  state?.getRedirectBuyer?.RedirectBuyer?.data &&
    state?.getRedirectBuyer?.RedirectBuyer?.data?.forEach((item, index) => {
      if (isSwitchChecked ? item.status === true : true) {
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
          ring_timeout: item.ring_timeout,
        });
      }
    });

  const selectedCallerDataSet = new Set(); // Using Set to avoid duplicates

  selectedRows.forEach((id) => {
    const selectedRow = mockDataTeam.find((row) => row.id === id);
    if (selectedRow) {
      selectedCallerDataSet.add(selectedRow.buyer_id); // Add only buyer_id
    }
  });

  const selectedCallerData = Array.from(selectedCallerDataSet); // Convert to comma-separated string

  const handleDelete = useCallback(() => {
    dispatch(
      deleteRedirectBuyer(
        JSON.stringify({ id: selectedCallerData }),
        setResponse
      )
    );
    setAlertMessage(false);
    setSelectedRows([]);
  }, [dispatch, setResponse, setSelectedRows, selectedCallerData]);
  return (
    <>
      <div className={`App ${userThem} `}>
        <div className="contant_box">
          <div className="main">
            <section className="sidebar-sec">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="">
                      <div className="tab-content" id="pills-tabContent">
                        <div
                          className="tab-pane fade show active"
                          id="pills-home"
                          role="tabpanel"
                          aria-labelledby="pills-home-tab"
                        >
                          <div className="tab_cntnt_box">
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
                                    control={
                                      <IOSSwitch
                                        defaultChecked
                                        checked={isSwitchChecked}
                                        onChange={handleSwitchChange}
                                      />
                                    }
                                  />
                                  <Typography style={{ fontSize: "15px" }}>
                                    Active
                                  </Typography>
                                </Stack>
                              </FormGroup>
                            </div>

                            <div className="d-xxl-block d-xl-block d-lg-block d-md-block d-sm-block d-block">
                              <div className="d-flex justify-content-between">
                                {/* <IconButton
                                  style={{
                                    padding: "10px",
                                    fontSize: "15px",
                                    borderRadius: "5px",
                                    border: "none",
                                    color: "#fff",
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
                                </IconButton> */}

<div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "end",
                                marginBottom: "10px",
                              }}
                            >
                              <p style={{ fontSize: "17px", color: "#000" }}>
                                <b className="fnt_bld"> Campaign Name:</b>{" "}
                                {location.state.data.group_name}
                                {campaignNumbers[0] ? (
                                  <>
                                    <PopupState
                                      variant="popover"
                                      popupId="demo-popup-menu"
                                      className="d-xxl-block d-xl-block d-lg-block d-md-block d-sm-none d-none"
                                    >
                                      {(popupState) => (
                                        <React.Fragment>
                                          <Button
                                            variant="contained"
                                            {...bindTrigger(popupState)}
                                            className="mt-lg-0 mt-md-0 mt-sm-2 mt-2 ms-xxl-3 ms-xl-3 ms-lg-3 ms-md-3 ms-sm-0 ms-0"
                                            endIcon={<KeyboardArrowDownIcon />}
                                            style={{
                                              marginLeft: "0px",
                                              background: "transparent",
                                              color: "black",
                                            }}
                                          >
                                            Campaign Number
                                          </Button>
                                          <Menu {...bindMenu(popupState)}>
                                            {campaignNumbers?.map(
                                              (item, index) => (
                                                <MenuItem
                                                  key={index}
                                                  style={{
                                                    cursor: "context-menu",
                                                  }}
                                                >
                                                  {item}
                                                </MenuItem>
                                              )
                                            )}
                                          </Menu>
                                        </React.Fragment>
                                      )}
                                    </PopupState>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </p>

                            
                            </div>


                                <div>
                                <IconButton
                                  style={{
                                    padding: "10px",
                                    fontSize: "15px",
                                    borderRadius: "5px",
                                    border: "none",
                                    color: "#fff",
                                    marginRight: "0px",
                                  }}
                                  className="redirect_all_button_clr "
                                  onClick={handleAddBuyerOpen}
                                >
                                  Add
                                  <AddOutlinedIcon />
                                </IconButton>
                                </div>

                               
                              </div>
                            </div>

                           
                            <Dialog
                              open={open}
                              onClose={handleAddBuyerClose}
                              sx={{ textAlign: "center" }}
                            >
                              <Box>
                                <IconButton
                                  onClick={handleAddBuyerClose}
                                  sx={{
                                    float: "inline-end",
                                    display: "flex",
                                    justifyContent: "end",
                                    margin: "10px 10px 0px 0px",
                                  }}
                                >
                                  <Close />
                                </IconButton>
                              </Box>
                              <DialogTitle
                                className="modal_heading"
                                sx={{
                                  color: "#133325",
                                  fontWeight: "600",
                                  width: "500px",
                                }}
                              >
                                Add Buyer
                              </DialogTitle>

                              <DialogContent>
                                <form>
                                  <form
                                    style={{
                                      textAlign: "center",
                                      height: "348px",
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
                                      label="Buyer Name"
                                      variant="outlined"
                                      name="buyerName"
                                      value={buyerData.buyerName}
                                      onChange={(e) => {
                                        setBuyerData((prevData) => ({
                                          ...prevData,
                                          buyerName: e.target.value,
                                        }));
                                      }}
                                    />
                                    <br />
                                    <TextField
                                      style={{
                                        width: "100%",
                                        margin: " 5px 0 5px 0",
                                      }}
                                      type="text"
                                      label="Forward Number"
                                      variant="outlined"
                                      name="forwardNumber"
                                      value={buyerData.forwardNumber}
                                      onChange={(e) => {
                                        const numericValue =
                                          e.target.value.replace(/[^0-9]/g, "");
                                        setBuyerData((prevData) => ({
                                          ...prevData,
                                          forwardNumber: numericValue,
                                        }));
                                      }}
                                      inputProps={{
                                        inputMode: "numeric",
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
                                      value={buyerData.cc}
                                      onChange={(e) => {
                                        setBuyerData((prevData) => ({
                                          ...prevData,
                                          cc: e.target.value,
                                        }));
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
                                      value={buyerData.weightage}
                                      onChange={(e) => {
                                        setBuyerData((prevData) => ({
                                          ...prevData,
                                          weightage: e.target.value,
                                        }));
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
                                      value={buyerData.dailyLimit}
                                      onChange={(e) => {
                                        setBuyerData((prevData) => ({
                                          ...prevData,
                                          dailyLimit: e.target.value,
                                        }));
                                      }}
                                    />
                                    <TextField
                                      style={{
                                        width: "100%",
                                        margin: "7px 0",
                                      }}
                                      type="text"
                                      label="Ring Timeout"
                                      variant="outlined"
                                      name="tfnNumber"
                                      value={buyerData.ringTimeout}
                                      onChange={(e) => {
                                        const numericValue =
                                          e.target.value.replace(/[^0-9]/g, "");
                                        setBuyerData((prevData) => ({
                                          ...prevData,
                                          ringTimeout: numericValue,
                                        }));
                                      }}
                                      inputProps={{
                                        inputMode: "numeric",
                                        // pattern: '[0-9]*',
                                      }}
                                    />
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
                                        value={buyerData.followWorkTime}
                                        onChange={(e) =>
                                          setBuyerData((prevData) => ({
                                            ...prevData,
                                            followWorkTime: e.target.value,
                                          }))
                                        }
                                      >
                                        <MenuItem value={true}>Yes</MenuItem>
                                        <MenuItem value={false}>No</MenuItem>
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
                                            buyerData.fromDate
                                              ? dayjs(
                                                  buyerData.fromDate,
                                                  "HH:mm"
                                                )
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
                                            buyerData.toDate
                                              ? dayjs(buyerData.toDate, "HH:mm")
                                              : null
                                          }
                                          onChange={handleToDateChange}
                                          renderInput={(props) => (
                                            <TextField
                                              {...props}
                                              style={{ width: "100%" }}
                                            />
                                          )}
                                        />
                                      </DemoContainer>
                                    </LocalizationProvider>
                                  </form>
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
                              </DialogActions>
                            </Dialog>

                            <Dialog
                              open={alertMessage}
                              onClose={handleAlertClose}
                              aria-labelledby="alert-dialog-title"
                              aria-describedby="alert-dialog-description"
                              sx={{ textAlign: "center" }}
                            >
                              <DialogTitle
                                id="alert-dialog-title"
                                sx={{ color: "#133325", fontWeight: "600" }}
                              >
                                {"Delete Confirmation"}
                              </DialogTitle>
                              <DialogContent>
                                <DialogContentText
                                  id="alert-dialog-description"
                                  sx={{ paddingBottom: "0px !important" }}
                                >
                                  Are you sure you want to delete{" "}
                                  {buyerData.buyerName} ?
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

                            <Dialog
                              open={edit}
                              onClose={handleEditClose}
                              sx={{ textAlign: "center" }}
                            >
                              <Box>
                                <IconButton
                                  onClick={handleEditClose}
                                  sx={{
                                    float: "inline-end",
                                    display: "flex",
                                    justifyContent: "end",
                                    margin: "10px 10px 0px 0px",
                                  }}
                                >
                                  <Close />
                                </IconButton>
                              </Box>
                              <DialogTitle
                                className="modal_heading"
                                sx={{
                                  color: "#133325",
                                  fontWeight: "600",
                                  width: "500px",
                                }}
                              >
                                Update Buyer
                              </DialogTitle>

                              <DialogContent>
                                <form>
                                  <form
                                    style={{
                                      textAlign: "center",
                                      height: "348px",
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
                                      label="Buyer Name"
                                      variant="outlined"
                                      name="buyerName"
                                      value={buyerData.buyerName}
                                      onChange={handleChange}
                                    />
                                    <br />
                                    <TextField
                                      style={{
                                        width: "100%",
                                        margin: " 5px 0 5px 0",
                                      }}
                                      type="text"
                                      label="Forward Number"
                                      variant="outlined"
                                      name="forwardNumber"
                                      value={buyerData.forwardNumber}
                                      onChange={(e) => {
                                        const numericValue =
                                          e.target.value.replace(/[^0-9]/g, "");
                                        setBuyerData((prevData) => ({
                                          ...prevData,
                                          forwardNumber: numericValue,
                                        }));
                                      }}
                                      inputProps={{
                                        inputMode: "numeric",
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
                                      value={buyerData.cc}
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
                                      value={buyerData.weightage}
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
                                      value={buyerData.dailyLimit}
                                      onChange={handleChange}
                                    />
                                    <TextField
                                      style={{
                                        width: "100%",
                                        margin: "7px 0",
                                      }}
                                      type="text"
                                      label="Ring Timeout"
                                      variant="outlined"
                                      name="tfnNumber"
                                      value={buyerData.ringTimeout}
                                      onChange={(e) => {
                                        const numericValue =
                                          e.target.value.replace(/[^0-9]/g, "");
                                        setBuyerData((prevData) => ({
                                          ...prevData,
                                          ringTimeout: numericValue,
                                        }));
                                      }}
                                      inputProps={{
                                        inputMode: "numeric",
                                        // pattern: '[0-9]*',
                                      }}
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
                                        value={buyerData.status}
                                        label="Status"
                                        onChange={(e) =>
                                          setBuyerData((prevData) => ({
                                            ...prevData,
                                            status: e.target.value,
                                          }))
                                        }
                                      >
                                        <MenuItem value={true}>Active</MenuItem>
                                        <MenuItem value={false}>
                                          Deactive
                                        </MenuItem>
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
                                        value={buyerData.followWorkTime}
                                        onChange={(e) =>
                                          setBuyerData((prevData) => ({
                                            ...prevData,
                                            followWorkTime: e.target.value,
                                          }))
                                        }
                                      >
                                        <MenuItem value={"t"}>Yes</MenuItem>
                                        <MenuItem value={"f"}>No</MenuItem>
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
                                            buyerData.fromDate
                                              ? dayjs()
                                                  .hour(
                                                    parseInt(
                                                      buyerData.fromDate.split(
                                                        ":"
                                                      )[0],
                                                      10
                                                    )
                                                  )
                                                  .minute(
                                                    parseInt(
                                                      buyerData.fromDate.split(
                                                        ":"
                                                      )[1],
                                                      10
                                                    )
                                                  )
                                                  .second(0)
                                              : null
                                          }
                                          onChange={handleFromDateChange}
                                          renderInput={(props) => (
                                            <TextField
                                              {...props}
                                              style={{ width: "100%" }}
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
                                            buyerData.toDate
                                              ? dayjs()
                                                  .hour(
                                                    parseInt(
                                                      buyerData.toDate.split(
                                                        ":"
                                                      )[0],
                                                      10
                                                    )
                                                  )
                                                  .minute(
                                                    parseInt(
                                                      buyerData.toDate.split(
                                                        ":"
                                                      )[1],
                                                      10
                                                    )
                                                  )
                                                  .second(0)
                                              : null
                                          }
                                          onChange={handleToDateChange}
                                          renderInput={(props) => (
                                            <TextField
                                              {...props}
                                              style={{ width: "100%" }}
                                            />
                                          )}
                                        />
                                      </DemoContainer>
                                    </LocalizationProvider>
                                  </form>
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
                              </DialogActions>
                            </Dialog>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <IconButton
                                className="filter_block_btn"
                                style={{
                                  marginLeft: "0 !important",
                                  background: selectedCallerData.length
                                    ? "red"
                                    : "grey",
                                  padding: "6px 10px !important",
                                  fontSize: "15px !important",
                                  marginBottom: "0.8rem",
                                }}
                                disabled={selectedCallerData.length === 0}
                                onClick={handleMessage}
                              >
                                Delete &nbsp;
                                <DeleteIcon />
                              </IconButton>
                            </div>

                            <ThemeProvider theme={theme}>
                              <div style={{ height: "100%", width: "100%" }}>
                                <StyledDataGrid
                                  className="custom_header_redirect"
                                  rows={mockDataTeam}
                                  columns={columns}
                                  density="standard"
                                  checkboxSelection
                                  disableRowSelectionOnClick
                                  rowSelectionModel={selectedRows}
                                  onRowSelectionModelChange={
                                    handleSelectionChange
                                  }
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
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default BuyerView;

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SearchIcon from "@mui/icons-material/Search";
import BlockIcon from "@mui/icons-material/Block";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  Modal,
  TextField,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  CircularProgress,
  Tooltip,
  InputAdornment,
  Grid,
  FormControlLabel,
  RadioGroup,
  Radio,
  useMediaQuery,
  Popover,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
//import Frm from '../../pages/Frm';
import { useDispatch, useSelector } from "react-redux";
import { createBlockReport, getReport } from "../../redux/actions/reportAction";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "../../Switcher.scss";
import Datetime from "react-datetime";
import { makeStyles } from "@mui/styles";
import dayjs from "dayjs";
import { getAllUsers } from "../../redux/actions/userAction";
import { getAdminUsersList } from "../../redux/actions/adminPortal_listAction";
import { DateTimePicker } from "@mui/x-date-pickers";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { StyledDataGrid } from "../../pages/CustomDataGrid";
import { callStatusMessages } from "../../pages/Tooltips";

dayjs.extend(utc);
dayjs.extend(timezone);
const drawerWidth = 240;

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
      height: "50px !important",
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
        exportButton: true,
      },
    },
  },
});

const array = [
  "TFN_SUSPENDED",
  "SERVER_DOWN",
  "CALLER_ABANDONED",
  "CALL_TRANSFERED",
  "CALL_ANSWER",
  "TFN_USER_NOT_ACTIVE",
  "CALLERID_BLOCKED_BY_USER",
  "UNABLE_TO_JOIN_QUEUE",
  "DESTINATION_BUSY",
  "NOT_SUFFICIENT_FUNDS",
  "TFN_NOT_ACTIVE",
  "TRIED_ALL_CARRIER_NO_SUCCESS",
  "NORMAL_HANGUP",
  "DESTINATION_FAILED",
  "USER_NOT_FOUND",
  "TFN_USER_SUSPENDED",
  "NO_ANSWER",
  "CONGESTION",
  "DESTINATION_CONGESTION",
  "ANSWERED",
  "FASTAGI_DOWN",
];

// =====Start Items====>

// =====End Items====>

function AdminReport({ colorThem }) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [currentAudio, setCurrentAudio] = useState(null);
  const [userId, setUserId] = useState("");
  const [callDirection, setCallDirection] = useState("");
  const [didNumber, setDidNumber] = useState("");
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState("");
  const [response, setResponse] = useState("");
  const [callerId, setCallerId] = useState("");
  const [extension, setExtension] = useState("");
  const audioRefs = useRef({}); // Store references to audio elements
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [radioValue, setRadioValue] = useState("n");

  // Get today's date with time set to 00:00
  const getTodayWithMidnight = () => dayjs().startOf("day").toDate();
  // Get today's date with 23:59 time
  const getTodayWithEndOfDay = () =>
    dayjs().endOf("day").format("DD/MM/YYYY HH:mm");

  // Use this in your state
  const [toDate, setToDate] = useState(getTodayWithEndOfDay());
  const [fromDate, setFromDate] = useState(getTodayWithMidnight());

  // Disable past dates for `toDate`
  const disablePastDates = (current) => {
    return current.isSameOrAfter(dayjs().startOf("day"));
  };

  // Disable future dates for `fromDate`
  const disableFutureDates = (current) => {
    return current.isSameOrBefore(dayjs().endOf("day"));
  };

  const handleFromDateChange = (date) => {
    if (date) {
      const formattedDate = dayjs(date).format("DD/MM/YYYY HH:mm");
      setFromDate(date);
    }
  };

  const handleToDateChange = (date) => {
    if (date) {
      const formattedDate = dayjs(date).format("DD/MM/YYYY HH:mm");
      setToDate(date);
    }
  };

  const handleSelectionChange = (selection) => {
    setSelectedRows(selection);
  };

  const classes = useStyles();
  useEffect(() => {
    let data = JSON.stringify({
      from_date: dayjs(fromDate).isValid()
        ? dayjs(fromDate).format("YYYY-MM-DD HH:mm")
        : "",
      to_date: dayjs(toDate).isValid()
        ? dayjs(toDate).format("YYYY-MM-DD HH:mm")
        : "",
    });
    dispatch(getReport(data));
    dispatch(getAllUsers(""));
    dispatch(getAdminUsersList());
  }, [dispatch, response]);

  useMemo(() => {
    if (state?.getAdminUsersList?.userList) {
      const usersArray = Object.keys(state?.getAdminUsersList?.userList)?.map(
        (key) => ({
          user_id: key,
          username: state?.getAdminUsersList?.userList[key],
        })
      );
      setUsers(usersArray);
    }
  }, [state?.getAdminUsersList?.userList]);

  const handleSearch = (e) => {
    let data = JSON.stringify({
      caller_id: callerId,
      user_id: userId,
      from_date: dayjs(fromDate).isValid()
        ? dayjs(fromDate).format("YYYY-MM-DD HH:mm")
        : "",
      to_date: dayjs(toDate).isValid()
        ? dayjs(toDate).format("YYYY-MM-DD HH:mm")
        : "",
      call_direction: callDirection,
      didnumber: didNumber,
      forward_number: destination,
      hangup_reason: status,
      extension: extension,
    });
    dispatch(getReport(data));
  };

  const handleReset = (e) => {
    setFromDate(getTodayWithMidnight());
    setToDate(getTodayWithEndOfDay());
    setUserId("");
    setCallDirection("");
    setDidNumber("");
    setDestination("");
    setResponse("data");
    setExtension("");
    setCallerId("");
    setStatus("");
  };

  // Function to handle audio clicks
  const handleAudioClick = (audioSrc) => {
    const audio = audioRefs.current[audioSrc];
    // const audio = document.getElementById(audioSrc);
    // Check if the clicked audio is already the current audio
    if (currentAudio === audio) {
      // Toggle play/pause
      if (audio.pause) {
        audio.play();
      } else {
        audio.pause();
      }
    } else {
      // If a different audio is clicked, pause the current audio (if any) and play the new one
      if (currentAudio) {
        currentAudio.pause();
      }
      setCurrentAudio(audio);
      audio.play();
    }
  };

  const handleAudioPause = () => {
    //  setCurrentAudio(null);
  };

  const handleDownload = (recordingPath) => {
    // You can implement download logic here
    // For example, create a link with the recording path and click it programmatically
    const link = document.createElement("a");
    link.href = recordingPath;
    link.download = recordingPath.split("/").pop(); // Set filename to the last part of the path
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusMessage = (key) => {
    const status = callStatusMessages.find((item) => item.key === key);
    return status ? status.value : "Unknown Status";
  };

  const CallStatusTooltip = ({ statusKey }) => {
    const isMobile = useMediaQuery("(max-width:600px)"); // Detect mobile
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      if (isMobile) {
        setAnchorEl(event.currentTarget); // Open Popover on click
      }
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <>
        {isMobile ? (
          <>
            {/* Clickable text for mobile */}
            <span
              onClick={handleClick}
              style={{
                fontSize: "14px",
                color: "#1976d2",
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "120px",
              }}
            >
              {statusKey}
            </span>

            {/* Popover for Mobile */}
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <Typography sx={{ p: 2, maxWidth: "200px", fontSize: "12px" }}>
                {getStatusMessage(statusKey)}
              </Typography>
            </Popover>
          </>
        ) : (
          // Tooltip for Desktop
          <Tooltip title={getStatusMessage(statusKey)} arrow>
            <span
              style={{
                fontSize: "14px",
                color: "#1976d2",
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "200px",
              }}
            >
              {statusKey}
            </span>
          </Tooltip>
        )}
      </>
    );
  };

  const columns = [
    {
      field: "username",
      headerName: "Username",
      headerClassName: "custom-header",
      width: 120,
      headerAlign: "center",
      align: "center",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "caller_id_number",
      headerName: "Caller ID",
      headerClassName: "custom-header",
      width: 120,
      headerAlign: "center",
      align: "center",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "did_tfn",
      headerName: "DID Number",
      width: 130,
      //cellClassName: "name-column--cell",
      //headerClassName: 'super-app-theme--header'
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      // editable: true
    },
    {
      field: "forwarded_number",
      headerName: "Forwarded Number",
      width: 130,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "hangup_reason",
      headerName: "Status",
      width: 250,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: (params) => <CallStatusTooltip statusKey={params.value} />,
    },
    {
      field: "call_status",
      headerName: "Call Status",
      width: 150,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: (params) => {
        return (
          <>
            <span>
              {params.row.call_status === "ANSWERED" ? (
                <span style={{ color: "green" }}>{params.row.call_status}</span>
              ) : (
                <span style={{ color: "red" }}>{params.row.call_status}</span>
              )}
            </span>
          </>
        );
      },
    },
    {
      field: "buyer_name",
      headerName: "Buyer Name",
      width: 120,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
    },
    {
      field: "campaign_name",
      headerName: "Campaign Name",
      width: 150,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },

    // {
    //   field: "destination",
    //   headerName: "Destination",
    //   width: 150,
    //   headerClassName: "custom-header",
    //   headerAlign: "center",
    //   align: "center",
    // },
    {
      field: "duration",
      headerName: "Duration",
      width: 100,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
    },
    {
      field: "billsec",
      headerName: "Bill Sec",
      width: 85,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
    },
    {
      field: "used_minutes",
      headerName: "Used Minutes",
      width: 135,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
    },

    {
      field: "recording_path",
      headerName: "Recording",
      width: 380,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: (params) => {
        if (params.row.billsec >= 0) {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <audio
                ref={(audio) =>
                  (audioRefs.current[params.row.recording_path] = audio)
                }
                id={params.row.recording_path}
                src={params.row.recording_path}
                controls
                controlsList="download"
                onPlay={() => handleAudioClick(params.row.recording_path)}
                onPause={handleAudioPause}
                style={{ padding: "10px" }}
              />

              {/* <IconButton onClick={() => handleDownload(params.row.recording_path)}>
          <GetAppIcon />
        </IconButton> */}
            </div>
          );
        } else {
          return <></>;
        }
      },
    },
    // {
    //   field: "answered_by",
    //   headerName: "Answered By",
    //   width: 130,
    //   headerAlign: "center",
    //   align: "center",
    //   headerClassName: "custom-header",
    // },
    // {
    //   field: "transfered_to",
    //   headerName: "Transfered",
    //   width: 130,
    //   headerAlign: "center",
    //   align: "center",
    //   headerClassName: "custom-header",
    // },
    // {
    //   field: "disposition",
    //   headerName: "Status",
    //   width: 120,
    //   headerAlign: "center",
    //   align: "center",
    //   headerClassName: "custom-header",
    //   renderCell: (params) => {
    //     return (
    //       <div className="d-flex justify-content-between align-items-center">
    //         {params.row.disposition === "ANSWERED" ? (
    //           <>
    //             <div
    //               style={{
    //                 color: "white",
    //                 background: "green",
    //                 padding: "7px",
    //                 borderRadius: "5px",
    //                 fontSize: "12px",
    //                 textTransform: "capitalize",
    //               }}
    //             >
    //               {params.row.disposition.toString().toLowerCase()}
    //             </div>
    //           </>
    //         ) : (
    //           <>
    //             <div
    //               style={{
    //                 color: "white",
    //                 background: "red",
    //                 padding: "7px",
    //                 borderRadius: "5px",
    //                 fontSize: "12px",
    //                 textTransform: "capitalize",
    //               }}
    //             >
    //               {params.row.disposition.toString().toLowerCase()}
    //             </div>
    //           </>
    //         )}
    //       </div>
    //     );
    //   },
    //   //  cellClassName: 'super-app-theme--cell',
    // },

    {
      field: "answer_at",
      headerName: "Call Answer Time",
      width: 160,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      //valueFormatter
      renderCell: (params) => {
        if (params.value !== null) {
          const date = new Date(params.value);
          var day = date.getUTCDate();
          var month = date.getUTCMonth() + 1; // Month starts from 0
          var year = date.getUTCFullYear();
          var hours = date.getUTCHours();
          var minutes = date.getUTCMinutes();
          var seconds = date.getUTCSeconds();

          // Formatting single-digit day/month with leading zero if needed
          day = (day < 10 ? "0" : "") + day;
          month = (month < 10 ? "0" : "") + month;

          // Formatting single-digit hours/minutes/seconds with leading zero if needed
          hours = (hours < 10 ? "0" : "") + hours;
          minutes = (minutes < 10 ? "0" : "") + minutes;
          seconds = (seconds < 10 ? "0" : "") + seconds;
          return (
            <>
              <span style={{ color: "blue" }}>
                {day}/{month}/{year}
              </span>
              &nbsp;
              <span style={{ color: "green" }}>
                {hours}:{minutes}:{seconds}
              </span>
            </>
          );
        }
      },
    },

    {
      field: "start_at",
      headerName: "Call Start Time",
      width: 160,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: (params) => {
        if (params.value !== null) {
          const date = new Date(params.value);
          var day = date.getUTCDate();
          var month = date.getUTCMonth() + 1; // Month starts from 0
          var year = date.getUTCFullYear();
          var hours = date.getUTCHours();
          var minutes = date.getUTCMinutes();
          var seconds = date.getUTCSeconds();

          // Formatting single-digit day/month with leading zero if needed
          day = (day < 10 ? "0" : "") + day;
          month = (month < 10 ? "0" : "") + month;

          // Formatting single-digit hours/minutes/seconds with leading zero if needed
          hours = (hours < 10 ? "0" : "") + hours;
          minutes = (minutes < 10 ? "0" : "") + minutes;
          seconds = (seconds < 10 ? "0" : "") + seconds;
          return (
            <>
              <span style={{ color: "blue" }}>
                {day}/{month}/{year}
              </span>
              &nbsp;
              <span style={{ color: "green" }}>
                {hours}:{minutes}:{seconds}
              </span>
            </>
          );
        }
      },
    },

    {
      field: "end_at",
      headerName: "Call End Time",
      width: 160,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
      renderCell: (params) => {
        if (params.value !== null) {
          const date = new Date(params.value);
          var day = date.getUTCDate();
          var month = date.getUTCMonth() + 1; // Month starts from 0
          var year = date.getUTCFullYear();
          var hours = date.getUTCHours();
          var minutes = date.getUTCMinutes();
          var seconds = date.getUTCSeconds();

          // Formatting single-digit day/month with leading zero if needed
          day = (day < 10 ? "0" : "") + day;
          month = (month < 10 ? "0" : "") + month;

          // Formatting single-digit hours/minutes/seconds with leading zero if needed
          hours = (hours < 10 ? "0" : "") + hours;
          minutes = (minutes < 10 ? "0" : "") + minutes;
          seconds = (seconds < 10 ? "0" : "") + seconds;

          return (
            <>
              <span style={{ color: "blue" }}>
                {day}/{month}/{year}
              </span>
              &nbsp;
              <span style={{ color: "green" }}>
                {hours}:{minutes}:{seconds}
              </span>
            </>
          );
        }
      },
    },

    {
      field: "incoming",
      headerName: "Incoming",
      width: 175,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
    },
    {
      field: "outgoing",
      headerName: "Outgoing",
      width: 265,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
    },
    {
      field: "hangupsource",
      headerName: "Hangup Source",
      width: 215,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
    },

    {
      field: "uniqueid",
      headerName: "Unique Id",
      width: 180,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
    },
  ];

  const rows = [];
  state?.report?.report?.data &&
    state?.report?.report?.data?.forEach((item, index) => {
      rows.push({
        id: index + 1,
        did_tfn: item.did_number,
        buyer_name: item.buyer_name,
        uniqueid: item.uniqueid,
        caller_id_number: item.src,
        user_uuid: item?.user_uuid,
        call_direction: item?.call_direction,
        disposition: item?.disposition,
        duration: item?.duration,
        billsec: item?.billsec,
        answer_at: item.answer_at,
        time: item.answer_at,
        end_at: item.end_at,
        start_at: item.start_at,
        start_time: item.start_at,
        end_at: item.end_at,
        recording_path: item.recording_path,
        hangup_reason: item.status,
        call_status: item.call_status,
        campaign_name: item.campaign_name,
        destination: item.destination,
        username: item.username,
        answered_by: item.answered_by,
        transfered_to: item.transfered_to,
        forwarded_number: item.forwarded_number,
        used_minutes: item.used_minutes,
        incoming: item.incoming,
        outgoing: item.outgoing,
        hangupsource: item.hangupsource,
      });
    });

  const selectedCallerDataMap = new Map();

  selectedRows.forEach((id) => {
    const selectedRow = rows.find((row) => row.id === id);
    if (selectedRow) {
      const userId = selectedRow.user_uuid;
      if (!selectedCallerDataMap.has(userId)) {
        selectedCallerDataMap.set(userId, {
          type: "CallerID",
          details: [],
          description: "Report",
          user_id: JSON.stringify(userId),
          is_active: true,
        });
      }
      const data = selectedCallerDataMap.get(userId);
      if (!data.details.includes(selectedRow.caller_id_number)) {
        data.details.push(selectedRow.caller_id_number);
      }
    }
  });

  const selectedCallerData = Array.from(selectedCallerDataMap.values());

  const handleBlockCallerIds = () => {
    dispatch(createBlockReport(JSON.stringify(selectedCallerData)));
  };

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

                        <div
                          className="cntnt_title"
                          // style={{
                          //   display: "flex",
                          //   justifyContent: "space-between",
                          //   alignItems: "end",
                          // }}
                        >
                          <div className="col-12">
                            <h3>call details records</h3>
                          </div>
                        </div>

                        <Grid
                          container
                          className="cdr_filter_row"
                          style={{ padding: "20px 0" }}
                        >
                          <Grid
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <FormControl
                              fullWidth
                              style={{ width: "98%", margin: "7px 0" }}
                              className={classes.formControl}
                              //                             sx={{
                              //   width: "98%",
                              //   margin: "5px 0",
                              //   "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                              //     borderColor: "#c4c4c4", // Change this to your desired hover color
                              //   },
                              //   "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              //      borderColor: "#fff", // Focus border color
                              //   },
                              // }}
                            >
                              <InputLabel id="demo-simple-select-label">
                                UserName
                              </InputLabel>

                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="UserName"
                                helperText="Select the language."
                                className="select_items"
                                style={{ textAlign: "left" }}
                                value={userId}
                                onChange={(e) => {
                                  setUserId(e.target.value);
                                }}
                                required
                              >
                                {users?.map((item, index) => {
                                  return (
                                    <MenuItem key={index} value={item?.user_id}>
                                      {item.username}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <TextField
                              className={`${classes.formControl} textfield_select`}
                              style={{
                                width: "98%",
                                margin: " 4px 0 4px 0",
                              }}
                              //                             sx={{
                              //   width: "98%",
                              //   margin: "5px 0",
                              //   "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                              //     borderColor: "#c4c4c4", // Change this to your desired hover color
                              //   },
                              //   "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              //       borderColor: "#fff", // Focus border color
                              //     },
                              // }}
                              type="text"
                              label="Caller Id"
                              variant="outlined"
                              value={callerId}
                              onChange={(e) => setCallerId(e.target.value)}
                            />
                          </Grid>
                          {/* <Grid
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <TextField
                              className={classes.formControl}
                              style={{
                                width: "98%",
                                margin: " 5px 0 5px 0",
                              }}
                              type="text"
                              label="Extension"
                              variant="outlined"
                              value={extension}
                              onChange={(e) => setExtension(e.target.value)}
                            />
                          </Grid> */}

                          <Grid
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <TextField
                              className={`${classes.formControl} textfield_select`}
                              style={{
                                width: "98%",
                                margin: " 5px 0 5px 0",
                              }}
                              //                             sx={{
                              //   width: "98%",
                              //   margin: "5px 0",
                              //   "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                              //     borderColor: "#c4c4c4", // Change this to your desired hover color
                              //   },
                              //   "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              //       borderColor: "#fff", // Focus border color
                              //     },
                              // }}
                              type="text"
                              label="DID Number"
                              variant="outlined"
                              value={didNumber}
                              onChange={(e) => {
                                setDidNumber(e.target.value);
                              }}
                            />
                          </Grid>
                          <Grid
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <TextField
                              className={`${classes.formControl} textfield_select`}
                              style={{
                                width: "98%",
                                margin: " 5px 0 5px 0",
                              }}
                              //                             sx={{
                              //   width: "98%",
                              //   margin: "5px 0",
                              //   "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                              //     borderColor: "#c4c4c4", // Change this to your desired hover color
                              //   },
                              //   "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              //       borderColor: "#fff", // Focus border color
                              //     },
                              // }}
                              type="text"
                              label="Forward Number"
                              variant="outlined"
                              value={destination}
                              onChange={(e) => {
                                setDestination(e.target.value);
                              }}
                            />
                          </Grid>
                          {/* <Grid
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <FormControl
                              className={classes.formControl}
                              fullWidth
                              style={{ width: "98%", margin: "7px 0" }}
                            >
                              <InputLabel id="demo-simple-select-label">
                                Call Direction
                              </InputLabel>

                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Call Direction"
                                helperText="Select the language."
                                style={{ textAlign: "left" }}
                                value={callDirection}
                                onChange={(e) => {
                                  setCallDirection(e.target.value);
                                }}
                                required
                              >
                                <MenuItem value={"Inbound"}>Inbound</MenuItem>
                                <MenuItem value={"Outbound"}>Outbound</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid> */}
                          {/* <Grid
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <FormControl
                              className={classes.formControl}
                              fullWidth
                              style={{ width: "98.5%", margin: "7px 0px" }}
                            >
                              <InputLabel id="demo-simple-select-label">
                                Status
                              </InputLabel>

                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                className="select_items"
                                label="Status"
                                helperText="Select the language."
                                style={{ textAlign: "left" }}
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                              >
                                {array.map((item, index) => (
                                  <MenuItem key={index} value={item}>
                                    {item}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid> */}
                          <Grid
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                            style={{ display: "flex", alignItems: "center" }}
                            className="pe-lg-2 pe-md-3 pe-sm-0 pe-xs-0 pe-0 px-lg-0 px-md-0 px-sm-1 px-xs-1 px-1"
                          >
                            {/* <LocalizationProvider
                              dateAdapter={AdapterDayjs}
                              className={classes.formControl}
                            >
                              <DemoContainer
                                components={["DatePicker"]}
                                sx={{ width: "98%" }}
                                className="select_date"
                              >
                                <DateTimePicker
                                  label="From Date"
                                  value={
                                    fromDate
                                      ? dayjs(fromDate, "DD/MM/YYYY HH:mm")
                                      : null
                                  }
                                  onChange={handleFromDateChange}
                                  renderInput={(props) => (
                                    <TextField {...props} />
                                  )}
                                  format="DD/MM/YYYY HH:mm" // 24-hour format
                                  ampm={false} // Disables AM/PM toggle
                                  minutesStep={1}
                                />
                              </DemoContainer>
                            </LocalizationProvider> */}
                            <label style={{ fontSize: "14px" }}>
                              From Date:
                            </label>
                            <Datetime
                              style={{
                                width: "100%",
                                margin: " 5px 0 5px 0",
                                border: "none !important",
                                background: "transparent !important",
                              }}
                              className="datefield_select frm_date"
                              value={fromDate}
                              onChange={handleFromDateChange}
                              dateFormat="DD/MM/YYYY" // Date format
                              timeFormat="HH:mm" // 24-hour time format (Railway Time)
                              isValidDate={disableFutureDates}
                            />
                          </Grid>
                          <Grid
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              // padding: "0 5px",
                            }}
                            className="mt-xxl-0 mt-xl-0 mt-lg-0 mt-md-0 mt-sm-1 mt-xs-1 mt-1 px-lg-0 px-md-0 px-sm-1 px-xs-1 px-1"
                          >
                            {/* <LocalizationProvider
                              dateAdapter={AdapterDayjs}
                              className={classes.formControl}
                            >
                              <DemoContainer
                                components={["DatePicker"]}
                                sx={{ width: "98%" }}
                                className="select_date"
                              >
                                <DateTimePicker
                                  label="To Date"
                                  value={
                                    toDate
                                      ? dayjs(toDate, "DD/MM/YYYY HH:mm")
                                      : null
                                  }
                                  onChange={handleToDateChange}
                                  renderInput={(props) => (
                                    <TextField {...props} />
                                  )}
                                  format="DD/MM/YYYY HH:mm" // 24-hour format
                                  ampm={false} // Disables AM/PM toggle
                                  minutesStep={1} // Show all minutes (no step increment)
                                />
                              </DemoContainer>
                            </LocalizationProvider> */}
                            <label
                              style={{ fontSize: "14px", marginRight: "20px" }}
                            >
                              To <br />
                              Date:
                            </label>
                            <Datetime
                              style={{
                                width: "100%",
                                margin: " 5px 0 5px 0",
                                border: "none !important",
                                background: "transparent !important",
                                marginRight: "7px",
                              }}
                              className="datefield_select new_input"
                              value={toDate}
                              label="To Date"
                              onChange={handleToDateChange}
                              dateFormat="DD/MM/YYYY" // Date format
                              timeFormat="HH:mm" // 24-hour time format (Railway Time)
                              isValidDate={disablePastDates} // Disables past dates
                            />
                          </Grid>

                          <Grid
                            xl={12}
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "end",
                              padding: "20px 0",
                            }}
                          >
                            <div>
                              <IconButton
                                className="filter_search_btn"
                                style={{
                                  marginLeft: "0 !important",
                                  background: "green !important",
                                }}
                                onClick={handleSearch}
                              >
                                Search &nbsp;
                                <SearchIcon />
                              </IconButton>
                              <IconButton
                                className="filter_reset_btn"
                                style={{
                                  marginLeft: "0 !important",
                                  backgroundColor: "grey !important",
                                }}
                                onClick={handleReset}
                              >
                                Reset &nbsp;
                                <RestartAltIcon />
                              </IconButton>
                            </div>
                          </Grid>

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
                              }}
                              disabled={selectedCallerData.length === 0}
                              onClick={handleBlockCallerIds}
                            >
                              Block &nbsp;
                              <BlockIcon />
                            </IconButton>
                            {/* <div>
                              <FormControl>
                                <RadioGroup
                                  row
                                  aria-labelledby="demo-row-radio-buttons-group-label"
                                  name="row-radio-buttons-group"
                                  value={radioValue} // Bind the selected value to state
                                  onChange={(e) =>
                                    setRadioValue(e.target.value)
                                  } // Handle change event
                                >
                                  <FormControlLabel
                                    value="n"
                                    control={<Radio />}
                                    label="New"
                                  />
                                  <FormControlLabel
                                    value="o"
                                    control={<Radio />}
                                    label="Old"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </div> */}
                          </div>
                        </Grid>
                        {radioValue === "n" ? (
                          <>
                            <ThemeProvider theme={theme}>
                              <div style={{ height: 620, width: "100%" }}>
                                <StyledDataGrid
                                  rows={rows}
                                  columns={columns}
                                  components={{ Toolbar: GridToolbar }}
                                  checkboxSelection
                                  disableRowSelectionOnClick
                                  rowSelectionModel={selectedRows} // Bind selection model
                                  onRowSelectionModelChange={
                                    handleSelectionChange
                                  } // Handle selection change
                                />
                              </div>
                            </ThemeProvider>
                          </>
                        ) : (
                          <>
                            <ThemeProvider theme={theme}>
                              <div style={{ height: 500, width: "100%" }}>
                                <DataGrid
                                  rows={[]}
                                  columns={[]}
                                  checkboxSelection
                                  components={{ Toolbar: GridToolbar }}
                                  onRowSelectionModelChange={
                                    handleSelectionChange
                                  }
                                />
                              </div>
                            </ThemeProvider>
                          </>
                        )}
                      </div>
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

export default AdminReport;

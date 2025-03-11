import React, { useEffect, useRef, useState } from "react";
import "../../../src/style.css";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers";
import Datetime from "react-datetime";
import { makeStyles } from "@mui/styles";
import { getRedirectReport } from "../../redux/actions/redirectPortal/redirectPortal_reportAction";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { StyledDataGrid } from "../../pages/CustomDataGrid";
import { callStatusMessages } from "../../pages/Tooltips";

dayjs.extend(utc);
dayjs.extend(timezone);

const useStyles = makeStyles({
  root: {
    "& .super-app-theme--header": {
      position: "sticky",
      left: 0,
      backgroundColor: "#0c367a",
      color: "#fff",
      zIndex: 1,
    },
    "& .super-app-theme--cell": {
      position: "sticky",
      left: 0,
      backgroundColor: "#fff",
      zIndex: 1,
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
      "& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
        {
          padding: "11.5px 14px",
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
        border: "1px solid #fff",
      },
    },
  },
});

const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          "& .MuiDataGrid-row": {
            minHeight: "auto",
          },
        },
      },
      defaultProps: {
        density: "compact",
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
  "ANSWER",
  "FASTAGI_DOWN",
];
const CustomToolbar = () => (
  <GridToolbarContainer>
    {/* <GridToolbarColumnsButton/> */}
    <GridToolbarDensitySelector />

    {/* <GridToolbarFilterButton/> */}
  </GridToolbarContainer>
);


function XmlCdr({ userThem }) {
  const classes = useStyles();
  const [currentAudio, setCurrentAudio] = useState(null);
  const railwayZone = "Asia/Kolkata";
  const [filters, setFilters] = useState({
    callDirection: "",
    didNumber: "",
    destination: "",
    callerId: "",
    status: "",
  });
  const [response, setResponse] = useState("");
  const audioRefs = useRef({});
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

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

  // const handleDateChange = (key, date) => {
  //   if (dayjs(date, "DD/MM/YYYY HH:mm", true).isValid()) {
  //     setFilters((prev) => ({
  //       ...prev,
  //       [key]: dayjs(date).tz(railwayZone).format("DD/MM/YYYY HH:mm"),
  //     }));
  //   } else {
  //     setFilters((prev) => ({ ...prev, [key]: null }));
  //   }
  // };

  useEffect(() => {
    let data = JSON.stringify({
      from_date: dayjs(fromDate).isValid()
        ? dayjs(fromDate).format("YYYY-MM-DD HH:mm")
        : "",
      to_date: dayjs(toDate).isValid()
      ? dayjs(toDate).format("YYYY-MM-DD HH:mm")
      : "",
    });
    dispatch(getRedirectReport(data));
  }, [dispatch, response]);

  const handleSearch = () => {
    let data = JSON.stringify({
      from_date: dayjs(fromDate).isValid()
        ? dayjs(fromDate).format("YYYY-MM-DD HH:mm")
        : "",
      to_date: dayjs(toDate).isValid()
      ? dayjs(toDate).format("YYYY-MM-DD HH:mm")
      : "",
      call_direction: filters.callDirection,
      did_number: filters.didNumber,
      forward_number: filters.destination,
      caller_id: filters.callerId,
      hangup_reason: filters.status,
    });
    dispatch(getRedirectReport(data));
  };

  const handleReset = () => {
    setFilters({
      fromDate: null,
      toDate: null,
      callDirection: "",
      didNumber: "",
      destination: "",
      callerId: "",
      status: "",
    });
    setResponse("data");
    setFromDate(getTodayWithMidnight());
    setToDate(getTodayWithEndOfDay());
  };

  const handleAudioClick = (audioSrc) => {
    const audio = audioRefs.current[audioSrc];
    if (currentAudio === audio) {
      if (audio.pause) {
        audio.play();
      } else {
        audio.pause();
      }
    } else {
      if (currentAudio) {
        currentAudio.pause();
      }
      setCurrentAudio(audio);
      audio.play();
    }
  };

  const handleDownload = (recordingPath) => {
    const link = document.createElement("a");
    link.href = recordingPath;
    link.download = recordingPath.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusMessage = (key) => {
    const status = callStatusMessages.find((item) => item.key === key);
    return status ? status.value : "Unknown Status";
  };

  const CallStatusTooltip = ({ statusKey }) => {
    const isMobile = useMediaQuery("(max-width:600px)");
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      if (isMobile) {
        setAnchorEl(event.currentTarget);
      }
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <>
        {isMobile ? (
          <>
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
      field: "caller_id_number",
      headerName: "Caller ID",
      headerClassName: "custom-header",
      flex: 1,
      minWidth: 115,
      maxWidth: "100%",
      headerAlign: "left",
      disableColumnMenu: true,
      sortable: false,
      align: "left",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "did_tfn",
      headerName: "DID Number",
      headerClassName: "custom-header",
      flex: 1,
      minWidth: 115,
      maxWidth: "100%",
      headerAlign: "left",
      disableColumnMenu: true,
      sortable: false,
      align: "left",
    },
    {
      field: "forwarded_number",
      headerName: "Forwarded",
      headerClassName: "custom-header",
      flex: 1,
      minWidth: 110,
      maxWidth: "100%",
      headerAlign: "left",
      disableColumnMenu: true,
      sortable: false,
      align: "left",
    },
    {
      field: "hangup_reason",
      headerName: "Status",
      headerClassName: "custom-header",
      flex: 1,
      minWidth: 160,
      maxWidth: "100%",
      headerAlign: "left",
      disableColumnMenu: true,
      sortable: false,
      align: "left",
      renderCell: (params) => <CallStatusTooltip statusKey={params.value} />,
    },
    {
      field: "call_status",
      headerName: "Call Status",
      headerClassName: "custom-header",
      flex: 1,
      minWidth: 100,
      maxWidth: "100%",
      headerAlign: "left",
      disableColumnMenu: true,
      sortable: false,
      align: "left",
      renderCell: (params) => (
        <span
          style={{
            color: params.row.call_status === "ANSWERED" ? "green" : "red",
          }}
        >
          {params.row.call_status}
        </span>
      ),
    },
    {
      field: "buyer_name",
      headerName: "Buyer Name",
      headerClassName: "custom-header",
      flex: 1,
      minWidth: 80,
      maxWidth: "100%",
      headerAlign: "left",
      disableColumnMenu: true,
      sortable: false,
      align: "left",
    },
    {
      field: "campaign_name",
      headerName: "Campaign Name",
      headerClassName: "custom-header",
      flex: 1,
      minWidth: 90,
      maxWidth: "100%",
      headerAlign: "left",
      disableColumnMenu: true,
      sortable: false,
      align: "left",
    },
    {
      field: "duration",
      headerName: "Duration",
      headerClassName: "custom-header",
      flex: 1,
      minWidth: 80,
      maxWidth: "100%",
      headerAlign: "left",
      disableColumnMenu: true,
      sortable: false,
      align: "left",
    },
    {
      field: "recording_path",
      headerName: "Recording",
      headerClassName: "custom-header",
      flex: 1,
      minWidth: 330,
      maxWidth: "100%",
      headerAlign: "left",
      disableColumnMenu: true,
      sortable: false,
      align: "left",
      renderCell: (params) => {
        if (params.row.billsec >= 0) {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "left",
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
                style={{ padding: "10px" }}
              />
            </div>
          );
        } else {
          return <></>;
        }
      },
    },
    {
      field: "answer_at",
      headerName: "Call Answer Time",
      headerClassName: "custom-header",
      flex: 1,
      minWidth: 150,
      maxWidth: "100%",
      headerAlign: "left",
      disableColumnMenu: true,
      sortable: false,
      align: "left",
      renderCell: (params) => {
        if (params.value !== null) {
          const date = new Date(params.value);
          const day = (date.getUTCDate() < 10 ? "0" : "") + date.getUTCDate();
          const month =
            (date.getUTCMonth() + 1 < 10 ? "0" : "") + (date.getUTCMonth() + 1);
          const year = date.getUTCFullYear();
          const hours =
            (date.getUTCHours() < 10 ? "0" : "") + date.getUTCHours();
          const minutes =
            (date.getUTCMinutes() < 10 ? "0" : "") + date.getUTCMinutes();
          const seconds =
            (date.getUTCSeconds() < 10 ? "0" : "") + date.getUTCSeconds();
          return (
            <>
              <span style={{ color: "blue" }}>{`${day}/${month}/${year}`}</span>
              &nbsp;
              <span
                style={{ color: "green" }}
              >{`${hours}:${minutes}:${seconds}`}</span>
            </>
          );
        }
      },
    },
    {
      field: "start_at",
      headerName: "Call Start Time",
      headerClassName: "custom-header",
      flex: 1,
      minWidth: 150,
      maxWidth: "100%",
      headerAlign: "left",
      disableColumnMenu: true,
      sortable: false,
      align: "left",
      renderCell: (params) => {
        if (params.value !== null) {
          const date = new Date(params.value);
          const day = (date.getUTCDate() < 10 ? "0" : "") + date.getUTCDate();
          const month =
            (date.getUTCMonth() + 1 < 10 ? "0" : "") + (date.getUTCMonth() + 1);
          const year = date.getUTCFullYear();
          const hours =
            (date.getUTCHours() < 10 ? "0" : "") + date.getUTCHours();
          const minutes =
            (date.getUTCMinutes() < 10 ? "0" : "") + date.getUTCMinutes();
          const seconds =
            (date.getUTCSeconds() < 10 ? "0" : "") + date.getUTCSeconds();
          return (
            <>
              <span style={{ color: "blue" }}>{`${day}/${month}/${year}`}</span>
              &nbsp;
              <span
                style={{ color: "green" }}
              >{`${hours}:${minutes}:${seconds}`}</span>
            </>
          );
        }
      },
    },
    {
      field: "end_at",
      headerName: "Call End Time",
      headerClassName: "custom-header",
      flex: 1,
      minWidth: 150,
      maxWidth: "100%",
      headerAlign: "left",
      disableColumnMenu: true,
      sortable: false,
      align: "left",
      renderCell: (params) => {
        if (params.value !== null) {
          const date = new Date(params.value);
          const day = (date.getUTCDate() < 10 ? "0" : "") + date.getUTCDate();
          const month =
            (date.getUTCMonth() + 1 < 10 ? "0" : "") + (date.getUTCMonth() + 1);
          const year = date.getUTCFullYear();
          const hours =
            (date.getUTCHours() < 10 ? "0" : "") + date.getUTCHours();
          const minutes =
            (date.getUTCMinutes() < 10 ? "0" : "") + date.getUTCMinutes();
          const seconds =
            (date.getUTCSeconds() < 10 ? "0" : "") + date.getUTCSeconds();
          return (
            <>
              <span style={{ color: "blue" }}>{`${day}/${month}/${year}`}</span>
              &nbsp;
              <span
                style={{ color: "green" }}
              >{`${hours}:${minutes}:${seconds}`}</span>
            </>
          );
        }
      },
    },
    {
      field: "uniqueid",
      headerName: "Unique Id",
      headerClassName: "custom-header",
      flex: 1,
      minWidth: 140,
      maxWidth: "100%",
      headerAlign: "left",
      disableColumnMenu: true,
      sortable: false,
      align: "left",
    },
  ];

  //Create CSV file Function
  const handleCSVExport = (rows, columns) => {
    const filteredRows = rows.map((row) => {
      const clonedRow = { ...row };

      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          return "";
        }
        const day = (date.getUTCDate() < 10 ? "0" : "") + date.getUTCDate();
        const month =
          (date.getUTCMonth() + 1 < 10 ? "0" : "") + (date.getUTCMonth() + 1);
        const year = date.getUTCFullYear();
        const hours = (date.getUTCHours() < 10 ? "0" : "") + date.getUTCHours();
        const minutes =
          (date.getUTCMinutes() < 10 ? "0" : "") + date.getUTCMinutes();
        const seconds =
          (date.getUTCSeconds() < 10 ? "0" : "") + date.getUTCSeconds();

        // Prevent Excel from changing format
        return `="\t${day}/${month}/${year} ${hours}:${minutes}:${seconds}"`;
      };

      if (clonedRow.start_at) {
        clonedRow.start_at = formatDate(clonedRow.start_at);
      }
      if (clonedRow.end_at) {
        clonedRow.end_at = formatDate(clonedRow.end_at);
      }

      const { recording_path, answer_at, uniqueid, ...filteredRow } = clonedRow;
      return { id: clonedRow.id, ...filteredRow };
    });

    const filteredColumns = columns.filter(
      (col) => !["recording_path", "answer_at", "uniqueid"].includes(col.field)
    );

    const csvData = filteredRows.map((row) => {
      return filteredColumns.map((col) => row[col.field] || "");
    });

    const header =
      filteredColumns.map((col) => col.headerName).join(",") + "\n";
    const rowsCsv = csvData.map((row) => row.join(",")).join("\n");

    const csvWithBOM = "\uFEFF" + header + rowsCsv; // Add UTF-8 BOM
    const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tellipsis_cdr_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Define rows here
  const rows = [];
  state?.getRedirectReport?.RedirectReport?.data &&
    state?.getRedirectReport?.RedirectReport?.data?.forEach((item, index) => {
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
        recording_path: item.recording_path,
        hangup_reason: item.status,
        call_status: item.call_status,
        campaign_name: item.campaign_name,
        destination: item.destination,
        username: item.username,
        answered_by: item.answered_by,
        transfered_to: item.transfered_to,
        forwarded_number: item.forwarded_number,
      });
    });

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
                                alignItems: "end",
                              }}
                            >
                              <div>
                                <h3>Report</h3>
                              </div>
                            </div>

                            <Grid
                              container
                              className="cdr_filter_row"
                              style={{ padding: "0px 0 10px" }}
                            >
                              <Grid
                                xl={3}
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  className={`${classes.formControl} textfield_select`}
                                  style={{
                                    width: "98%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Caller ID"
                                  variant="outlined"
                                  value={filters.callerId}
                                  onChange={(e) =>
                                    setFilters((prev) => ({
                                      ...prev,
                                      callerId: e.target.value,
                                    }))
                                  }
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
                                }}
                              >
                                <TextField
                                  className={`${classes.formControl} textfield_select`}
                                  style={{
                                    width: "98%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="DID Number"
                                  variant="outlined"
                                  value={filters.didNumber}
                                  onChange={(e) =>
                                    setFilters((prev) => ({
                                      ...prev,
                                      didNumber: e.target.value,
                                    }))
                                  }
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
                                }}
                              >
                                <TextField
                                  className={`${classes.formControl} textfield_select`}
                                  style={{
                                    width: "98%",
                                    margin: " 5px 0 5px 0",
                                  }}
                                  type="text"
                                  label="Forward Number"
                                  variant="outlined"
                                  value={filters.destination}
                                  onChange={(e) =>
                                    setFilters((prev) => ({
                                      ...prev,
                                      destination: e.target.value,
                                    }))
                                  }
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
                                }}
                              >
                                {/* <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                  className={classes.formControl}
                                >
                                  <DemoContainer
                                    components={["DatePicker"]}
                                    sx={{ width: "100%" }}
                                    className="select_date"
                                  >
                                    <DateTimePicker
                                      label="From Date"
                                      value={
                                        filters.fromDate
                                          ? dayjs(
                                              filters.fromDate,
                                              "DD/MM/YYYY HH:mm"
                                            )
                                          : null
                                      }
                                      onChange={(date) =>
                                        handleDateChange("fromDate", date)
                                      }
                                      renderInput={(props) => (
                                        <TextField {...props} />
                                      )}
                                      format="DD/MM/YYYY HH:mm"
                                      ampm={false}
                                      minutesStep={1}
                                    />
                                  </DemoContainer>
                                </LocalizationProvider>
                                <ReactCalendar/> */}
                                {/* <input
        type="datetime-local"
        value={dateTime}
        onChange={handleNewDateChange}
      /> */}
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
                                }}
                                className="mt-xxl-0 mt-xl-0 mt-lg-0 mt-md-0 mt-sm-1 mt-xs-1 mt-1"
                              >
                                {/* <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                  className={classes.formControl}
                                >
                                  <DemoContainer
                                    components={["DatePicker"]}
                                    sx={{ width: "100%" }}
                                    className="select_date"
                                  >
                                    <DateTimePicker
                                      label="To Date"
                                      value={
                                        filters.toDate
                                          ? dayjs(
                                              filters.toDate,
                                              "DD/MM/YYYY HH:mm"
                                            )
                                          : null
                                      }
                                      onChange={(date) =>
                                        handleDateChange("toDate", date)
                                      }
                                      renderInput={(props) => (
                                        <TextField {...props} />
                                      )}
                                      format="DD/MM/YYYY HH:mm"
                                      ampm={false}
                                      minutesStep={1}
                                    />
                                  </DemoContainer>
                                </LocalizationProvider> */}
                                <label style={{ fontSize: "14px",marginRight:"20px" }}>
                                  To <br/>Date:
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
                                xl={3}
                                lg={3}
                                md={3}
                                sm={12}
                                xs={12}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: " 10px 0",
                                  width: "100%",
                                  marginLeft: "auto",
                                }}
                              >
                                <Box className="d-flex">
                                  <Button
                                    onClick={() =>
                                      handleCSVExport(rows, columns)
                                    }
                                    // variant="contained"
                                    className="filter_search_btn me-0"
                                    startIcon={<FileDownloadIcon />}
                                    sx={{
                                      backgroundColor: "#1976d2 !important",
                                      color: "#fff",
                                      fontSize: "14px !important", // Smaller font size
                                      // fontWeight: "bold",
                                      textTransform: "capitalize",
                                      padding: "9px 10px !important", // Smaller padding
                                      // borderRadius: "6px",
                                      // textTransform: "none",
                                      // minWidth: "120px", // Reduce the width
                                      // transition: "0.3s",
                                      // "&:hover": {
                                      //   backgroundColor: "#1565c0",
                                      //   transform: "scale(1.05)",
                                      // },
                                    }}
                                  >
                                    Report
                                  </Button>

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
                                </Box>
                              </Grid>
                              {/* <Grid
                                xl={12}
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                                >
                               
                                </Grid> */}
                            </Grid>

                            <ThemeProvider theme={theme}>
                              <div>
                                <StyledDataGrid
                                  className="custom_header_redirect"
                                  rows={rows}
                                  columns={columns}
                                  components={{ Toolbar: CustomToolbar }}
                                  autoHeight
                                  disableColumnResize={false}
                                  hideFooterPagination={window.innerWidth < 600}
                                  sx={{
                                    "& .MuiDataGrid-cell": {
                                      fontSize: {
                                        xs: "12px",
                                        sm: "14px",
                                        md: "13px",
                                      },
                                      wordBreak: "break-word !important",
                                      whiteSpace: "break-spaces !important",
                                    },
                                  }}
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

export default XmlCdr;

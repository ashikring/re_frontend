import {
  Box,
  Button,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import {
  DataGrid,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import "../../Switcher.scss";
import { useDispatch, useSelector } from "react-redux";
import { getAdminCallActive } from "../../redux/actions/adminPortal_callActiveAction";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import { IconBase } from "react-icons/lib";
import { toast } from "react-toastify";
import axios from "axios";
import { api } from "../../mockData";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
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
      height: "45px",
      minWidth: "120px",
      justifyContent: "center",
    },
    "& .MuiSelect-select.MuiSelect-select": {
      paddingRight: "0px",
    },
    "& .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root": {
      top: "-4px !important",
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
  // list: {
  //   paddingTop: 0,
  //   paddingBottom: 0,
  //   "& li": {
  //     fontWeight: 200,
  //     paddingTop: 8,
  //     paddingBottom: 8,
  //     fontSize: "12px",
  //   },
  //   "& li.Mui-selected": {
  //     color: "white",
  //     background: "#6EC177",
  //   },
  //   "& li.Mui-selected:hover": {
  //     background: "#6EC177",
  //   },
  // },
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

export function CustomFooterStatusComponent(props) {
  return (<></>
    // <Box sx={{ p: 1, display: 'flex' }}>
    //   <FiberManualRecordIcon
    //     fontSize="small"
    //     sx={{
    //       mr: 1,
    //       color: props.status === 'connected' ? '#4caf50' : '#d9182e',
    //     }}
    //   />
    //   Status {props.status}
    // </Box>
  );
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

function AdminCallActive({ colorThem }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [timeStamp, setTimeStamp] = useState([]);
  const [timeDifference, setTimeDifference] = useState([]);
  
  const parseTimestamp = () => {
    return timeStamp?.map((item) => {
      const date = new Date(item.TimeStamp);
      return date; // Keep Date objects for time difference calculation
    });
  };
  
  const timestampDate = parseTimestamp();
  
  // Function to calculate time differences for each timestamp
  const calculateTimeDifferences = () => {
    const currentTime = new Date();
    const differences = timestampDate?.map((timestamp) => {
      const diffInMs = currentTime - timestamp;
      const diffInSeconds = Math.floor(diffInMs / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      // Format with leading zeros
    const formattedHours = String(diffInHours).padStart(2, '0');
    const formattedMinutes = String(diffInMinutes % 60).padStart(2, '0');
    const formattedSeconds = String(diffInSeconds % 60).padStart(2, '0');
  
      return {
        days: diffInDays,
        hours: formattedHours ,
        minutes: formattedMinutes ,
        seconds: formattedSeconds 
      };
    });
  
    setTimeDifference(differences);
  };
  
  // Calculate time differences initially and update every 5 seconds
  useEffect(() => {
    calculateTimeDifferences(); // Initial calculation
  
    const interval = setInterval(() => {
      calculateTimeDifferences(); // Recalculate every 5 seconds
    }, 5000);
  
    return () => clearInterval(interval);
  }, [timeStamp]);

  useEffect(() => {
    dispatch(getAdminCallActive());
  }, [dispatch]); // Empty dependency array ensures this effect runs once on mount

  const handleHangup = async (data) => {
    const token = JSON.parse(localStorage.getItem("admin"));
    let values = JSON.stringify({
      CallReference: data.CallReference,
    });
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access_token} `,
        },
      };
      const { data } = await axios.post(
        `${api.dev}/api/callhangup`,
        values,
        config
      );
      if (data?.status === 200) {
        toast.success(data?.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500,
        });
      } else {
        toast.error(data?.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2500,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2500,
      });
    }
  };

  const columns = [
    {
      field: "DIDNumber",
      headerName: "Did Number",
      width: 130,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "CallerID",
      headerName: "Caller Id",
      width: 130,
      headerAlign: "center",
      align: "center",
      headerClassName: "custom-header",
    },
    {
      field: "Username",
      headerName: "Username",
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      width: 100,
    },

    {
      field: "CompaignName",
      headerName: "Compaign Name",
      width: 150,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },

    {
      field: "BuyerName",
      headerName: "Buyer Name",
      width: 150,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },

    {
      field: "ForwardedTo",
      headerName: "Forwarded To",
      width: 150,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "Status",
      headerName: "Status",
      width: 150,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            <p
              style={{
                fontWeight: "500",
                margin: "0",
              }}
            >
              {params?.row?.Status === "ANSWER" ? (
                <>
                  {" "}
                  <p
                    style={{
                      fontWeight: "500",
                      margin: "0",
                      color: "green",
                    }}
                  >
                    {params?.row?.Status}
                  </p>
                </>
              ) : (
                <></>
              )}
              {params?.row?.Status === "DIALING" ? (
                <>
                  {" "}
                  <p
                    style={{
                      fontWeight: "500",
                      margin: "0",
                      color: "violet",
                    }}
                  >
                    {params?.row?.Status}
                  </p>
                </>
              ) : (
                <></>
              )}
              {params?.row?.Status === "RINGING" ? (
                <>
                  {" "}
                  <p
                    style={{
                      fontWeight: "500",
                      margin: "0",
                      color: "skyblue",
                    }}
                  >
                    {params?.row?.Status}
                  </p>
                </>
              ) : (
                <></>
              )}
            </p>
          </div>
        );
      },
    },

    {
      field: "CallDuration",
      headerName: "Call Duration",
      width: 150,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        if (params.value !== null) {
          const index = mockDataTeam.findIndex(item => item.id === params.row.id);
          const duration = timeDifference && timeDifference[index];
          
          return (
            <>
            {params?.row?.Status === "DIALING" ? (<><span style={{ color: "grey" }}>
              {duration ? `00:00:00` : ''}
            </span></>) : (<> <span style={{ color: "green" }}>
              {duration ? `${duration.hours}:${duration.minutes}:${duration.seconds}` : ''}
            </span></>)
           
          }</>
          );
        }
        return null;
      },
    },
  
    {
      field: "TimeStamp",
      headerName: "Date Time",
      width: 200,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        if (params.value !== null) {
          const date = new Date(params.value);
          var day = date.getUTCDate();
          var month = date.getUTCMonth() + 1; // Month starts from 0
          var year = date.getUTCFullYear();
          var hours = date.getHours();
          var minutes = date.getMinutes();
          var seconds = date.getSeconds();

          // Formatting single-digit day/month with leading zero if needed
          day = (day < 10 ? "0" : "") + day;
          month = (month < 10 ? "0" : "") + month;

          // Formatting single-digit hours/minutes/seconds with leading zero if needed
          hours = (hours < 10 ? "0" : "") + hours;
          minutes = (minutes < 10 ? "0" : "") + minutes;
          seconds = (seconds < 10 ? "0" : "") + seconds;
          var formattedDate =
            day +
            "/" +
            month +
            "/" +
            year +
            " " +
            hours +
            ":" +
            minutes +
            ":" +
            seconds;
            
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

    // {
    //   field: "Info",
    //   headerName: "Information",
    //   width: 150,
    //   headerClassName: "custom-header",
    //   headerAlign: "center",
    //   align: "center",
    // },
   
    // {
    //   field: "Extensions",
    //   headerName: "Extensions",
    //   width: 200,
    //   headerClassName: "custom-header",
    //   headerAlign: "center",
    //   align: "center",
    //   renderCell: (params) => (
    //     <div>
    //       {Object.entries(params.row.Extensions || {}).map(([key, value]) => (
    //         <div key={key}>
    //           <strong>{key}: </strong>
    //           {value}
    //         </div>
    //       ))}
    //     </div>
    //   ),
    // },
    // {
    //   field: "AnsweredBy",
    //   headerName: "Answered By",
    //   width: 150,
    //   headerClassName: "custom-header",
    //   headerAlign: "center",
    //   align: "center",
    // },
    {
      field: "hangup",
      headerName: "Hangup",
      width: 120,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            {params.row.Status === "ANSWER" && (
              <Button
                // variant="outlined"
                sx={{
                  ":hover": {
                    bgcolor: "error.main",
                    color: "white",
                  },
                  padding: "2px",
                  textTransform: "capitalize",
                  fontSize: "14px",
                  color: "error.main",
                  borderColor: "error.main",
                  border: "1px solid #d32f2f",
                }}
                onClick={(e) => {
                  handleHangup(params.row);
                }}
              >
                <IconBase>
                  <PhoneDisabledIcon/>
                </IconBase>
              </Button>
            )}
          </div>
        );
      },
    },
  ];

 
  const mockDataTeam = useMemo(() => {
    
    if (state?.getAdminCallActive?.callactive !== undefined) {
      return Object.keys(state?.getAdminCallActive?.callactive)
        .map((key) => ({
          id: key,
          ...state?.getAdminCallActive?.callactive[key],
        }))
    }else {
      return [];
    }
  }, [state?.getAdminCallActive?.callactive]);

  useEffect(() => {
    // Prepare timeStamp array from mockDataTeam
    const formattedTimeStamps = mockDataTeam?.map((item) => ({
      id: item.id,
      TimeStamp: item.TimeStamp, // Assuming TimeStamp is a property of each item
    }));
  
    setTimeStamp(formattedTimeStamps);
  }, [mockDataTeam]);

  return (
    <>
      <div className={`App ${colorThem} `} >
        <div className="contant_box" > 
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
                    <div className="cntnt_title">
                      <div className="">
                        <h3>Active Calls</h3>
                        {/* <p>
                          Use this to monitor and interact with the active
                          calls.
                        </p> */}
                      </div>
                    </div>
                    <div className="row">
                      <ThemeProvider theme={theme}>
                      <div style={{ height: "100%", width: "100%" }}>
                              <DataGrid
                                // checkboxSelection
                                rows={mockDataTeam}
                                columns={columns}
                                headerClassName="custom-header"
                                // getRowClassName={(params) =>
                                //   isRowBordered(params)
                                //     ? classes.borderedGreen
                                //     : classes.borderedRed
                                // }
                                components={{ Toolbar: GridToolbar }}
                                slots={{
                                  toolbar: CustomToolbar,
                                  footer: CustomFooterStatusComponent,
                                }}
                               
                                autoHeight 
                                
                              />
                            </div>
                      </ThemeProvider>
                    </div>
                  </div>

                  {/* <!----> */}
                  {/* 
            <!----> */}
                </div>
                {/* <!----> */}
              </div>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
}

export default AdminCallActive;

import Loader from "@/components/Loader";
import useEmployeeStatus from "@/hooks/admin/useEmployeeStatus";
import { ArrowBack, CloudUploadOutlined } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Column {
  id: 'name' | 'employeeId' | 'department' | 'email' | 'contact' | 'status';
  label: string;
  minWidth?: number;
  align?: 'right' | "left" | "center";
  format?: (value: number) => string;
}

const columns: Column[] = [
    {id:"name",label:"Name",align:"left"},{id:"employeeId",label:"Employee ID",align:"center"},{id:"department",label:"Department",align:"center"},{id:"email",label:"Email ID",align:"center"},{id:"contact",label:"Mobile number",align:"center"},{id:"status",label:"Status",align:"center"}
];

const EmployeeStatus = () => {
  const theme = useTheme();
  const navigate=useNavigate()

  const {data,fetchEmployeeStatus,loading}=useEmployeeStatus()

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // const rows = [
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  //   { name: "Arjun Singh", employeeId: "D41234", department: "Sales", email: "manishbulchandani4@gmail.com", mobileNumber: "9352005086", status: "Active" },
  // ];

  useEffect(()=>{
    fetchEmployeeStatus()
  },[])

  if(loading){
    return <Loader/>
  }
  return (
    <Stack
      bgcolor={theme.palette.primary.main}
      minHeight={"100vh"}
      color="#ffffff"
      padding={"16px 20px"}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack direction={"row"} gap={"4px"}>
          <IconButton onClick={()=>navigate(-1)}>
            <ArrowBack sx={{ color: "#ffffff" }} />
          </IconButton>
          <Typography fontSize={"2.5rem"} fontWeight={"600"}>
            Employee Status
          </Typography>
        </Stack>
        <Button
          variant="contained"
          endIcon={<CloudUploadOutlined />}
          sx={{
            bgcolor: "#FFB2B5",
            color: "#000000",
            height: "max-content",
            padding: "12px20px",
            fontSize: "1rem",
            borderRadius: "0",
            "&:hover": { bgcolor: "#FFB2B5" },
          }}
        >
          Upload New
        </Button>
      </Stack>

      <Stack>
        <TableContainer sx={{ maxHeight: 540 ,marginTop:"2.5rem"}}>
          <Table stickyHeader aria-label="sticky table" >
            <TableHead>
              <TableRow >
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    sx={{ bgcolor: theme.palette.primary.main }}
                  >
                    <Typography
                      margin={"8px 12px"}
                      color={"#ffffff"}
                      fontWeight={"500"}
                      fontSize={"1.25rem"}
                    >
                      {column.label}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row:any) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.employeeId}
                      sx={{
                        "& > *": {
                          borderBottom: `3px solid ${theme.palette.primary.main}`, 
                        },
                      }}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align} sx={{ bgcolor: theme.palette.secondary.main,borderBottom: `3px solid ${theme.palette.primary.main}`,}}>
                            <Typography margin={"12px"}>
                            {value}
                            </Typography>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{color:"#ffffff"}}
        />
      </Stack>
    </Stack>
  );
};

export default EmployeeStatus;

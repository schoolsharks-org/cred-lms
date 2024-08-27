import {
  Stack,
  Typography,
  Box,
  useTheme,
  Card,
  Grid,
  CardContent,
  CardMedia,
} from "@mui/material";
import editIcon from "@/assets/user/edit-icon.png";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
// import medalIcon from "../../../assets/user/medal-icon.png";
import badge from "../../../assets/user/weekly-question-badge.png";

const Profile = () => {
  const theme = useTheme();
  const { name, email, address, department, score } = useSelector(
    (state: RootState) => state.user
  );
  return (
    <Stack height={"100vh"}>
      <Stack paddingBottom={"28px"} width={"max-content"}>
        <Typography fontSize={"2rem"} fontWeight={"600"} padding={"8px"}>
          Profile
        </Typography>
        <Box
          margin={"9px"}
          sx={{
            height: "4px",
            borderRadius: "8px",
            bgcolor: theme.palette.primary.main,
            marginTop: "4px",
          }}
        />
      </Stack>

      <Stack flex={"1"}>
        <Stack
          direction={"column"}
          padding={"30px"}
          marginTop={"10px"}
          bgcolor={theme.palette.secondary.main}
        >
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography fontWeight={"800"} fontSize={"20px"}>
              Personal Details
            </Typography>
            <img src={editIcon} alt="edit" />
          </Stack>

          <Typography
            width={"max-content"}
            fontWeight={"500"}
            paddingTop={"12px"}
            paddingBottom={"12px"}
            borderBottom={"1px solid #00000080 "}
            fontSize={"15px"}
          >
            Name -{name}
          </Typography>
          <Typography
            width={"max-content"}
            fontWeight={"500"}
            borderBottom={"1px solid #00000080 "}
            paddingTop={"12px"}
            paddingBottom={"12px"}
            fontSize={"15px"}
          >
            Email -{email}
          </Typography>
          <Typography
            width={"max-content"}
            fontWeight={"500"}
            paddingTop={"12px"}
            paddingBottom={"12px"}
            borderBottom={"1px solid #00000080 "}
            fontSize={"15px"}
          >
            Department-{department}
          </Typography>
          <Typography
            width={"max-content"}
            fontWeight={"500"}
            borderBottom={"1px solid #00000080 "}
            paddingTop={"12px"}
            paddingBottom={"12px"}
            fontSize={"15px"}
          >
            Address-{address}
          </Typography>
        </Stack>
        <Stack
          direction={"row"}
          marginTop={"20px"}
          padding={"15px"}
          justifyContent={"space-between"}
          bgcolor={theme.palette.secondary.main}
          fontSize={"20px"}
        >
          <Typography fontWeight={"700"}>Total Points Earned</Typography>
          <Typography fontWeight={"700"}>{score}</Typography>
        </Stack>
        <Stack
          direction={"row"}
          borderTop={"1px solid #00000080 "}
          padding={"15px"}
          justifyContent={"space-between"}
          bgcolor={theme.palette.secondary.main}
          fontSize={"20px"}
        >
          <Typography fontWeight={"700"}>Total Points Redeemed</Typography>
          <Typography fontWeight={"700"}>0p</Typography>
        </Stack>
        <Stack
          marginTop={"20px"}
          padding={"20px"}
          justifyContent={"center"}
          bgcolor={theme.palette.secondary.main}
        >
          <Typography fontWeight={"800"}>Badges</Typography>

          <Grid
            container
            spacing={2}
            style={{ marginTop: 20 }}
            justifyContent={"space-around"}
          >
            <Grid>
              <Card>
                <CardContent style={{ textAlign: "center" }}>
                  <Typography
                    component="div"
                    fontWeight={"600"}
                    fontSize={"10px"}
                  >
                    Microfinance Star
                  </Typography>
                  <CardMedia
                    component="img"
                    image={badge}
                    alt="Image 1"
                    style={{
                      margin: 10,
                      width: "120px",
                      // height: "150px",
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid>
              <Card>
                <CardContent style={{ textAlign: "center" }}>
                  <Typography
                    fontWeight={"600"}
                    fontSize={"10px"}
                    component="div"
                  >
                    Client Relationship Master
                  </Typography>
                  <CardMedia
                    component="img"
                    image={badge}
                    alt="Image 2"
                    style={{
                      margin: 10,
                      width: "120px",
                      // height: "150px",
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Profile;

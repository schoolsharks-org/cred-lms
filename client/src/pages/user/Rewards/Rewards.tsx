import { RootState } from "@/store/store";
import { LockOpen, LockOutlined, Search } from "@mui/icons-material";
import {
  Stack,
  Typography,
  Box,
  useTheme,
  Button,
  IconButton,
} from "@mui/material";
import { useSelector } from "react-redux";

const Rewards = () => {
  const theme = useTheme();
  const { score } = useSelector((state: RootState) => state.user);

  const rewardsArray = [
    {
      title: "Noise Cancelling Headphones",
      category: "Lifestyle",
      content: "Top 3 performers get High-quality headphones for focused work.",
      tag: "Tech & Accessory",
      expiry: "8 days",
      points: "15",
      unlocked:false,
    },

    {
      title: "Custom Hoodie",
      category: "Lifestyle",
      content:
        "Achieve 25 points and get a high-quality hoodie with the company logo.",
      tag: "Lifestyle",
      expiry: "8 weeks",
      points: "25",
      unlocked:false,
    },
    {
      title: "Fine Dine Experience",
      category: "Lifestyle",
      content:
        "Gain 40 points and get a voucher for a meal at a top restaurant.",
      tag: "Leisure & Entertaintment",
      expiry: "2 weeks",
      points: "25",
      unlocked:false,
    },
  ];
  return (
    <Stack height={"100vh"}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        paddingBottom={"20px"}
        margin={"10px 10px 0"}
      >
        <Stack>
        <Stack width={"max-content"}>
          <Typography fontSize={"2rem"} fontWeight={"600"}>
            Rewards
          </Typography>
          <Box
            sx={{
              height: "4px",
              borderRadius: "8px",
              bgcolor: theme.palette.primary.main,
              marginTop: "6px",
              width:"100%"
            }}
          />
        </Stack>
        <Typography fontSize={"0.7rem"} marginTop={"8px"} maxWidth={"95%"}>
          Rewards in "SFL Sangram" are subject to availability and may change
          without notice. School sharks is not responsible for third-party
          products or services provided as rewards.
        </Typography>
        </Stack>
        <IconButton sx={{ height: "max-content" }}>
          <Search sx={{ color: "#000000", width: "32px", height: "69px" }} />
        </IconButton>
        {/* <img src={searchIcon} alt="search" /> */}
      </Stack>

      <Stack
        padding={"5px"}
        margin={"0 10px"}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems="center"
      >
        <Typography fontWeight={"600"} fontSize={"1.25rem"}>
          Recent
        </Typography>
        <Stack flexDirection={"column"} alignItems="center" gap={"5px"}>
          <Typography
            fontSize={"0.7rem"}
            fontWeight={"600"}
            color={theme.palette.text.secondary}
            width={"100%"}
            textAlign={"right"}
          >
            O points used
          </Typography>
          <Box sx={{ border: "1px solid #000000", padding: "6px 10px" }}>
            <Typography fontWeight={"500"}>{score} Points</Typography>
          </Box>
        </Stack>
      </Stack>

      <Stack flex={"1"} paddingBottom={"64px"}>
        {rewardsArray.map((reward, index) => (
          <Stack
            key={index}
            direction={"column"}
            padding={"16px"}
            margin={"10px"}
            bgcolor={reward.unlocked?theme.palette.secondary.main:"#E8E8E8"}
            border={"1px solid #796E6E"}
            borderRadius={"10px"}
          >
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography fontWeight={"700"} fontSize={"1.25rem"}>
                {reward.title}
              </Typography>
              {reward.unlocked?<LockOpen/>:<LockOutlined />}
            </Stack>
            <Typography
              fontSize={"0.7rem"}
              bgcolor={"#0000002e"}
              borderRadius={"12px"}
              width={"max-content"}
              padding={"0 6px"}
              marginTop={"10px"}
            >
              {reward.category}
            </Typography>

            <Typography fontSize={"15px"} marginTop={"24px"}>
              {reward.content}
            </Typography>

            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              marginTop={"15px"}
            >
              <Stack direction={"row"} gap={"16px"} alignItems={"center"}>
                <Button
                  variant="outlined"
                  size={"small"}
                  sx={{
                    padding: "2px 22px",
                    borderRadius: "0",
                    textTransform: "none",
                    borderColor: "black",
                    color: "black",
                    backgroundColor: "white",
                  }}
                >
                  Redeem
                </Button>
                <Stack
                  sx={{
                    textTransform: "none",
                    padding: "2px 22px",
                    height: "100%",
                    border: "1px solid #000000",
                  }}
                >
                  <Typography fontSize={"0.8rem"}>
                    {reward.points} points
                  </Typography>
                </Stack>
              </Stack>
              <Typography fontSize={"0.8rem"} marginTop={"7px"}>
                expires in {reward.expiry}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default Rewards;

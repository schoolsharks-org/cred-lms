import { Stack, Typography, Box, useTheme, Button } from "@mui/material";
// import searchIcon from "@/assets/user/search-icon.png";
const Rewards = () => {
  const theme = useTheme();

  const rewardsArray = [
    {
      title: "Noise Cancelling Headphones",
      content: "Top 3 performers get High-quality headphones for focused work.",
      tag: "Tech & Accessory",
      expiry: "8 days",
      points: "15",
    },

    {
      title: "Custom Hoodie",
      content:
        "Achieve 25 points and get a high-quality hoodie with the company logo.",
      tag: "Lifestyle",
      expiry: "2 months",
      points: "25",
    },
    {
      title: "Fine Dine Experience",
      content:
        "Gain 40 points and get a voucher for a meal at a top restaurant.",
      tag: "Leisure & Entertaintment",
      expiry: "2 months",
      points: "25",
    },
  ];
  return (
    <Stack height={"100vh"}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        paddingBottom={"28px"}
        margin={"10px"}
      >
        <Typography fontSize={"2rem"} fontWeight={"600"} padding={"8px"}>
          Rewards
          <Box
            margin={"7px"}
            sx={{
              height: "4px",
              borderRadius: "8px",
              bgcolor: theme.palette.primary.main,
              marginTop: "4px",
            }}
          />
          <Typography fontSize={"8px"}>
            Rewards in "Cred Dost" are subject to availability and may change
          </Typography>
          <Typography fontSize={"8px"}>
            without notice. School sharks is not responsible for third-party
          </Typography>
          <Typography fontSize={"8px"}>
            products or services provided as rewards.
          </Typography>
        </Typography>
        {/* <img src={searchIcon} alt="search" /> */}
      </Stack>

      <Stack
        padding={"5px"}
        margin={"10px"}
        direction={"row"}
        justifyContent={"space-between"}
      >
        <Typography fontSize={"15px"} fontWeight={"600"}>
          Recent
        </Typography>
        <Stack flexDirection={"column"} alignItems="center">
          <Button size="small" variant="outlined" sx={{ borderRadius: "12px" }}>
            20 Points
          </Button>
          <Typography fontSize={"8px"} fontWeight={"600"}>
            O points used
          </Typography>
        </Stack>
      </Stack>

      <Stack flex={"1"}>
        {rewardsArray.map((reward, index) => (
          <Stack
            key={index}
            direction={"column"}
            padding={"30px"}
            margin={"10px"}
            bgcolor={theme.palette.secondary.main}
            border={"1px solid #796E6E"}
            borderRadius={"10px"}
          >
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography fontWeight={"800"} fontSize={"20px"}>
                {reward.title}
              </Typography>
            </Stack>

            <Typography fontSize={"15px"}>{reward.content}</Typography>

            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              marginTop={"15px"}
            >
              <Button
                variant="outlined"
                size={"small"}
                sx={{
                  borderRadius: "18px",
                  textTransform: "none",
                  borderColor: "black",
                  color: "black",
                  backgroundColor: "white",
                }}
              >
                Redeem
              </Button>
              <Button
                variant="outlined"
                size={"small"}
                sx={{
                  borderRadius: "18px",
                  textTransform: "none",
                  borderColor: "black",
                  color: "black",
                }}
              >
                {reward.points} points
              </Button>
              <Typography fontSize={"10px"} marginTop={"7px"}>
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

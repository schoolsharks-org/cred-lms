import { Stack, Typography, Box, useTheme, Card, Button } from "@mui/material";
import { useState } from "react";
import module1 from "../../../assets/Module1.png";
import module2 from "../../../assets/Module2.png";
import module3 from "../../../assets/Module3.png";
const HelpSectionModule = () => {
  const theme = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(0); // State for tracking the current index
  const array = [
    {
      title: "Click on the Application Status Tab in SFL Mobile App",
      img: module1, // Using imported module1 image here
    },
    {
      title: "Entered Loan ID in Application No. and click on Submit Button",
      img: module2, // sample image link
    },
    {
      title: "Click on Clock button to Start E-NACH",
      img: module3, // sample image link
    },
  ];

  return (
    <>
      <Stack height={"100vh"} padding={"20px"}>
        {/* Title */}
        <Stack width={"max-content"} padding={"12px"}>
          <Typography fontSize={"1.5rem"} fontWeight={"600"} maxWidth={"80%"}>
            New E-NACH process Via Aadhaar
          </Typography>
          <Box
            sx={{
              height: "4px",
              borderRadius: "8px",
              bgcolor: theme.palette.primary.main,
              marginTop: "4px",
            }}
          />
        </Stack>

        {/* Number Navigation */}
        <Stack direction="row" spacing={1} marginTop={"10px"}>
          <Typography fontSize={"1.5rem"} fontWeight={"600"}>
            Step-
          </Typography>
          {array.map((item, index) => (
            <Button
              key={index}
              variant={selectedIndex === index ? "contained" : "outlined"}
              //   color="primary"
              sx={{
                borderColor: "black", // Set border color to black for outlined buttons
                minWidth: "40px",
                color: selectedIndex === index ? "white" : "black",
              }}
              onClick={() => setSelectedIndex(index)} // Update selectedIndex on click
            >
              {index + 1}
            </Button>
          ))}
        </Stack>

        {/* Card with dynamic content */}
        <Stack marginTop={"20px"}>
          <Card
            sx={{
              backgroundColor: "#800000",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "20px", // Optional: Add space between cards
            }}
          >
            <img
              src={array[selectedIndex].img} // Dynamic image based on selectedIndex
              alt="Module Image"
              style={{
                objectFit: "cover", // Ensures image fits well in its box
                marginTop: "10px",
              }}
            />

            {/* Stack for title */}
            <Stack color={"#ffffff"} padding={"12px"}>
              <Typography>Steps to follow-</Typography>
              <Typography
                fontWeight={"400"}
                maxWidth={"80%"}
                fontSize={"1.2rem"}
              >
                {array[selectedIndex].title} {/* Dynamic title */}
              </Typography>
            </Stack>
          </Card>
        </Stack>
      </Stack>
    </>
  );
};

export default HelpSectionModule;

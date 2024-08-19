import { BottomNavigation, BottomNavigationAction, Stack } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AccountCircle,
  Equalizer,
  Home,
  LocalOffer,
} from "@mui/icons-material";

const USER_TABS = [
  { value: "Home", icon: <Home /> },
  { value: "Score", icon: <Equalizer /> },
  { value: "Offer", icon: <LocalOffer /> },
  { value: "Profile", icon: <AccountCircle /> },
];

const BottomNav = () => {
  const [tab, setTab] = useState<number>(0);
  const navigate = useNavigate();

  const handleTabChange = (tab: number) => {
    setTab(tab);
    navigate(USER_TABS[tab].value.toLowerCase());
  };

  return (
    <Stack
      sx={{
        position:"fixed",
        bottom:"0",
        maxWidth: "480px",
        width: "100%",
        margin: "auto",
        boxShadow:"0 -4px 10px #00000022",
        zIndex:"999"
      }}
    >
      <BottomNavigation
        showLabels
        value={tab}
        sx={{ flex: "1",padding:"8px" }}
        onChange={(_, newValue) => {
          handleTabChange(newValue);
        }}
      >
        {USER_TABS.map((tab, index) => (
          <BottomNavigationAction
            key={index}
            label={tab.value}
            icon={tab.icon}
          />
        ))}
      </BottomNavigation>
    </Stack>
  );
};

export default BottomNav;

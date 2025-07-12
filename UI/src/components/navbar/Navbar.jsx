import { Box, Grid2, Paper } from "@mui/material";
import { Logo } from "../logo/Logo";
import { Menu } from "./menu/Menu";
import { Account } from "./account/Account";
import theme from "../../services/theme";
import { PageContainer } from "../PageContainer/PageContainer";
import { useState } from "react";

export const Navbar = () => {

  const [isMobile, setMobile] = useState();

  return (
    <Paper
      sx={{
        backgroundColor: theme.palette.primary.main,
        borderRadius: 0,
      }}
    >
      <PageContainer>
        <Grid2
          container
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "1em 0",
          }}
        >
          <Grid2>
            <Logo />
          </Grid2>
          <Grid2
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              columnGap: '.2em',
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Menu />            
            <Account />
          </Grid2>
          {/* dropdown */}
        </Grid2>
      </PageContainer>
    </Paper>
  );
};

Navbar.Menu = Menu;

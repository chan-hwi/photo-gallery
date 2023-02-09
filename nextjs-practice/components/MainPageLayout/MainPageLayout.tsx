"use client";

import { Grid } from "@mui/material";
import { ReactNode } from "react";
import Sidebar from "../Sidebar/Sidebar";

type Props = {
  children: ReactNode;
}

function LandingPage({ children } : Props) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={9}>
        {children}
      </Grid>
    </Grid>
  );
}

export default LandingPage;

"use client";

import { useEffect, useState } from "react";
import { getApplications } from "@/services/careerService";
import CareerTable from "@/components/careers/CareerTable";
import { Typography } from "@mui/material";
export default function CareersPage() {

  const [applications, setApplications] = useState([]);


  const loadData = async () => {
    try {

      const res = await getApplications();

    //  console.log("API RESPONSE:", res.data);

      setApplications(res.data.data || []);

    } catch (error) {

      console.log(error);

    }
  };


  useEffect(() => {
    loadData();
  }, []);


  return (<>
  <Typography sx={{py:3,px:5,fontSize:"2rem",fontWeight:"600" }}>Job Applications</Typography>
   <CareerTable
   sx={{  mx:3,}}
      data={applications}
      reload={loadData}
    />
  </>

  );
}
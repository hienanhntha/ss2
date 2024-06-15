import styled from "styled-components";
import { useGetResources } from "../hooks/api_hooks/test";
import { Button, TextField } from '@mui/material';
import { Card, CardContent, Typography } from '@mui/material';
import { useState, useMemo, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { PiIdentificationCardBold } from "react-icons/pi";
import { GrResources } from "react-icons/gr";
import { MdOutlineMailOutline } from "react-icons/md";

export default function Resources() {
  const { data: resources } = useGetResources();
  const resourcesData = useMemo(() => {
    console.log(resources?.metadata);
    return resources?.metadata;
  }, [resources]);
  return <Wrapper>
    <ResourceContainer>
        {resourcesData?.length > 0 ? 
        <>
        {resourcesData.map((r, idx) => (
          <ResourceCard key={idx}>
            <CardContent>
              <Typography variant="h5" component="div">
                Test Name: {r?.testName}
              </Typography>
              <Typography variant="body1">
                <FaUser />   Done By: {r?.userInfo?.fullName}
              </Typography>
              <Typography variant="body1">
                <PiIdentificationCardBold />   UserId: {r?.userInfo?.userId}
              </Typography>
              <Typography variant="body1">
                <MdOutlineMailOutline />   Email: {r?.userInfo?.email}
              </Typography>
              <Typography variant="body1">
                <GrResources />   Resource: {r?.resourceUrl}
              </Typography>
            </CardContent>
          </ResourceCard>
        ))}
        </> : 
        <div style={{margin: "30px auto", fontSize: "30px", fontWeight: "600"}}> No test created before</div>}
      </ResourceContainer>
  </Wrapper>
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  height: auto;
  min-height: 500px;
  width: 80%;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
  padding: 20px;
  padding-bottom: 50px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1), /* Soft shadow for subtle depth */
    0 1px 3px rgba(0, 0, 0, 0.08), /* Smaller shadow for fine detail */
    0 10px 20px rgba(0, 0, 0, 0.5); /* Larger shadow for dramatic effect */
`

const ResourceContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-blue-1-lighter);
  border-radius: 8px;
  padding: 10px;
`;

const ResourceCard = styled(Card)`
  margin-bottom: 10px;
`;
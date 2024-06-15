import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import * as React from "react";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useSignOut } from "../hooks/api_hooks/user";
import { useAuth } from "../context/AuthContext";
import { useGetUserInfo } from "../hooks/api_hooks/user";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/userSlice";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { mutate: signOut } = useSignOut();
  const { data: userInfo, isLoading, error } = useGetUserInfo();
  const [userType, setUserType] = React.useState('normal');

  React.useEffect(() => {
    if (userInfo?.success) {
      setUserType(userInfo?.metadata?.userType);
    }
  }, [userInfo]);
  
  React.useEffect(() => {
    console.log(userType);
  }, [userType]);
  const handleClick = (event) => {  
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function onLogOut() {
    if (localStorage.getItem('token') !== undefined) {
      signOut({}, {
        onSuccess: (data) => {
          if (data.success) {
            setIsAuthenticated(false);
            localStorage.clear();
            navigate("/sign-in");
          }
        },
      })
    }
  }

  React.useEffect(() => {
    dispatch(setUserInfo(userInfo?.metadata))
  }, [userInfo])

  return <HeaderWrapper>
    <HeaderLeft>
      <Link to="/dashboard">
        <img src="assets/logo.png" style={{ width: "10vw", height: "100%" }} alt="dashboard" />
      </Link>
      <Link to="/dashboard">
        <Button id="basic-button">
          DASHBOARD
        </Button>
      </Link>
      <Link to="/test-list">
        <Button id="basic-button">
          Doing Test
        </Button>
      </Link>
      {userType === 'admin' && <>
        <Link to="/instructor">
        <Button id="basic-button">
          Instructor
        </Button>
      </Link>
      <Link to="/resources">
        <Button id="basic-button">
          Resources
        </Button>
      </Link>
      </>}
    </HeaderLeft>
    <HeaderRight>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {userInfo?.metadata?.fullName}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem> */}
        <MenuItem onClick={onLogOut}>Logout</MenuItem>
      </Menu>
    </HeaderRight>
  </HeaderWrapper>
}

const HeaderWrapper = styled.div`
  position: relative;
  display: flex;
  height: 70px;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.3);
  border-bottom-radius: 10px;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1), /* Soft shadow for subtle depth */
    0 1px 3px rgba(0, 0, 0, 0.08), /* Smaller shadow for fine detail */
    0 10px 20px rgba(0, 0, 0, 0.2); /* Larger shadow for dramatic effect */

  div {
    height: 100%;
  }
`

const HeaderLeft = styled.div`
  position: absolute;
  left: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
`

const HeaderRight = styled.div`
  position: absolute;
  right: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
`
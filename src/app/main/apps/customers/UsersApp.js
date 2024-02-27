import FusePageSimple from "@fuse/core/FusePageSimple";
import withReducer from "app/store/withReducer";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useDeepCompareEffect } from "@fuse/hooks";
import { styled } from "@mui/material/styles";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import ContactsSidebarContent from "./UsersSidebarContent";
import ContactsHeader from "./UsersHeader";
import ContactsList from "./UsersList";
import reducer from "./store";

import { getContacts } from "./store/contactsSlice";
import { selectUser } from "app/store/userSlice";
// import { useSelector } from "react-redux";
const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
  },
}));

function CustomersApp(props) {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  useDeepCompareEffect(() => {
    dispatch(getContacts());
  }, [dispatch]);

  useEffect(() => {
    if (user?.organizations?.length === 0) {
      navigate("/projects/new");
    }
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  return (
    <Root
      header={<ContactsHeader pageLayout={pageLayout} />}
      content={<ContactsList />}
      ref={pageLayout}
      rightSidebarContent={<ContactsSidebarContent />}
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarWidth={640}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default withReducer("customersApp", reducer)(CustomersApp);

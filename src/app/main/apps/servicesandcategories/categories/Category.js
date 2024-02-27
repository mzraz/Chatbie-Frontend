import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "../store";
import ProductsHeader from "./CategoryHeader";
import ProductsTable from "./CategoryTable";
import { selectUser } from "app/store/userSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Products() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.organizations?.length === 0) {
      navigate("/projects/new");
    }
  }, []);

  return (
    <FusePageCarded
      header={<ProductsHeader />}
      content={<ProductsTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default withReducer("servicesCategories", reducer)(Products);

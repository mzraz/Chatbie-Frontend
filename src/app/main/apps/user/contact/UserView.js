import Button from "@mui/material/Button";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Box from "@mui/system/Box";
import { selectUser } from "app/store/userSlice";
import { ImBin } from "react-icons/im";
import _ from "@lodash";
import { getContact, selectContact, removeContact } from "../store/userSlice";
import { useSelect } from "@mui/base";
import { selectContacts } from "../store/contactsSlice";
import { showMessage } from "app/store/fuse/messageSlice";

const ContactView = () => {
  const contact = useSelector(selectContact);
  const user = useSelector(selectUser);
  const routeParams = useParams();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getContact(routeParams.id));
  }, [dispatch, routeParams]);

  if (!contact) {
    return <FuseLoading />;
  }

  const deleteUser = () => {
    const currentUrl = window.location.href;
    const id = currentUrl.split("/");

    dispatch(removeContact(id[id.length - 1])).then((res) => {
      if (
        !res?.payload?.errors &&
        res?.payload !== undefined &&
        !res?.payload?.error
      ) {
        dispatch(
          showMessage({
            message: "User Deleted Successfully",
            variant: "error",
          })
        );
        navigate("/users/");
      } else {
        dispatch(
          showMessage({
            message:
              "Unable to delete Provider because services are associated with providers and appointments.",
            variant: "error",
          })
        );
        navigate("/users/");
      }
    });
  };
  return (
    <>
      <Box
        className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
        sx={{
          backgroundColor: "background.default",
        }}
      >
        {contact.background && (
          <img
            className="absolute inset-0 object-cover w-full h-full"
            src={contact.background}
            alt="user background"
          />
        )}
      </Box>
      <div className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0">
        <div className="w-full max-w-3xl">
          <div className="flex flex-auto items-end -mt-64">
            <Avatar
              sx={{
                borderWidth: 4,
                borderStyle: "solid",
                borderColor: "background.paper",
                backgroundColor: "background.default",
                color: "text.secondary",
              }}
              className="w-128 h-128 text-64 font-bold"
              src={contact?.avatar}
              alt={contact?.user_name}
            >
              {contact?.user_name?.charAt(0)}
            </Avatar>
            {user.role === "Manager" ? null : (
              <div className="flex items-center ml-auto mb-4">
                <Button
                  style={{
                    margin: "8px",
                  }}
                  variant="contained"
                  color="secondary"
                  component={NavLinkAdapter}
                  to="edit"
                >
                  <FuseSvgIcon size={20}>
                    heroicons-outline:pencil-alt
                  </FuseSvgIcon>
                  <span className="mx-8">Edit</span>
                </Button>

                <Button
                  style={{
                    backgroundColor: "red",
                  }}
                  variant="contained"
                  color="secondary"
                  // component={NavLinkAdapter}
                  // to="delete"
                  onClick={() => {
                    deleteUser();
                  }}
                >
                  <ImBin size={20} />
                  <span className="mx-8">Delete</span>
                </Button>
              </div>
            )}
          </div>

          <Typography className="mt-12 text-4xl font-bold truncate">
            {contact.first_name}
          </Typography>

          <Divider className="mt-16 mb-24" />
          <div className="flex flex-col space-y-32">
            <div className="flex">
              <FuseSvgIcon>heroicons-outline:mail</FuseSvgIcon>
              <div className="min-w-0 ml-24 space-y-4">
                <div
                  className="flex items-center leading-6"
                  key={contact.email}
                >
                  <a
                    className="hover:underline text-primary-500"
                    href={`mailto: ${contact.email}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex">
              <FuseSvgIcon>heroicons-outline:phone</FuseSvgIcon>
              <div className="min-w-0 ml-24 space-y-4">
                <div className="flex items-center leading-6">
                  <div className="ml-10 font-mono">{contact.phone_number}</div>

                  {contact.mobile_number ? (
                    <div className="ml-10 font-mono">
                      {contact.mobile_number}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <h1 className="mt-16">Appointments</h1>
        </div>
      </div>
    </>
  );
};

export default ContactView;

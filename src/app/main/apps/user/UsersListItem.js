import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";

function ContactListItem(props) {
  const { contact } = props;

  return (
    <>
      <ListItem
        className="px-32 py-16"
        sx={{ bgcolor: "background.paper" }}
        button
        component={NavLinkAdapter}
        to={`/users/${contact.id}`}
      >
        {/* <ListItemAvatar>
          <Avatar alt={contact.name} src={contact.avatar} />
        </ListItemAvatar> */}
        <ListItemText
          classes={{ root: "m-0", primary: "font-medium leading-5 truncate" }}
          primary={contact.user_name}
          secondary={
            <>
              <Typography
                className="inline"
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {contact.first_name} {contact.last_name}
              </Typography>
            </>
          }
        />
      </ListItem>
      <Divider />
    </>
  );
}

export default ContactListItem;

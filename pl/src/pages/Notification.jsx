import { useEffect, useState } from "react";
import API from "../api/api";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText
} from "@mui/material";

const Notifications = () => {
  const [noti, setNoti] = useState([]);

  useEffect(() => {
    API.get("/notifications").then((res) => setNoti(res.data));
  }, []);

  return (
    <Container>
      <Typography variant="h4" mt={4}>Notifications</Typography>

      <List>
        {noti.map((n) => (
          <ListItem key={n._id}>
            <ListItemText primary={n.message} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Notifications;

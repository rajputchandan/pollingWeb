import { useEffect, useState } from "react";
import API from "../api/api";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MainLayout from "../layout/MainLayout";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [invitedEvents, setInvitedEvents] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/events/dashboard").then((res) => {
      setMyEvents(res.data.myEvents || []);
      setInvitedEvents(res.data.invitedEvents || []);
    });
  }, []);

  const handleDelete = async () => {
    await API.delete(`/events/${deleteId}`);
    setMyEvents((p) => p.filter((e) => e._id !== deleteId));
    setDeleteId(null);
  };

  const EventCard = ({ event, label }) => (
    <Grid item xs={12} sm={6} md={6} lg={4}>
      <Card
        onClick={() => navigate(`/event/${event._id}`)}
        sx={{
          minHeight: 220,
          cursor: "pointer",
          position: "relative",
          borderRadius: 3,
          transition: "0.25s",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.12)"
          },
          width:'250px'
        }}
      >
        {label === "HOST" && (
          <IconButton
            color="error"
            size="small"
            sx={{ position: "absolute", top: 10, right: 1,  }}
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(event._id);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}

        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {event.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ minHeight: 44 }}>
            {event.description || "No description"}
          </Typography>

          <Divider sx={{ my: 1.5 }} />

          <Typography variant="caption" display="block">
            👥 Participants: {event.participantsCount}
          </Typography>
          <Typography variant="caption" display="block">
            🗳️ Polls: {event.pollsCount}
          </Typography>

          <Typography
            variant="caption"
            fontWeight={600}
            color={label === "HOST" ? "success.main" : "primary.main"}
          >
            {label === "HOST" ? "👑 Host" : "🙋 Invited"}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <MainLayout>
      {/* HEADER */}
      <Box mb={5}>
        <Typography variant="h4" fontWeight={700}>
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          Manage your events and polls
        </Typography>
      </Box>

      {/* MY EVENTS */}
      <Box mb={7}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          My Created Events
        </Typography>

        <Grid container spacing={3}>
          {myEvents.length === 0 ? (
            <Grid item xs={12}>
              <Typography color="text.secondary">
                No events created yet.
              </Typography>
            </Grid>
          ) : (
            myEvents.map((e) => (
              <EventCard key={e._id} event={e} label="HOST" />
            ))
          )}
        </Grid>
      </Box>

      {/* INVITED EVENTS */}
      <Box>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Invited Events
        </Typography>

        <Grid container spacing={3}>
          {invitedEvents.length === 0 ? (
            <Grid item xs={12}>
              <Typography color="text.secondary">
                No invited events.
              </Typography>
            </Grid>
          ) : (
            invitedEvents.map((e) => (
              <EventCard key={e._id} event={e} label="INVITED" />
            ))
          )}
        </Grid>
      </Box>

      {/* DELETE DIALOG */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          This will permanently delete the event and its polls.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default Dashboard;

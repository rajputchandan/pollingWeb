import { Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{event.title}</Typography>
        <Typography variant="body2">{event.description}</Typography>

        <Button
          size="small"
          sx={{ mt: 1 }}
          onClick={() => navigate(`/event/${event._id}`, { state: { event } })}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;

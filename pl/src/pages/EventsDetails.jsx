import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Divider,
  LinearProgress,
  Chip,
  Grid
} from "@mui/material";

const EventDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  const loadDetails = async () => {
    const res = await API.get(`/events/${id}/details`);
    setData(res.data);
  };

  useEffect(() => {
    loadDetails()
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const vote = async (pollId, optionIndex) => {
    await API.post("/polls/vote", {
      pollId,
      optionIndex
    });
    loadDetails();
  };

  if (loading) return <LinearProgress />;
  if (!data) return <Typography>No data found</Typography>;

  const { event, participants, polls } = data;

  return (
    <Container maxWidth="md">
      {/* ================= EVENT INFO ================= */}
      <Box mt={4} mb={3}>
        <Typography variant="h4" fontWeight={600}>
          {event.title}
        </Typography>

        <Typography color="text.secondary">
          {event.description}
        </Typography>

        {event.date && (
          <Typography variant="body2" mt={1}>
            📅 {new Date(event.date).toDateString()}
          </Typography>
        )}
      </Box>

      <Divider />

      {/* ================= PARTICIPANTS ================= */}
      <Box mt={3}>
        <Typography variant="h6">
          Participants ({participants.length})
        </Typography>

        <Box mt={1}>
          {participants.map((p) => (
            <Chip
              key={p._id}
              label={p.name}
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
      </Box>

      <Divider sx={{ mt: 3 }} />

      {/* ================= POLLS ================= */}
      <Typography variant="h5" mt={3}>
        Poll Results
      </Typography>

      {polls.length === 0 && (
        <Typography mt={2}>No polls yet</Typography>
      )}

      {polls.map((poll) => {
        const maxVotes = Math.max(
          ...poll.options.map((o) => o.votes)
        );

        const winners = poll.options.filter(
          (o) => o.votes === maxVotes && maxVotes > 0
        );

        const userVoted = poll.votedUsers.includes(user.id);
        const allVoted = poll.pendingUsers.length === 0;

        return (
          <Card key={poll._id} sx={{ mt: 3 }}>
            <CardContent>
              {/* QUESTION HEADER */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">
                  {poll.question}
                </Typography>

                {allVoted && (
                  <Chip
                    color="success"
                    label="Result Final"
                  />
                )}
              </Box>

              {/* WINNER TEXT */}
              {allVoted && winners.length > 0 && (
                <Typography
                  variant="subtitle2"
                  sx={{
                    mt: 1,
                    fontWeight: 600,
                    color: "success.main"
                  }}
                >
                  🏆 Winner:
                  {winners.length === 1
                    ? ` ${winners[0].text}`
                    : ` Tie between ${winners
                        .map((w) => w.text)
                        .join(", ")}`}
                </Typography>
              )}

              {/* OPTIONS */}
              {poll.options.map((opt, idx) => {
                const percent =
                  poll.totalVotes === 0
                    ? 0
                    : Math.round(
                        (opt.votes / poll.totalVotes) * 100
                      );

                const isWinner =
                  opt.votes === maxVotes && maxVotes > 0;

                return (
                  <Box key={idx} mt={2}>
                    <Button
                      fullWidth
                      disabled={userVoted}
                      variant={
                        isWinner
                          ? "contained"
                          : "outlined"
                      }
                      color={
                        isWinner
                          ? "success"
                          : "primary"
                      }
                      onClick={() =>
                        vote(poll._id, idx)
                      }
                    >
                      {opt.text}
                      {isWinner && " 🏆"} — {opt.votes} votes ({percent}%)
                    </Button>

                    <LinearProgress
                      variant="determinate"
                      value={percent}
                      sx={{
                        mt: 0.5,
                        height: 8,
                        borderRadius: 5
                      }}
                      color={
                        isWinner
                          ? "success"
                          : "primary"
                      }
                    />
                  </Box>
                );
              })}

              <Typography
                variant="caption"
                display="block"
                mt={2}
              >
                Total Votes: {poll.totalVotes}
              </Typography>

              {/* PENDING USERS */}
              {!allVoted && (
                <Box mt={2}>
                  <Typography variant="subtitle2">
                    Pending Votes ({poll.pendingUsers.length})
                  </Typography>

                  <Grid container spacing={1} mt={1}>
                    {poll.pendingUsers.map((u) => (
                      <Grid item key={u.id}>
                        <Chip
                          size="small"
                          label={u.name}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        );
      })}
    </Container>
  );
};

export default EventDetails;

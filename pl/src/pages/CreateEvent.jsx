import { useState, useEffect } from "react";
import {
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  Autocomplete,
  Chip
} from "@mui/material";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const steps = ["Create Event", "Create Poll", "Add Participants"];

const CreateEvent = () => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [eventId, setEventId] = useState(null);

  /* ---------- STEP 1 ---------- */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  /* ---------- STEP 2 ---------- */
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [polls, setPolls] = useState([]);

  /* ---------- STEP 3 ---------- */
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  /* ---------- STEPPER ---------- */
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  /* ================= STEP 1: CREATE EVENT ================= */
  const createEvent = async () => {
    const res = await API.post("/events", {
      title,
      description,
      date
    });

    setEventId(res.data._id);
    handleNext();
  };

  /* ================= STEP 2: CREATE POLL ================= */
  const addOption = () => setOptions([...options, ""]);

  const createPoll = async () => {
    await API.post("/polls", {
      eventId,
      question,
      options: options.map((o) => ({ text: o }))
    });

    setPolls([...polls, { question, options }]);
    setQuestion("");
    setOptions(["", ""]);
  };

  /* ================= STEP 3: FETCH USERS ================= */
  useEffect(() => {
    if (activeStep === 2) {
      API.get("/users").then((res) => {
        setUsers(res.data);
      });
    }
  }, [activeStep]);

  /* ================= STEP 3: INVITE ================= */
  const inviteParticipants = async () => {
    const emails = selectedUsers.map((u) => u.email);

    await API.post(`/events/${eventId}/invite`, {
      emails
    });

    navigate("/");
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" mb={3}>
        Create Event (Step by Step)
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box mt={4}>
        {/* ================= STEP 1 ================= */}
        {activeStep === 0 && (
          <>
            <TextField
              fullWidth
              label="Event Title"
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <TextField
              fullWidth
              label="Description"
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <TextField
              fullWidth
              type="date"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <Button variant="contained" onClick={createEvent}>
              Create Event
            </Button>
          </>
        )}

        {/* ================= STEP 2 ================= */}
        {activeStep === 1 && (
          <>
            <TextField
              fullWidth
              label="Poll Question"
              margin="normal"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            {options.map((opt, i) => (
              <TextField
                key={i}
                fullWidth
                label={`Option ${i + 1}`}
                margin="normal"
                value={opt}
                onChange={(e) => {
                  const copy = [...options];
                  copy[i] = e.target.value;
                  setOptions(copy);
                }}
              />
            ))}

            <Button onClick={addOption}>+ Add Option</Button>

            <Box mt={2}>
              <Button variant="contained" onClick={createPoll}>
                Add Poll
              </Button>

              <Button sx={{ ml: 2 }} onClick={handleNext}>
                Next
              </Button>
            </Box>

            {polls.map((p, i) => (
              <Card key={i} sx={{ mt: 2 }}>
                <CardContent>
                  <Typography>{p.question}</Typography>
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {/* ================= STEP 3 ================= */}
        {activeStep === 2 && (
          <>
            <Typography variant="h6" mb={2}>
              Add Participants
            </Typography>

            <Autocomplete
              multiple
              options={users}
              value={selectedUsers}
              onChange={(e, newValue) =>
                setSelectedUsers(newValue)
              }
              getOptionLabel={(option) =>
                `${option.name} (${option.email})`
              }
              filterSelectedOptions
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                    key={option._id}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search by name or email"
                  placeholder="Type name or email"
                />
              )}
            />

            <Button
              variant="contained"
              sx={{ mt: 3 }}
              disabled={selectedUsers.length === 0}
              onClick={inviteParticipants}
            >
              Finish & Send Invites
            </Button>
          </>
        )}

        {/* BACK BUTTON */}
        {activeStep > 0 && (
          <Button sx={{ mt: 3 }} onClick={handleBack}>
            Back
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default CreateEvent;

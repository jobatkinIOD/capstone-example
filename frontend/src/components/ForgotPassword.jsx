import React, {useContext, useState} from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import axios from 'axios'

export default function ForgotPassword() {

    const [email, setEmail] = useState('')
    const [resultMsg, setResultMsg] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault();
        axios.post('/api/users/sendpw', {email: email})
            .then(response => setResultMsg(response.data.result))
            .catch(err => setResultMsg(err.response.data.result))
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <TextField required fullWidth autoFocus
                    margin="normal"
                    id="email" label="Email" name="email" type="email"
                    value={email} onChange={e => setEmail(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Send Password Reminder
                </Button>

                <p>{resultMsg}</p>
            </Box>
        </Container>
    );
}
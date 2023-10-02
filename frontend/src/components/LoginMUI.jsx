import React, {useContext} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useUserContext } from '../context/UserContext';
import axios from 'axios'

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function Login() {

    const { currentUser, handleUpdateUser } = useUserContext();

    const [loggedIn, setLoggedIn] = React.useState(currentUser.firstName)
    const [errMsg, setErrMsg] = React.useState('')
    const [loginAttempts, setLoginAttempts] = React.useState(0)

    console.log(currentUser)

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
          email: data.get('email'),
          password: data.get('password'),
        });
    
        let userEmail = data.get('email')
        let userPassword = data.get('password')

        let loggedInUser = null;

        //login successful/true if both values exist and match
        //let isLoggedIn = (user && password && user === password)

        try {
            let response = await axios.post('/api/users/login', {email: userEmail, password: userPassword});
            loggedInUser = response.data.data;
            console.log(loggedInUser)

        } catch (err) {
            console.log(err.message)
            setErrMsg(err.message + ': ' + err.response.data.result);
        }

        if (!loggedInUser) {
            let newAttempts = loginAttempts + 1

            if (newAttempts === 5) {
                setErrMsg('Maximum login attempts exceeded. You are blocked.');
            }
            else {
                setErrMsg('Unsuccessful login attempt #' + newAttempts + ' of 5');
            }
            setLoginAttempts(newAttempts)
            setLoggedIn(false)
        } else {
            setErrMsg('')
            handleUpdateUser(loggedInUser)
            setLoggedIn(true)
        }

    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    {/* display profile photo if logged in - path is relative to backend */}
                    {loggedIn ? <img src={currentUser.profilePhoto} width="40" alt={currentUser.profilePhotoTitle}/> : <LockOutlinedIcon />}
                </Avatar>
                <Typography component="h1" variant="h5">
                    {loggedIn ? 'Hello '+currentUser.firstName : 'Please log in'}
                </Typography>

                { (!loggedIn && loginAttempts < 5) ?

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            type="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <p>{errMsg}</p>
                        <Grid container>
                            <Grid item xs>
                                <Link to="/forgotpw">Forgot password?</Link>
                            </Grid>
                            <Grid item>
                                <Link to="/signup">Don't have an account? Sign Up</Link>
                            </Grid>
                        </Grid>
                    </Box>
                 : <Button onClick={() => { handleUpdateUser({}); setLoggedIn(false); }}>Log Out</Button> }
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}
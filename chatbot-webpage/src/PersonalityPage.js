import * as React from 'react';
import './PersonalityPage.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import UofT from './uoft_logo.png';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

function PersonalityPage() {
    const [personality, setPersonality] = React.useState('');
    const handleChange = (event) => {
        console.log("personality: " + (event.target.value))
        setPersonality(event.target.value);
    };
    return (
        <div className="personality-page">
            <div className="logo">
                <img src={UofT} alt="UofT" />
            </div>
            <br />
            <br />
            <div className="inputs">
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                    >
                    <TextField 
                        id="user-personality" 
                        label="What is your personality?" 
                        variant="standard" 
                        value={personality}
                        onChange={handleChange}/>
                </Box>
                <br/>
                
                <Link to="/chat-page">
                    <Stack spacing={2} direction="row">
                        <Button variant="outlined">Talk with our AI Chatbot</Button>
                    </Stack>
                </Link>
            </div>
        </div>
    );
}

export default PersonalityPage;

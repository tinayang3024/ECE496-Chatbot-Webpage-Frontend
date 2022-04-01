import * as React from 'react';
import './PersonalityPage.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
// import UofT from './uoft_logo.png';
import SendIcon from '@mui/icons-material/Send';
// import { styled } from '@mui/material/styles';
import styled, { css } from 'styled-components';
import Switch from '@mui/material/Switch';
import chatbot_logo from './chatbot.png';
import {
    BrowserRouter as Router,
    Link
  } from "react-router-dom";
import FormControlLabel from '@mui/material/FormControlLabel';

function PersonalityPage() {
    const [formal, setFormal] = React.useState(false);
    const [label, setLabel] = React.useState("Formal Chatbot");
    const handleChange = (event) => {
        setFormal(!formal);
        if (formal) {
            setLabel("Formal Chatbot")
        } else {
            setLabel("Informal Chatbot")
        }
    };
    return (
        <div className="personality-page">
            <div className="logo">
                <img src={chatbot_logo} alt="Chatbot Icon" />
            </div>
            <br />
            <br />
            <div className="inputs">
                
                <FormControlLabel
                    id="control-label"
                    sx={{
                    display: 'block',
                    }}
                    control={
                        <Switch
                        checked={formal}
                        onChange={handleChange}
                        name="style"
                        color="primary"
                    />
                    }
                    label={label}
                />
                <br/>
                <Link to="/chat-page">
                    <Stack spacing={2} direction="row">
                        <Button id="redirect-button" variant="outlined" endIcon={<SendIcon />}>Talk with our Paraphrased Chatbot</Button>
                    </Stack>
                </Link>
            </div>
        </div>
    );
}

export default PersonalityPage;

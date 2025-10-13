import React from 'react';
import {Box, Container, Divider, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';
import {theme} from "../../styles/theme";

const StyledFooter = styled(Box)(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(4,2),
    marginTop: 'auto',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.75rem',
    lineHeight: 1.5,
    '& p': {
        margin: '0.8rem 0',
        whiteSpace: 'normal',
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.7rem',
        }
    }
}));

const Footer = () => {
    return (
        <StyledFooter component="footer">
            <Container maxWidth="xl" sx={{ mb: 6, px: { xs: 1, sm: 2 } }}>
                <Divider variant="middle" sx={{ mb: 6 }} />
                <Typography variant="body2" >
                    대표이사: 유병욱 | 사업자등록번호 : 250-81-00813
                </Typography>
                <Typography variant="body2" sx={{
                    [theme.breakpoints.down('sm')]: {
                        whiteSpace: 'normal',
                        wordBreak: 'keep-all'
                    }
                }}>
                    사업장: 서울시 강서구 마곡서로 205-21, 3층
                </Typography>
                <Typography variant="body2">
                    대표메일: spkoreaart@gmail.com | 전화번호: 070-8883-5120
                </Typography>
            </Container>
        </StyledFooter>
    );
};

export default Footer;
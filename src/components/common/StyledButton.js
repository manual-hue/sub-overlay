import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#333',
    color: theme.palette.text.primary,
    padding: theme.spacing(1.5),
    width: '100%',
    '&:hover': {
        backgroundColor: '#444',
    },
}));

export default StyledButton;
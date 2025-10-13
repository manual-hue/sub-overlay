import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
        color: theme.palette.text.primary,
        '& fieldset': {
            borderColor: theme.palette.text.secondary,
        },
        '&:hover fieldset': {
            borderColor: theme.palette.text.primary,
        },
    },
    '& .MuiInputLabel-root': {
        color: theme.palette.text.secondary,
    },
}));

export default StyledTextField;
import React from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { LAYER_TYPES } from '../hooks/useResourceManager';

const EditorLayerItem = ({ resource, isSelected, onSelect, onRemove }) => {
    return (
        <Paper
            elevation={isSelected ? 3 : 1}
            sx={{
                p: 1,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: isSelected ? 'action.selected' : 'background.paper',
                cursor: 'pointer',
                '&:hover': {
                    bgcolor: 'action.hover'
                }
            }}
            onClick={onSelect}
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {resource.type === LAYER_TYPES.IMAGE ? (
                    <ImageIcon sx={{ mr: 1, fontSize: 20 }} />
                ) : (
                    <TextFieldsIcon sx={{ mr: 1, fontSize: 20 }} />
                )}
                <Typography variant="body2" noWrap>
                    {resource.name}
                </Typography>
            </Box>
            <IconButton
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(resource.id);
                }}
            >
                <DeleteIcon fontSize="small" />
            </IconButton>
        </Paper>
    );
};

export default EditorLayerItem;
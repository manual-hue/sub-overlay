import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Slider,
    MenuItem, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';

const FONT_FAMILIES = [
    'Arial', 'Helvetica', 'Times New Roman', 'Courier New',
    'Georgia', 'Verdana', 'Impact', 'Noto Sans KR', 'Nanum Gothic',
    'Pretendard JP', 'Pretendard'
];

const TextEditorDialog = ({ open, onClose, initialText = {}, onSave }) => {
    const [text, setText] = useState(initialText.text || '');
    const [fontFamily, setFontFamily] = useState(initialText.fontFamily || 'Pretendard');
    const [fontSize, setFontSize] = useState(initialText.fontSize || 24);
    const [color, setColor] = useState(initialText.color || '#000000');
    const [textStyles, setTextStyles] = useState(initialText.textStyles || []);


    useEffect(() => {
        if (open) {
            setText(initialText.text || '');
            setFontFamily(initialText.fontFamily || 'Pretendard');
            setFontSize(initialText.fontSize || 24);
            setColor(initialText.color || '#000000');
            setTextStyles(initialText.textStyles || []);
        }
    }, [open, initialText]);

    const handleSave = () => {
        onSave({
            text,
            fontFamily,
            fontSize,
            color,
            textStyles
        });
        onClose();
    };

    const handleStyleChange = (event, newStyles) => {
        setTextStyles(newStyles || []);
    };

    const toggleBold = () => {
        if (textStyles.includes('bold')) {
            setTextStyles(textStyles.filter(style => style !== 'bold'));
        } else {
            setTextStyles([...textStyles, 'bold']);
        }
    };

    const toggleItalic = () => {
        if (textStyles.includes('italic')) {
            setTextStyles(textStyles.filter(style => style !== 'italic'));
        } else {
            setTextStyles([...textStyles, 'italic']);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {initialText.text ? '텍스트 수정' : '텍스트 추가'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2, mt: 1 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="텍스트"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography gutterBottom>폰트</Typography>
                    <TextField
                        select
                        fullWidth
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                    >
                        {FONT_FAMILIES.map((font) => (
                            <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                                {font}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography gutterBottom>
                        폰트 크기: {fontSize}px
                    </Typography>
                    <Slider
                        value={fontSize}
                        min={10}
                        max={400}
                        step={1}
                        onChange={(_, value) => setFontSize(value)}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography gutterBottom>텍스트 스타일</Typography>
                    <ToggleButtonGroup
                        value={textStyles}
                        onChange={handleStyleChange}
                        aria-label="text formatting"
                    >
                        <ToggleButton
                            value="bold"
                            aria-label="bold"
                            selected={textStyles.includes('bold')}
                            onClick={toggleBold}
                        >
                            <FormatBoldIcon />
                        </ToggleButton>
                        <ToggleButton
                              value="italic"
                              aria-label="italic"
                              selected={textStyles.includes('italic')}
                              onClick={toggleItalic}
                        >
                            <FormatItalicIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Box>
                    <Typography gutterBottom>색상</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                            sx={{
                                width: 24,
                                height: 24,
                                borderRadius: 1,
                                mr: 1,
                                bgcolor: color,
                                border: '1px solid rgba(0, 0, 0, 0.12)'
                            }}
                        />
                        <TextField
                            fullWidth
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            placeholder="#000000"
                        />
                    </Box>
                </Box>

                {/* 텍스트 입력 프리뷰 */}
                <Box
                    sx={{
                        mt: 3,
                        p: 2,
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 100
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: fontFamily,
                            fontSize: `${fontSize}px`,
                            fontWeight: textStyles.includes('bold') ? 'bold' : 'normal',
                            fontStyle: textStyles.includes('italic') ? 'italic' : 'normal',
                            color: color
                        }}
                    >
                        {text || '텍스트 미리보기'}
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>취소</Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={!text.trim()}
                >
                    저장
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TextEditorDialog;
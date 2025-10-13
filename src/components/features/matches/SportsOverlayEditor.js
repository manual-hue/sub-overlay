import React, { useState, useRef, useCallback } from 'react';
import { Box, Button, Stack, Typography, CircularProgress, Alert, AppBar, Toolbar,
    Menu, MenuItem, IconButton } from '@mui/material';
import { Rnd } from 'react-rnd';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddIcon from '@mui/icons-material/Add';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import EditorLayerItem from "../../../editor/EditorLayerItem";
import TextEditorDialog from "../../../editor/TextEditorDialog";
import useResourceManager, {LAYER_TYPES} from "../../../hooks/useResourceManager";


const SportsOverlayEditor = () => {
    //const { isAuthenticated } = useAuth();
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [textDialogOpen, setTextDialogOpen] = useState(false);
    const [currentTextResource, setCurrentTextResource] = useState(null);
    const fileInputRef = useRef(null);
    const [fileTypeError, setFileTypeError] = useState(null);

    const {
        resources,
        selectedResourceId,
        setSelectedResourceId,
        isModified,
        isLoading,
        isSaving,
        isUploading,
        error,
        handleResizeOrDrag,
        saveCurrentState,
        resetToPreviousPositions,
        resetToInitialPositions,
        uploadImage,
        addTextResource,
        updateTextResource,
        removeResource, addResource,
        checkResourceLimit
    } = useResourceManager();

    // 파일 업로드
    const handleFileUpload = useCallback(async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        // 파일 타입 검사 (png, gif만 허용)
        if (!file.type.match(/image\/(png|gif)/)) {
            setFileTypeError('PNG 또는 GIF 파일만 업로드 가능합니다.');
            event.target.value = '';
            return;
        }

        try {
            setFileTypeError(null);
            const result = await uploadImage(file);

            // 이미지 리소스 추가
            const newResource = {
                id: `resource-${Date.now()}`,
                type: LAYER_TYPES.IMAGE,
                name: result.filename,
                src: result.path,
                x: 100,
                y: 100,
                width: 200,
                height: 200,
            };

            addResource(newResource);
        } catch (error) {
            console.error('Upload failed:', error);
            setFileTypeError(error.message);
        } finally {
            // Reset file input
            event.target.value = '';
        }
    }, [uploadImage, addResource]);

    // 메뉴 클릭 이벤트
    const handleAddMenuClick = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    // 메뉴 닫기
    const handleAddMenuClose = () => {
        setMenuAnchorEl(null);
    };

    // 이미지 리소스 추가
    const handleAddImageClick = () => {
        if (checkResourceLimit()) {
            alert('이미지 리소스는 최대 15개까지만 추가할 수 있습니다.');
            handleAddMenuClose();
            return;
        }

        fileInputRef.current?.click();
        handleAddMenuClose();
    };

    const handleAddTextClick = () => {
        setCurrentTextResource(null);
        setTextDialogOpen(true);
        handleAddMenuClose();
    };

    const handleTextSave = (textData) => {
        if (currentTextResource) {
            updateTextResource(currentTextResource.id, textData);
        } else {
            addTextResource(textData.text, textData.fontFamily, textData.fontSize, textData.color, textData.textStyles);
        }
    };

    const handleEditText = (resource) => {
        setCurrentTextResource(resource);
        setTextDialogOpen(true);
    };

    const handleLayerSelect = (id) => {
        setSelectedResourceId(id);
    };

    // 에러 메시지 지우기
    const clearError = () => {
        setFileTypeError(null);
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '-webkit-fill-available',
            overflow: 'hidden',
            bgcolor: 'background.default'
        }}>
            {/* 상단 툴바 */}
            <AppBar position="static" color="default" elevation={0}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        방송용 오버레이 에디터
                    </Typography>

                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<AddIcon />}
                            onClick={handleAddMenuClick}
                            disabled={isLoading || isSaving || isUploading}
                        >
                            추가하기
                        </Button>

                        <Menu
                            anchorEl={menuAnchorEl}
                            open={Boolean(menuAnchorEl)}
                            onClose={handleAddMenuClose}
                        >
                            <MenuItem onClick={handleAddImageClick}>
                                <ImageIcon sx={{ mr: 1 }} />
                                이미지 추가
                            </MenuItem>
                            <MenuItem onClick={handleAddTextClick}>
                                <TextFieldsIcon sx={{ mr: 1 }} />
                                텍스트 추가
                            </MenuItem>
                        </Menu>

                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={async () => {
                                try {
                                    const success = await saveCurrentState();
                                    if (success) {
                                        alert('현위치가 저장되었습니다.');
                                    }
                                } catch (err) {
                                    console.error('Save error:', err);
                                    alert(`저장 실패: ${err.message}`);
                                }
                            }}
                            disabled={!isModified || isLoading || isSaving || isUploading}
                        >
                            {isSaving ? <CircularProgress size={24} color="inherit" /> : '현위치 저장하기'}
                        </Button>

                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<UndoIcon />}
                            onClick={resetToPreviousPositions}
                            disabled={isLoading || isSaving || isUploading}
                        >
                            이전 위치로
                        </Button>

                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<RestartAltIcon />}
                            onClick={resetToInitialPositions}
                            disabled={isLoading || isSaving || isUploading}
                        >
                            처음 위치로
                        </Button>
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* 메인 컨텐츠 영역 */}
            <Box sx={{
                display: 'flex',
                flexGrow: 1,
                overflow: 'hidden'
            }}>
                {/* 레이어 */}
                <Box sx={{
                    width: 250,
                    p: 2,
                    borderRight: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'auto'
                }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                        레이어 ({resources.length})
                    </Typography>

                    {resources.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
                            레이어가 없습니다. '추가하기' 버튼을 눌러 새 레이어를 추가해보세요.
                        </Typography>
                    ) : (
                        <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
                            {resources.map((resource) => (
                                <EditorLayerItem
                                    key={resource.id}
                                    resource={resource}
                                    isSelected={resource.id === selectedResourceId}
                                    onSelect={() => handleLayerSelect(resource.id)}
                                    onRemove={removeResource}
                                />
                            ))}
                        </Box>
                    )}
                </Box>

                {/* 에디터 캔버스 */}
                <Box sx={{
                    flexGrow: 1,
                    position: 'relative',
                    bgcolor: 'rgba(0, 0, 0, 0.05)',
                    backgroundImage: `url('/images/sample-broadcast.jpg')`, // Background image
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    overflow: 'hidden'
                }}>
                    {(isLoading || isUploading) && (
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'rgba(255, 255, 255, 0.7)',
                            zIndex: 10
                        }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {resources.map((resource) => (
                        <Rnd
                            key={resource.id}
                            size={{ width: resource.width, height: resource.height }}
                            position={{ x: resource.x, y: resource.y }}
                            onDragStop={(e, d) => {
                                handleResizeOrDrag(resource.id, {
                                    ...resource,
                                    x: d.x,
                                    y: d.y
                                });
                            }}
                            onResizeStop={(e, direction, ref, delta, position) => {
                                handleResizeOrDrag(resource.id, {
                                    ...resource,
                                    width: parseInt(ref.style.width),
                                    height: parseInt(ref.style.height),
                                    x: position.x,
                                    y: position.y
                                });
                            }}
                            bounds="parent"
                            onMouseDown={() => handleLayerSelect(resource.id)}
                            style={{
                                zIndex: selectedResourceId === resource.id ? 100 : 1
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: selectedResourceId === resource.id
                                        ? '2px solid #1976d2'
                                        : '1px dashed rgba(255, 255, 255, 0.3)',
                                    borderRadius: 1,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    cursor: 'move',
                                    '&:hover': {
                                        border: '2px solid #1976d2'
                                    }
                                }}
                            >
                                {resource.type === LAYER_TYPES.IMAGE && (
                                    <img
                                        src={resource.src}
                                        alt={resource.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain'
                                        }}
                                    />
                                )}

                                {resource.type === LAYER_TYPES.TEXT && (
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            p: 1,
                                            fontFamily: resource.fontFamily,
                                            fontSize: `${resource.fontSize}px`,
                                            fontWeight: resource.textStyles?.includes('bold') ? 'bold' : 'normal',
                                            fontStyle: resource.textStyles?.includes('italic') ? 'italic' : 'normal',
                                            color: resource.color,
                                            wordBreak: 'break-word',
                                            overflow: 'hidden',
                                            userSelect: 'none'
                                        }}
                                        onDoubleClick={() => handleEditText(resource)}
                                    >
                                        {resource.text}
                                    </Box>
                                )}

                                {selectedResourceId === resource.id && resource.type === LAYER_TYPES.TEXT && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            borderRadius: '0 0 0 4px',
                                            zIndex: 1
                                        }}
                                    >
                                        <IconButton
                                            size="small"
                                            color="inherit"
                                            onClick={() => handleEditText(resource)}
                                        >
                                            <FormatColorTextIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                )}
                            </Box>
                        </Rnd>
                    ))}
                </Box>
            </Box>

            {/* 스테이터스 바, 진행율 바 */}
            <Box sx={{ py: 1, px: 2, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">
                    {isLoading
                        ? '리소스를 불러오는 중...'
                        : isSaving
                            ? '저장 중...'
                            : isUploading
                                ? '업로드 중...'
                                : isModified
                                    ? '저장되지 않은 변경사항이 있습니다.'
                                    : '모든 변경사항이 저장되었습니다.'}
                </Typography>
            </Box>

            {/* 감춰진 이미지 */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileUpload}
            />

            {/* 텍스트 에디터 다이얼로그 */}
            <TextEditorDialog
                open={textDialogOpen}
                onClose={() => setTextDialogOpen(false)}
                initialText={currentTextResource || {}}
                onSave={handleTextSave}
            />

            {/* 에러 알림 */}
            {error && (
                <Alert
                    severity="error"
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        zIndex: 9999,
                        maxWidth: 400,
                        boxShadow: 3
                    }}
                    onClose={() => {/* 에러 초기화 clear! */}}
                >
                    {error.message || String(error)}
                </Alert>
            )}
        </Box>
    );
};

export default SportsOverlayEditor;
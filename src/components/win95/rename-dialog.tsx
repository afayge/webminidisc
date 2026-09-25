import React from 'react';
import Box from '@mui/material/Box';
import { WindowHeader, WindowContent, TextField } from 'react95';
import { DialogOverlay, DialogFooter, DialogWindow, FooterButton } from './common';

export const W95RenameDialog = (props: {
    renameDialogVisible: boolean;
    renameDialogTitle: string;
    renameDialogIndex: number;
    what: string;
    children?: React.ReactNode;
    invalid?: boolean;
    handleCancelRename: () => void;
    handleDoRename: () => void;
    handleChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}) => {
    if (!props.renameDialogVisible) {
        return null;
    }

    return (
        <DialogOverlay>
            <DialogWindow
                style={{
                    maxWidth: 680,
                    width: 'calc(100% - 32px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    top: '8%',
                    maxHeight: '84vh',
                    overflowY: 'auto',
                }}
            >
                <WindowHeader>
                    <span>Rename {props.what}</span>
                </WindowHeader>
                <WindowContent>
                    {props.children ? (
                        <Box
                            sx={{
                                '& .MuiInputBase-root': { background: '#fff', borderRadius: 0, fontFamily: 'inherit' },
                                '& .MuiButton-root': {
                                    borderRadius: 0,
                                    border: '1px solid #888',
                                    boxShadow: 'inset 1px 1px white, inset -1px -1px #555',
                                    color: '#111',
                                    background: '#c6c6c6',
                                    textTransform: 'none',
                                    fontFamily: 'inherit',
                                },
                                '& .MuiInputLabel-root, & .MuiFormHelperText-root': { fontFamily: 'inherit' },
                            }}
                        >
                            {props.children}
                        </Box>
                    ) : (
                        <>
                            <p style={{ marginBottom: 4 }}>{props.what} Name:</p>
                            <TextField
                                style={{ marginBottom: 16 }}
                                value={props.renameDialogTitle}
                                placeholder="Type here..."
                                onChange={props.handleChange}
                                onKeyDown={(event: any) => {
                                    event.key === `Enter` && props.handleDoRename();
                                }}
                                fullWidth
                            />
                        </>
                    )}
                    <DialogFooter>
                        <FooterButton disabled={props.invalid} onClick={props.handleDoRename}>
                            OK
                        </FooterButton>
                        <FooterButton onClick={props.handleCancelRename}>Cancel</FooterButton>
                    </DialogFooter>
                </WindowContent>
            </DialogWindow>
        </DialogOverlay>
    );
};

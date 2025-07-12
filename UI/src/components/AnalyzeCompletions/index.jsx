import { Box, Button, Grid2, Typography } from '@mui/material'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { useState } from 'react';
import api from '../../services/axiosConfig';

export const AnalyzeComplitions = ({ notes, file }) => {
    const [isFileDownloaded, setFileDownloaded] = useState(false);

    const handleDownloadFile = async (fileId, fileName) => {
        try {
            const response = await api.get(`/file/${fileId}`, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data]);

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName || 'downloaded_file';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            setFileDownloaded(true)
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download file.');
        }
    };

    return (
        <Grid2 container>
            <Grid2 size={12}>
                {notes ?
                    <Box sx={{ p: 2, backgroundColor: theme => `${theme.palette.primary.main}30` }}>
                        <Typography sx={{ fontStyle: "italic" }} variant="body2">"{notes}"</Typography>
                    </Box>

                    : <Typography variant="body2">Nu exista completari scrise</Typography>}
            </Grid2>
            <Grid2 size={6} sx={{ mt: 1 }}>
                {file ?
                    <Button disabled={isFileDownloaded} onClick={() => handleDownloadFile(file?.id, file?.name)} variant="outlined" startIcon={<CloudDownloadIcon />}> {isFileDownloaded ? "Fisierul a fost descarcat" : "Descarca fisierul PDF"}</Button>
                    :
                    <Typography variant="body2">Nu exista fisier atasat</Typography>}
            </Grid2>
        </Grid2>
    )
}

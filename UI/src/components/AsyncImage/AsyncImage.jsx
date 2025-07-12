import { useState, useEffect } from 'react';
import api from '../../services/axiosConfig';
import { Box, Skeleton } from '@mui/material';
/* style = {
    STRETCH
    DEFAULT
} */



export const AsyncImage = ({ imageId, width = "full", height = "full", optionalStyle = {} }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
 
    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await api.get(`/file/${imageId}`, { responseType: 'blob' });

                const imageObjectUrl = URL.createObjectURL(response.data);

                setImageSrc(imageObjectUrl);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchImage();
    }, [imageId]);

    if (loading) {
        return <Skeleton variant="rectangular" 
        height={(!!height && height !== 'full') && parseInt(height)}
         width={(!!width && width !== 'full') && parseInt(width)} 
        />

    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return imageSrc ?
        <img 
            style={optionalStyle}
            height={(!!height && height !== 'full') ? height  : '100%'}
            width={(!!width && width !== 'full') ? width  : '100%'}
            src={imageSrc}
            alt="Fetched Image" />

        : <div>No image found</div>


};

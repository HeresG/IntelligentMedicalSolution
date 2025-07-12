import { Box } from '@mui/material';
import bgImage from '../../assets/loginbg.jpg';
import { hexToRgba } from '../../utilities/rgbConverter';

export const UnprotectedLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundSize: 'cover',
        backgroundImage: (theme) =>
          `linear-gradient(135deg, ${hexToRgba(theme.palette.primary.main, 0.95)}, ${hexToRgba(theme.palette.primary.light, 0.9)}), url(${bgImage})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </Box>
  );
};

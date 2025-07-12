import { Box, Typography } from '@mui/material';
import Select, { components } from 'react-select'
import theme from '../../services/theme';

const Control = ({ children, ...props }) => {
    const { text, isError } = props.selectProps
    
    return (
        <components.Control {...props}>
            {text && <Box sx={{ 
                backgroundColor: theme => isError ? theme.palette.error.main : theme.palette.primary.dark, 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 .4em',
                marginRight: '.4em'
                }}>
                <Typography sx={{
                    color: "#fff",
                }}> {text}</Typography>
            </Box>}
            {children}
        </components.Control>
    );
};

export const PrimarySelector = ({options, value, placeholder,preText, onChange, index, isError, isLoading}) => {
    return (
        <Select
            options={options}
            value={value}
            placeholder={placeholder}
            onChange={(newValue, actionMeta) => onChange(newValue, actionMeta, index)}
            text={preText}
            isError={isError}
            isLoading={isLoading}
            components={{ Control }}
            styles={{                
                control: (baseStyles, state) => ({
                    ...baseStyles,
                    padding: "0px !important",
                    margin: "0px !important",
                    height: '48px',
                    borderRadius: 6,
                    overflow: 'hidden',
                    border: isError ?  `1px solid ${theme.palette.error.main}` : `1px solid ${theme.palette.primary.dark}60`
                }),
                valueContainer: (baseStyles, state) => ({
                    ...baseStyles,
                    padding: "0px !important",
                    margin: "0px !important"
                }),
                container: (baseStyles, state) => ({
                    ...baseStyles,
                    padding: "0px !important",
                    margin: "0px !important"
                }),
                indicatorsContainer: (baseStyles, state) => ({
                    ...baseStyles,
                    padding: "0px !important",
                    margin: "0px !important"
                }),
                
            }}
        />
    )
}

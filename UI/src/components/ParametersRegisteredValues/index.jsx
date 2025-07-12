import { Box, Grid2, Typography } from '@mui/material';

export const ParametersRegisteredValues = ({ analyzeCategories, analyzeResults }) => {

    if (!analyzeResults.length || !analyzeResults.length) {
        return null;
    }

    return analyzeCategories.map((category, index) => {
        const results = analyzeResults.filter(res => res?.parameter?.medicalCategoryId === category.categoryId)
        return (
            <Box key={category.id} sx={{
                backgroundColor: theme => `${theme.palette.primary.main}30`,
                p: 1,
                borderRadius: '5px',
                mb: index === analyzeCategories.length - 1 ? 0 : 1
            }}>
                <Typography sx={{ mb: 1 }}>{category?.category?.name || "Categoria " + index}</Typography>
                <Grid2 container sx={{ pl: 3 }} spacing={1}>
                    {
                        results?.map(result => <Grid2 key={result.id} size={12}>
                            <Grid2 container>
                                <Grid2 size={6}>
                                    <Typography variant="body2">{result.parameter.ro_l18n}</Typography>
                                </Grid2>

                                <Grid2 size={6}>
                                    <Typography variant="body2">{result?.value || 0} {result?.parameter?.unit || "N/A"}</Typography>
                                </Grid2>
                            </Grid2>
                        </Grid2>)
                    }

                </Grid2>
            </Box>
        )
    })
}


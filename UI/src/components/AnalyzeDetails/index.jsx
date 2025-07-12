import { Grid2, Typography } from "@mui/material";
import { DateUtils } from "../../utilities/DateUtils";

export const AnalyzeDetails = ({
    testingDate,
    createdAt,
    institution,
    doctor
}) => {

    if(!testingDate || !createdAt || !institution){
        return null;
    }
    return (
        <Grid2 container rowSpacing={2}>
            <Grid2 size={12}>
                <Grid2 container>
                    <Grid2 size={6} >
                        <Typography variant="body2">Data testarii:</Typography>
                    </Grid2>
                    <Grid2 size={6}>
                        <Typography variant="body2">{DateUtils.formatDate(testingDate)}</Typography>
                    </Grid2>
                </Grid2>
            </Grid2>
            <Grid2 size={12}>
                <Grid2 container>
                    <Grid2 size={6}>
                        <Typography variant="body2">Data inregistrare analiza:</Typography>
                    </Grid2>
                    <Grid2 size={6}>
                        <Typography variant="body2">{DateUtils.formatDate(createdAt)}</Typography>
                    </Grid2>
                </Grid2>
            </Grid2>
            <Grid2 size={12} >
                <Grid2 container>
                    <Grid2 size={6}>
                        <Typography variant="body2">Institutia de recoltare:</Typography>
                    </Grid2>
                    <Grid2 size={6}>
                        <Typography variant="body2">{institution}</Typography>
                    </Grid2>
                </Grid2>
            </Grid2>
            <Grid2 size={12} >
                <Grid2 container>
                    <Grid2 size={6}>
                        <Typography variant="body2">Nume doctor:</Typography>
                    </Grid2>
                    <Grid2 size={6}>
                        <Typography variant="body2">{doctor || ""}</Typography>
                    </Grid2>
                </Grid2>
            </Grid2>
        </Grid2>
    )
}

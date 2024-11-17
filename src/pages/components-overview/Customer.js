// React and other
import { useState } from 'react';

// material-ui
import { Grid, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import CostumerTable from './CostumerTable';

export default function ComponentColor() {
    const [updt, setUpdt] = useState(0);
    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Typography variant="h5">Clientes</Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Tabla de clientes</Typography>
                    </Grid>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <CostumerTable updt={updt} setUpdt={setUpdt} />
                </MainCard>
            </Grid>
        </Grid>
    );
}

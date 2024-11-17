import { useState, useEffect } from 'react';

// material-ui
import { Grid, Typography } from '@mui/material';

// project import
//TODO: Tabla historial
import HistoryTable from './HistoryTable';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { getCustomersInfo, getCollectorsInfo, getHistoryInfo } from '../../firebase/firebase';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
    const [costumers, setCostumers] = useState([]);
    const [collectors, setCollectors] = useState([]);
    const [total, setTotal] = useState('0');

    useEffect(() => {
        clientesInfo();
    }, []);

    //trae info de Clientes
    async function clientesInfo() {
        const usersInfo = [];
        const costumersInfo = await getCustomersInfo();
        costumersInfo.forEach((doc) => {
            usersInfo.push(doc.data());
        });
        setCostumers(usersInfo);

        const collInfo = [];
        const collectorsInfo = await getCollectorsInfo();
        collectorsInfo.forEach((doc) => {
            collInfo.push(doc.data());
        });
        setCollectors(collInfo);

        const historyInfo = [];
        const histoInfo = await getHistoryInfo();
        histoInfo.forEach((doc) => {
            historyInfo.push(doc.data());
        });

        const dollar = '$';
        const sum = dollar.concat(String(historyInfo.map((element) => element.pago).reduce((a, b) => a + b, 0)));
        setTotal(sum);
    }

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* Titulo pagina */}
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Typography variant="h5">Dashboard</Typography>
            </Grid>
            {/* Datos */}
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <AnalyticEcommerce title="Cantidad de Clientes" count={String(costumers.length)} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <AnalyticEcommerce title="Cantidad de cobradores" count={String(collectors.length)} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <AnalyticEcommerce title="Total recolectado" count={total} />
            </Grid>
            <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

            <Grid item xs={12} md={12} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Historial de transaciones</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <HistoryTable />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default DashboardDefault;

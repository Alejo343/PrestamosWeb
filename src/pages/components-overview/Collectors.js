// React and other
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import Moment from 'moment';

// material-ui
import { Grid, Typography, Button, Box } from '@mui/material';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AnimateButton from 'components/@extended/AnimateButton';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// project import
import MainCard from 'components/MainCard';
import CollectorTable from './CollectorTable';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { firebaseConfig, registerNewUser, registerNewCollector, getCollectorsInfo, getUserHistory } from '../../firebase/firebase';

const MySwal = withReactContent(Swal);

let modalSwal = {
    title: 'Datos del Cobrador',
    html:
        '<input class="swal2-input" id="email" type: "email" placeholder="Correo">' +
        '<input class="swal2-input" id="username" placeholder="Nombre" autocomplete="off">' +
        '<input class="swal2-input" id="cajaCapital" type: "number" placeholder="Monto de bolsillo" autocomplete="off">' +
        '<input class="swal2-input" id="password" type="password" placeholder="Contraseña" autocomplete="off" >',
    //Swal properties
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    showLoaderOnConfirm: true,
    allowOutsideClick: () => !Swal.isLoading(),
    preConfirm: () => ({
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        cajaCapital: parseInt(document.getElementById('cajaCapital').value)
    })
};

export default function ComponentTypography() {
    const [updt, setUpdt] = useState(0);
    //const [slot, setSlot] = useState('week'); //Estado de total de tabla total
    const [rows, setRows] = useState([]); //guarda colector
    const [startDate, setStartDate] = useState(null);
    const [startDateFormat, setStartDateFormat] = useState();
    const [finDate, setfinDate] = useState(null);
    const [finDateFormat, setfinDateFormat] = useState();
    const [idCollecoter, setIdCollecoter] = useState([]);
    const [total, setTotal] = useState(0);

    // Añadir collector
    const handleAddCollector = () => {
        const resetPw = async () => {
            const swalval = await MySwal.fire(modalSwal);
            let v = (swalval && swalval.value) || swalval.dismiss;
            if ((v && v.email && v.username && v.password && v.cajaCapital) || v === 'cancel') {
                if (v !== 'cancel') {
                    try {
                        const secondaryApp = initializeApp(firebaseConfig, 'Secondary');
                        const secundaryAuth = getAuth(secondaryApp);

                        const newCollector = await registerNewUser(secundaryAuth, v.email, v.password);

                        let fecha = Moment().format('DD/MM/YYYY');
                        await registerNewCollector(
                            {
                                id: newCollector.user.uid,
                                user: newCollector.user.email,
                                displayName: v.username,
                                password: v.password,
                                registrationDate: fecha,
                                cajaCapital: v.cajaCapital,
                                cerrar_caja: true,
                                fecha: fecha
                            },
                            newCollector.user.uid
                        );
                        setUpdt(updt + 1);
                        await signOut(secundaryAuth);
                        await MySwal.fire({ icon: 'success', title: 'Creado correctamente' });
                    } catch (error) {
                        console.log(error);
                        await MySwal.fire({ icon: 'error', title: 'Email invalido o ya usado' });
                        resetPw();
                    }
                }
            } else {
                await MySwal.fire({ icon: 'error', title: 'Todos los datos son requeridos' });
                resetPw();
            }
        };
        resetPw();
    };

    useEffect(() => {
        userinfo();
    }, [updt]);

    //tre info de usuarios
    async function userinfo() {
        const usersInfo = [];
        const collectorsInfo = await getCollectorsInfo();
        collectorsInfo.forEach((doc) => {
            usersInfo.push(doc.data());
        });
        setRows(usersInfo);
    }

    function toMs(dateStr) {
        let parts = dateStr.split('/');
        return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
    }

    const filterData = (colls) => {
        setIdCollecoter(colls);
    };

    const calcularHandler = async () => {
        if (startDateFormat && finDateFormat && idCollecoter) {
            const valores = await getUserHistory(idCollecoter.user);

            const filtered = valores.filter(function (valor) {
                return (
                    ((toMs(valor.fecha) > startDateFormat || toMs(valor.fecha) == startDateFormat) && toMs(valor.fecha) < finDateFormat) ||
                    toMs(valor.fecha) == finDateFormat
                );
            });
            if (filtered.length == 0) {
                await MySwal.fire({
                    icon: 'error',
                    title: 'Cobros no realizados en esas fechas',
                    showConfirmButton: false,
                    timer: 1500
                });
                setTotal(0);
            } else {
                const sum = filtered.map((element) => element.pago).reduce((a, b) => a + b, 0);
                setTotal(sum);
            }
        } else {
            Swal.fire({ icon: 'error', title: 'faltan datos', showConfirmButton: false, timer: 800 });
            console.log('faltan');
        }
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* Titulo pagina */}
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Typography variant="h5">Cobradores</Typography>
            </Grid>
            {/* Tabla info cobradores */}
            <Grid item xs={12} md={12} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Tabla de cobradores</Typography>
                    </Grid>
                    <Grid item>
                        <AnimateButton>
                            <Button variant="contained" endIcon={<AddCircleIcon />} onClick={handleAddCollector}>
                                Añadir cobrador
                            </Button>
                        </AnimateButton>
                    </Grid>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <CollectorTable updt={updt} setUpdt={setUpdt} />
                </MainCard>
            </Grid>
            {/* Formulario */}
            <Grid item xs={12} sm={6} md={6} lg={6}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Total cobrado formulario</Typography>
                    </Grid>
                </Grid>
                <MainCard content={false} sx={{ mt: 2, padding: '12px' }}>
                    <Box sx={{ pt: 1, pr: 2 }}>
                        <Typography variant="subtitle1">Seleciona cobrador:</Typography>
                        <Box height={10} />
                        {/* Elegir cobrador */}
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={rows}
                            sx={{ width: 300 }}
                            onChange={(e, v) => filterData(v)}
                            getOptionLabel={(coll) => coll.user || ''}
                            renderInput={(params) => <TextField {...params} size="small" label="Filtra por Cobrador" />}
                        />
                        <Box height={15} />
                        <Typography variant="subtitle1">Seleciona un rango de fecha: </Typography>
                        <Box height={15} />
                        <Grid container alignItems="center" justifyContent="space-between">
                            {/* elegir fecha inicio */}
                            <Grid item>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Inicio de fecha"
                                        value={startDate}
                                        onChange={(v1) => {
                                            setStartDate(v1);
                                            let dia = v1.$D;
                                            let mes = v1.$M + 1;
                                            let ano = v1.$y;

                                            let fechaIncio = new Date(ano, mes - 1, dia).getTime();

                                            setStartDateFormat(fechaIncio);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            {/* elegir fecha fin */}
                            <Grid item>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Fin de Fecha"
                                        value={finDate}
                                        onChange={(v2) => {
                                            setfinDate(v2);
                                            let dia = v2.$D;
                                            let mes = v2.$M + 1;
                                            let ano = v2.$y;

                                            let fechaFin = new Date(ano, mes - 1, dia).getTime();
                                            setfinDateFormat(fechaFin);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                        <Box height={10} />
                        <Button disableElevation fullWidth size="large" variant="contained" color="primary" onClick={calcularHandler}>
                            Calcular
                        </Button>
                    </Box>
                </MainCard>
            </Grid>
            {/* Resultado */}
            <Grid item xs={12} sm={6} md={6} lg={6}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Total cobrado resultado</Typography>
                    </Grid>
                </Grid>
                <MainCard content={false} sx={{ mt: 2, padding: '12px' }}>
                    <AnalyticEcommerce title="Total cobrado por cobrador por fechas:" count={String(total).concat('$')} />
                </MainCard>
            </Grid>
        </Grid>
    );
}

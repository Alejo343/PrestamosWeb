import { useEffect, useState } from 'react';

//MUI
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

//MUI icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

//Others
import { getCustomersInfo, deleteCostumerBD, editCostumer, getCollectorsInfo } from '../../firebase/firebase';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function CostumerTable(props) {
    const { updt, setUpdt } = props;
    const MySwal = withReactContent(Swal);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rows, setRows] = useState([]); //Guarda Tabla Clientes
    const [coll, setColl] = useState([]); //Guarda tabla cobradores

    useEffect(() => {
        userinfo();
    }, [updt]);

    //trae info de usuarios
    async function userinfo() {
        const usersInfo = [];
        const costumersInfo = await getCustomersInfo();
        costumersInfo.forEach((doc) => {
            usersInfo.push(doc.data());
        });
        setRows(usersInfo);

        const collecInfo = [];
        const collectorsInfo = await getCollectorsInfo();
        collectorsInfo.forEach((doc) => {
            collecInfo.push(doc.data());
        });
        setColl(collecInfo);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    //Editar el usuario
    async function editUser(user) {
        Swal.fire({
            title: 'Datos del Cobrador',
            html:
                `<input class="swal2-input" id="name" placeholder="Nombre" value="${user.nombre}" >` +
                `<input class="swal2-input" id="direccion" placeholder="Direccion" autocomplete="off" value="${user.direccion}">` +
                `<input class="swal2-input" id="tel1" placeholder="Telefono 1" autocomplete="off" value="${user.tel1}">` +
                `<input class="swal2-input" id="tel2" placeholder="Telefono 2" autocomplete="off" value="${user.tel2}">`,
            //Swal properties
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: () => ({
                name: document.getElementById('name').value,
                direccion: document.getElementById('direccion').value,
                tel1: document.getElementById('tel1').value,
                tel2: document.getElementById('tel2').value
            })
        }).then(async (result) => {
            let v = (result && result.value) || result.dismiss;
            if ((v && v.name && v.direccion && v.tel1) || v === 'cancel') {
                if (v !== 'cancel') {
                    try {
                        await editCostumer(v.name, v.direccion, v.tel1, v.tel2, user.id_customer);
                        setUpdt(updt + 1);
                        await MySwal.fire({ icon: 'success', title: 'Actualizado correctamente' });
                    } catch (error) {
                        console.log(error);
                        const errorMessage = error.message;
                        await MySwal.fire({ icon: 'error', title: errorMessage });
                    }
                }
            } else {
                if (!result.dismiss) {
                    await MySwal.fire({ icon: 'error', title: 'Faltan datos obligatorios' });
                }
            }
        });
    }

    //Borrar usuario
    async function deleteUser(id) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                confirmButtonColor: '#3085d6',
                cancelButton: 'btn btn-danger',
                cancelButtonColor: '#d33'
            }
        });

        swalWithBootstrapButtons
            .fire({
                title: 'Estas?',
                text: 'No podras revertirlo!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, Eliminalo!',
                cancelButtonText: 'No, Cancela!',
                reverseButtons: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33'
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    swalWithBootstrapButtons.fire('Borrado!', 'El Cliente se a borrado', 'success');
                    await deleteCostumerBD(id);

                    setUpdt(updt + 1);
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire('Cancelado', 'No a sucedido nada', 'error');
                }
            });
    }

    const filterData = (colls) => {
        const newRows = rows.filter((person) => person.id_collecter === colls.id);
        if (colls && newRows.length !== 0) {
            setRows(newRows);
        } else if (newRows.length == 0) {
            Swal.fire({
                position: 'bottom-right',
                icon: 'error',
                title: 'Sin clientes asignados',
                showConfirmButton: false,
                timer: 1000
            });
            userinfo();
        } else {
            userinfo();
        }
    };
    return (
        <>
            {rows.length > 0 && (
                <Paper sx={{ width: '100%', overflow: 'hidden', padding: '12px' }}>
                    <Box height={10} />
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={coll}
                        sx={{ width: 300 }}
                        onChange={(e, v) => filterData(v)}
                        getOptionLabel={(coll) => coll.user || ''}
                        renderInput={(params) => <TextField {...params} size="small" label="Filtra por Cobrador" />}
                    />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
                    <Box height={10} />
                    <TableContainer>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left" style={{ minWidth: '100px' }}>
                                        Fecha inicio
                                    </TableCell>
                                    <TableCell align="left" style={{ minWidth: '100px' }}>
                                        Nombre
                                    </TableCell>
                                    <TableCell align="left" style={{ minWidth: '100px' }}>
                                        Faltante por pagar
                                    </TableCell>
                                    <TableCell align="left" style={{ minWidth: '100px' }}>
                                        Cantidad cuotas
                                    </TableCell>
                                    <TableCell align="left" style={{ minWidth: '100px' }}>
                                        Valor cuotas
                                    </TableCell>
                                    <TableCell align="left" style={{ minWidth: '100px' }}>
                                        Cuotas pagadas
                                    </TableCell>
                                    <TableCell align="left" style={{ minWidth: '100px' }}>
                                        Retraso cuotas
                                    </TableCell>
                                    <TableCell align="left" style={{ minWidth: '100px' }}>
                                        Direccion
                                    </TableCell>
                                    <TableCell align="left" style={{ minWidth: '100px' }}>
                                        Cel 1
                                    </TableCell>
                                    <TableCell align="left" style={{ minWidth: '100px' }}>
                                        Cel 2
                                    </TableCell>
                                    <TableCell align="left" style={{ minWidth: '100px' }}>
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id_customer}>
                                            <TableCell align="left">{row.fecha}</TableCell>
                                            <TableCell align="left">{row.nombre}</TableCell>
                                            <TableCell align="left">${row.caja_final}</TableCell>
                                            <TableCell align="left">{row.cantidad_cuotas}</TableCell>
                                            <TableCell align="left">${row.precio_cuotas} c/u</TableCell>
                                            <TableCell align="left">{row.cuotas_pagadas}</TableCell>
                                            <TableCell align="left">{row.retraso_cuotas}</TableCell>
                                            <TableCell align="left">{row.direccion}</TableCell>
                                            <TableCell align="left">{row.tel1}</TableCell>
                                            <TableCell align="left">{row.tel2}</TableCell>
                                            <TableCell align="left">
                                                <Stack spacing={2} direction="row">
                                                    <EditIcon
                                                        style={{
                                                            fontSize: '20px',
                                                            color: 'blue',
                                                            cursor: 'pointer'
                                                        }}
                                                        className="cursor-pointer"
                                                        onClick={() => editUser(row)}
                                                    />
                                                    <DeleteIcon
                                                        style={{
                                                            fontSize: '20px',
                                                            color: 'darkred',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => {
                                                            deleteUser(row.id_customer);
                                                        }}
                                                    />
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            )}
        </>
    );
}

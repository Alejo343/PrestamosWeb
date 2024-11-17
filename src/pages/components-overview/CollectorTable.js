import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signOut, updatePassword, signInWithEmailAndPassword } from 'firebase/auth';

//MUI
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

//MUI icons
import EditIcon from '@mui/icons-material/Edit';
//import DeleteIcon from '@mui/icons-material/Delete';

//Others
import { getCollectorsInfo, firebaseConfig, editCollector } from '../../firebase/firebase';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Dot from 'components/@extended/Dot';

const OrderStatus = ({ status }) => {
    let color;
    let title;

    switch (status) {
        case true:
            color = 'success';
            title = 'Caja abierta';
            break;
        case false:
            color = 'error';
            title = 'Caja cerrada';
            break;
        default:
            color = 'primary';
            title = 'None';
    }

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Dot color={color} />
            <Typography>{title}</Typography>
        </Stack>
    );
};

export default function UsersList(props) {
    const { updt, setUpdt } = props;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rows, setRows] = useState([]);
    const MySwal = withReactContent(Swal);

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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    //Sawl con editar el usuario
    async function editUser(user) {
        Swal.fire({
            title: 'Datos del Cobrador',
            html:
                `<input class="swal2-input" id="email" type: "email" placeholder="Correo" value="${user.user}" disabled>` +
                `<input class="swal2-input" id="username" placeholder="Nombre" autocomplete="off" value="${user.displayName}">` +
                `<input class="swal2-input" id="password" type="password" placeholder="Contraseña" autocomplete="off" value="${user.password}">` +
                `<input class="swal2-input" id="cajaCapital" type: "number" placeholder="Monto de bolsillo" autocomplete="off" value="${user.cajaCapital}"><br>` +
                `<style type="text/css">
                    .switch {
                    position: relative;
                    display: inline-block;
                    width: 60px;
                    height: 34px;
                    }

                    /* Hide default HTML checkbox */
                    .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                    }

                    /* The slider */
                    .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    -webkit-transition: .4s;
                    transition: .4s;
                    }

                    .slider:before {
                    position: absolute;
                    content: "";
                    height: 26px;
                    width: 26px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    -webkit-transition: .4s;
                    transition: .4s;
                    }

                    input:checked + .slider {
                    background-color: #2196F3;
                    }

                    input:focus + .slider {
                    box-shadow: 0 0 1px #2196F3;
                    }

                    input:checked + .slider:before {
                    -webkit-transform: translateX(26px);
                    -ms-transform: translateX(26px);
                    transform: translateX(26px);
                    }

                    /* Rounded sliders */
                    .slider.round {
                    border-radius: 34px;
                    }

                    .slider.round:before {
                    border-radius: 50%;
                    }
                </style>` +
                `<label>Caja abierta      </label>` +
                `<label class="switch">
                        <input class="swal2-input" id="cajaAbierta" type="checkbox" value=${user.cerrar_caja} ${
                    user.cerrar_caja ? 'checked' : ' '
                } >
                    <span class="slider round"></span>
                </label>`,
            //Swal properties
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: () => ({
                email: document.getElementById('email').value,
                username: document.getElementById('username').value,
                password: document.getElementById('password').value,
                cajaCapital: parseInt(document.getElementById('cajaCapital').value),
                cajaAbierta: document.getElementById('cajaAbierta').checked
            })
        }).then(async (result) => {
            let v = (result && result.value) || result.dismiss;
            if ((v && v.username && v.password) || v === 'cancel') {
                if (v !== 'cancel') {
                    try {
                        const secondaryApp = initializeApp(firebaseConfig, 'Secondary');
                        const secundaryAuth = getAuth(secondaryApp);

                        //*iniciar sesion, Si: cambia contraseña
                        if (user.password !== v.password) {
                            await signInWithEmailAndPassword(secundaryAuth, v.email, v.password)
                                .then((userCredential) => {
                                    const user = userCredential.user;
                                    updatePassword(user, v.password)
                                        .then(() => {
                                            console.log('contraseña actualizada');
                                        })
                                        .catch(async (error) => {
                                            const errorMessage = error.message;
                                            await MySwal.fire({ icon: 'error', title: errorMessage });
                                        });
                                })
                                .catch((error) => {
                                    const errorCode = error.code;
                                    const errorMessage = error.message;
                                    MySwal.fire({ icon: 'error', title: error.message });
                                    console.log(errorCode, errorMessage);
                                });
                        }

                        await editCollector(v.username, v.password, v.cajaCapital, v.cajaAbierta, user.id);
                        await signOut(secundaryAuth);
                        await MySwal.fire({ icon: 'success', title: 'Actualizado correctamente' });
                        setUpdt(updt + 1);
                    } catch (error) {
                        console.log(error);
                        await MySwal.fire({ icon: 'error', title: 'Email invalido o ya usado' });
                    }
                }
            } else {
                if (!result.dismiss) {
                    await MySwal.fire({ icon: 'error', title: 'Faltan datos obligatorios' });
                }
            }
        });
    }

    return (
        <>
            {rows.length > 0 && (
                <Paper sx={{ width: '100%', overflow: 'hidden', padding: '12px' }}>
                    <TableContainer>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left" style={{ minWidth: '100px' }}>
                                        email
                                    </TableCell>
                                    <TableCell align="left" style={{ minWidth: '100px' }}>
                                        nombre
                                    </TableCell>
                                    <TableCell align="left" style={{ minWidth: '100px' }}>
                                        fecha creacion
                                    </TableCell>
                                    <TableCell align="left" style={{ minWidth: '100px' }}>
                                        Caja/Bolsillo
                                    </TableCell>
                                    <TableCell align="left" style={{ minWidth: '100px' }}>
                                        Estado
                                    </TableCell>
                                    <TableCell align="left" style={{ minWidth: '100px' }}>
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                            <TableCell align="left">{row.user}</TableCell>
                                            <TableCell align="left">{row.displayName}</TableCell>
                                            <TableCell align="left">{row.registrationDate}</TableCell>
                                            <TableCell align="left">${row.cajaCapital}</TableCell>
                                            <TableCell align="left">
                                                <OrderStatus status={row.cerrar_caja} />
                                            </TableCell>
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
                                                    {/* <DeleteIcon
                                                        style={{
                                                            fontSize: '20px',
                                                            color: 'darkred',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => {
                                                            //deleteUser(row.id);
                                                        }}
                                                    /> */}
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

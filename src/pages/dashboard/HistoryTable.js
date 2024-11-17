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
import Button from '@mui/material/Button';

//Others
import { getHistoryInfo } from '../../firebase/firebase';

export default function HistoryTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        userinfo();
    }, []);

    //trae info del historial
    async function userinfo() {
        const historyInfo = [];
        const collectorsInfo = await getHistoryInfo();
        collectorsInfo.forEach((doc) => {
            historyInfo.push(doc.data());
        });
        setRows(historyInfo);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return (
        <>
            <Button onClick={userinfo}>Actualizar</Button>
            {/* {rows.length > 0 && ( */}
            <Paper sx={{ width: '100%', overflow: 'hidden', padding: '12px' }}>
                <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" style={{ minWidth: '100px' }}>
                                    Fecha
                                </TableCell>
                                <TableCell align="left" style={{ minWidth: '100px' }}>
                                    Cobrador
                                </TableCell>
                                <TableCell align="left" style={{ minWidth: '100px' }}>
                                    Cliente
                                </TableCell>
                                <TableCell align="left" style={{ minWidth: '100px' }}>
                                    Pago
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                        <TableCell align="left">{row.fecha}</TableCell>
                                        <TableCell align="left">{row.id_collector}</TableCell>
                                        <TableCell align="left">{row.name_customer}</TableCell>
                                        <TableCell align="left">{row.pago}</TableCell>
                                        {/* se puede agregar una opcion de envar recibo */}
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
            {/* )} */}
        </>
    );
}

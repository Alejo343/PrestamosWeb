// material-ui
import { useMediaQuery, Container, Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

const AuthFooter = () => {
    const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    return (
        <Container maxWidth="xl">
            <Stack
                direction={matchDownSM ? 'column' : 'row'}
                justifyContent={matchDownSM ? 'center' : 'space-between'}
                spacing={2}
                textAlign={matchDownSM ? 'center' : 'inherit'}
            >
                <Typography variant="subtitle2" color="secondary" component="span">
                    &copy; Web page by &nbsp;
                    <Typography
                        component={Link}
                        variant="subtitle2"
                        href="https://www.linkedin.com/in/analistadesarrollador/"
                        target="_blank"
                        underline="hover"
                    >
                        David
                    </Typography>
                </Typography>

                <Stack
                    direction={matchDownSM ? 'column' : 'row'}
                    spacing={matchDownSM ? 1 : 3}
                    textAlign={matchDownSM ? 'center' : 'inherit'}
                >
                    <Typography
                        variant="subtitle2"
                        color="secondary"
                        component={Link}
                        href="https://www.linkedin.com/in/analistadesarrollador/"
                        target="_blank"
                        underline="hover"
                    >
                        Support
                    </Typography>
                </Stack>
            </Stack>
        </Container>
    );
};

export default AuthFooter;

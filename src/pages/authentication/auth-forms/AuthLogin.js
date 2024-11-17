import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// material-ui
import { Button, Grid } from '@mui/material';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { useAuth } from '../../../hooks/useAuth';
import Google from '../../../assets/images/icons/google.svg';
import { auth } from '../../../firebase/firebase';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {
    const { login } = useAuth();

    async function googleHandler() {
        const googleProvider = new GoogleAuthProvider();
        await signInWithGoogle(googleProvider);
    }

    async function signInWithGoogle(googleProvider) {
        try {
            const res = await signInWithPopup(auth, googleProvider);
            login(res.user);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <AnimateButton>
                        <Button
                            disableElevation
                            fullWidth
                            size="large"
                            type="submit"
                            variant="outlined"
                            color="primary"
                            startIcon={<img src={Google} alt="Google" />}
                            onClick={googleHandler}
                        >
                            Ingresar
                        </Button>
                    </AnimateButton>
                </Grid>
            </Grid>
        </>
    );
};

export default AuthLogin;

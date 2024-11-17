import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';

export const firebaseConfig = {
    apiKey: 'AIzaSyBGaUkIr4uFZWWzMRlhFlw4KTcHm6yQK9Y',
    authDomain: 'prestamos-68fe6.firebaseapp.com',
    projectId: 'prestamos-68fe6',
    storageBucket: 'prestamos-68fe6.appspot.com',
    messagingSenderId: '196700515509',
    appId: '1:196700515509:web:4edb68ce7433e9c37ca2fc',
    measurementId: 'G-XYN461E4PS'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

// Registrar nuevo cobrador
export async function registerNewUser(newAuth, email, password) {
    try {
        const newCollector = await createUserWithEmailAndPassword(newAuth, email, password);
        return newCollector;
    } catch (error) {
        console.error(error);
    }
}

//Registrar nuevo Cobrador en BD Collectors
export async function registerNewCollector(collector, uid) {
    try {
        const collectionRef = collection(db, 'collectors');
        const docRef = doc(collectionRef, uid);
        await setDoc(docRef, collector);
    } catch (error) {
        console.error(error);
    }
}

//Obtener info de TODOS Cobradores/Collecotors
export async function getCollectorsInfo() {
    try {
        const empCollectionRef = collection(db, 'collectors');
        const dataSnap = await getDocs(empCollectionRef);
        return dataSnap;
    } catch (error) {
        console.error(error);
    }
}

//Obtener info de TODOS Clientes/custumers
export async function getCustomersInfo() {
    try {
        const empCollectionRef = collection(db, 'customer');
        const dataSnap = await getDocs(empCollectionRef);
        return dataSnap;
    } catch (error) {
        console.error(error);
    }
}

//Obtener info de TODO el hostorial
export async function getHistoryInfo() {
    try {
        const empCollectionRef = collection(db, 'transaction_history');
        const dataSnap = await getDocs(empCollectionRef);
        return dataSnap;
    } catch (error) {
        console.error(error);
    }
}

//Ediat Cobrador
export async function editCollector(displayName, password, cajaCapital, cajaAbierta, id) {
    try {
        const docRef = doc(db, 'collectors', id);
        await updateDoc(docRef, { displayName: displayName, cajaCapital: cajaCapital, password: password, cerrar_caja: cajaAbierta });
    } catch (error) {
        console.error(error);
    }
}

//editar Cliente
export async function editCostumer(name, direccion, tel1, tel2, id_customer) {
    try {
        const docRef = doc(db, 'customer', id_customer);
        await updateDoc(docRef, { nombre: name, direccion: direccion, tel1: tel1, tel2: tel2 });
    } catch (error) {
        console.error(error);
    }
}

//eliminar Costumer/cliente de la coleccion
export async function deleteCostumerBD(id) {
    try {
        await deleteDoc(doc(db, 'customer', id));
    } catch (error) {
        console.error(eror);
    }
}

//Filtrar de historial un SOLO cobrador
export async function getUserHistory(username) {
    try {
        const users = [];
        const docsRef = collection(db, 'transaction_history');
        const q = query(docsRef, where('id_collector', '==', username));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            users.push(doc.data());
        });

        return users;
    } catch (error) {
        console.log(error);
    }
}

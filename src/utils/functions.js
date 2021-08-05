import Constant from './constants';
import AsyncStorage from '@react-native-community/async-storage';

export const fetchPOST = async (url, body, success) => {
    try {
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body === null ? null : JSON.stringify(body)
        });
        // console.log('json body: ' + url + ' - ' + JSON.stringify(body));
        const data = await resp.json();
        // console.log('json response: ' + url + ' - ' + JSON.stringify(data));
        // console.log('data: ', data);
        await success(data);
        // console.log('TERMINO: ' + url)
    } catch (error) {
        console.log(error);
    }
};

export const addToCart = (product, minus, vetname, itemsBuyed, veterinary) => {
    let quantity = undefined;
    let idMascota = typeof product.MS_IdMascota != "undefined" ? product.MS_IdMascota : Constant.GLOBAL.PET.ID;
    if (typeof itemsBuyed[product.VTA_IdVeterinaria + '-' + product.PR_IdProducto + '-' + idMascota] !== "undefined") {
        quantity = itemsBuyed[product.VTA_IdVeterinaria + '-' + product.PR_IdProducto + '-' + idMascota].CantidadProducto;
    }

    itemsBuyed[product.VTA_IdVeterinaria + '-' + product.PR_IdProducto + '-' + idMascota] = {
        "VTA_IdVeterinaria": product.VTA_IdVeterinaria,
        "PR_IdProducto": product.PR_IdProducto,
        "MS_IdMascota": idMascota,
        "CantidadProducto": typeof quantity !== "undefined" ? quantity + (minus ? -1 : 1) : 1,
        "PR_Stock": product.PR_Stock,
        "PR_MontoTotal": product.PR_MontoTotal,
        "VTA_NombreVeterinaria": vetname || product.VTA_NombreVeterinaria,
        "PR_NombreProducto": product.PR_NombreProducto,
        "PR_Descripcion": product.PR_Descripcion,
        "SV_NombreServicio": product.SV_NombreServicio,
        "PR_MontoComision": product.PR_MontoComision,
        "MS_NombreFotoMascota": Constant.GLOBAL.PET.PHOTO
    }

    const _storeData = async () => {
        try {
            await AsyncStorage.setItem('@ITEMS_BUYED', JSON.stringify(itemsBuyed));
            await AsyncStorage.setItem('@VET_BUY', veterinary.toString());
        } catch (error) {
            console.error('Error: ' + error);
        }
    };
    _storeData();

    console.log("ITEMS_BUYED: " + JSON.stringify(itemsBuyed));
    return itemsBuyed;
}

export const listVetsPurcharse = (itemsBuyed) => {
    const veterinarians = {};
    Object.keys(itemsBuyed).map(function (key) {
        let { VTA_IdVeterinaria, VTA_NombreVeterinaria } = itemsBuyed[key];
        veterinarians[VTA_IdVeterinaria] = VTA_NombreVeterinaria;
        return { VTA_IdVeterinaria, VTA_NombreVeterinaria };
    });
    const vets_list = Object.keys(veterinarians).map(function (key) {
        return { "VTA_IdVeterinaria": Number(key), "VTA_NombreVeterinaria": veterinarians[key] };
    });

    vets_list.forEach(e => {
        let montoSubTotal = 0;
        // console.log('e: ' + JSON.stringify(e));
        let list = [];
        Object.keys(itemsBuyed).map(function (key) {
            let { VTA_IdVeterinaria, PR_MontoTotal, CantidadProducto } = itemsBuyed[key];
            // console.log("key: " + key + " - item: " + JSON.stringify(itemsBuyed[key]))
            if (VTA_IdVeterinaria == e.VTA_IdVeterinaria) {
                montoSubTotal += PR_MontoTotal * CantidadProducto;
                list.push({ key: key, ...itemsBuyed[key] });
            }
            return list;
        });
        e.montoSubTotal = montoSubTotal;
        e.vet_prods = list;
    });

    return vets_list;
}

export const removeToCart = (item, itemsBuyed, callback) => {
    itemsBuyed[item.key] = {};
    delete itemsBuyed[item.key];
    const _storeData = async (count) => {
        try {
            await AsyncStorage.setItem('@ITEMS_BUYED', JSON.stringify(itemsBuyed));
            if (count <= 0) {
                await AsyncStorage.removeItem('@ITEMS_BUYED');
                // await AsyncStorage.clear();
                callback();
            }
        } catch (error) {
            console.error('Error: ' + error);
        }
    };
    _storeData(Object.keys(itemsBuyed).length);
    return itemsBuyed;
}


export function convertDateDDMMYYYY(date) {
    if (date) {
        var mm = date.getMonth() + 1;
        var dd = date.getDate();

        return [(dd > 9 ? '' : '0') + dd,
        (mm > 9 ? '' : '0') + mm,
        date.getFullYear(),
        ].join('/');
    }
};
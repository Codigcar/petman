import { Dimensions, Platform } from "react-native";

let WS_URL = 'http://desarrollo2.laprotectora.com.pe:8090/veterinaria';
let ext = '.png';

export default {
    GLOBAL: {
        IMAGES: {
            ICON_FOOTER_HOME: require('../assets/img/footer/icon_footer_home' + ext),
            ICON_FOOTER_HOME_INACTIVE: require('../assets/img/footer/icon_footer_home_inactive' + ext),
            ICON_FOOTER_PET: require('../assets/img/footer/icon_footer_mascota' + ext),
            ICON_FOOTER_PET_INACTIVE: require('../assets/img/footer/icon_footer_mascota_inactive' + ext),
            ICON_FOOTER_CONNECT: require('../assets/img/footer/icon_footer_corazon_active' + ext),
            ICON_FOOTER_CONNECT_INACTIVE: require('../assets/img/footer/icon_footer_corazon_inactive' + ext),
            ICON_FOOTER_ORDER: require('../assets/img/footer/icon_footer_pedidos' + ext),
            ICON_FOOTER_ORDER_INACTIVE: require('../assets/img/footer/icon_footer_pedidos_inactive' + ext),
            ICON_FOOTER_CHAT: require('../assets/img/footer/icon_footer_chat' + ext),
            ICON_FOOTER_CHAT_INACTIVE: require('../assets/img/footer/icon_footer_chat_inactive' + ext),

            LOADING: require('../assets/img/loading.gif'),
            SECURE: require('../assets/img/secure' + ext),
            BACKGROUND_INIT: require('../assets/img/fondo_inicio' + ext),
            LOGO_INIT: require('../assets/img/logo_petman_inicio' + ext),
            BACKGROUND: require('../assets/img/fondo_top' + ext),
            BACKGROUND_SHORT: require('../assets/img/fondo_top_02' + ext),
            LOGO: require('../assets/img/logo_petman' + ext),
            FACE_MAN: require('../assets/img/face_man' + ext),
            FACE_WOMEN: require('../assets/img/face_women' + ext),
            UPLOAD_DOG: require('../assets/img/upload_dog' + ext),
            UPLOAD_CAT: require('../assets/img/upload_cat' + ext),
            FACE_DOG: require('../assets/img/face_dog' + ext),
            FACE_DOG_INACTIVE: require('../assets/img/face_dog_inactive' + ext),
            FACE_CAT: require('../assets/img/face_cat' + ext),
            FACE_CAT_INACTIVE: require('../assets/img/face_cat_inactive' + ext),
            DOG: require('../assets/img/dog' + ext),
            CAT: require('../assets/img/cat' + ext),
            ICON_USER: require('../assets/img/icon_user' + ext),
            ICON_CART: require('../assets/img/icon_cart.png'),
            GAME_OVER: require('../assets/img/game_over' + ext),
            RATING_STAR: require('../assets/img/rating_star' + ext),
            RATING_STAR_INACTIVE: require('../assets/img/rating_star_inactive' + ext)
        },
        // IMAGES: {
        //     BACKGROUND: require('../assets/img/fondo' + (Platform.OS == 'android' ? '.png' : '.psd'))
        // },
        KEYBOARD_BEHAVIOR: Platform.OS == 'ios' ? "padding" : null,
        KEYBOARD_TYPE_NUMERIC: "numeric",
        KEYBOARD_TYPE_EMAIL: "email-address",
        PET: {
            ID: 0,
            PHOTO: null
        },
        PET_TYPE: {
            ['1']: {
                img_upload: require('../assets/img/face_dog_inactive' + ext),
                img_face: require('../assets/img/face_dog' + ext),
                img_size_pet: require('../assets/img/dog' + ext)
            },
            ['2']: {
                img_upload: require('../assets/img/face_cat_inactive' + ext),
                img_face: require('../assets/img/face_cat' + ext),
                img_size_pet: require('../assets/img/cat' + ext)
            }
        },
        PET_SEX: {
            ['1']: {
                male: require('../assets/img/sex/male_symbol' + ext),
                female: require('../assets/img/sex/female_symbol_inactive' + ext)
            },
            ['2']: {
                male: require('../assets/img/sex/male_symbol_inactive' + ext),
                female: require('../assets/img/sex/female_symbol' + ext)
            }
        }
    },
    DEVICE: {
        WIDTH: Dimensions.get("window").width,
        HEIGHT: Dimensions.get("window").height
    },
    URI: {
        LOGIN: WS_URL + '/Operations/UsuarioLoguear',
        USER_LIST: WS_URL + '/Operations/UsuarioConsultar',
        USER_REGISTRY: WS_URL + '/Operations/UsuarioRegistrar',
        USER_UPDATE: WS_URL + '/Operations/UsuarioActualizar',
        USER_ADDRESS_UPDATE: WS_URL + '/Operations/UbicacionRegistrar',
        PRIVACITY_POLICIES: WS_URL + '/Operations/Politica_Obtener',
        CONTACT_GET: WS_URL + '/Operations/Contacto_obtener',
        FORGOT_PASSWORD: WS_URL + '/Operations/UsuarioOlvidarClave',
        PET_LIST: WS_URL + '/Operations/MascotaObtener',
        PET_REGISTRY: WS_URL + '/Operations/MascotaRegistrar',
        PET_UPDATE: WS_URL + '/Operations/MascotaActualizar',
        VET_VISITED_LIST: WS_URL + '/Operations/VeterinariaListar',
        VET_GET: WS_URL + '/Operations/VeterinariaObtener',
        VET_PROD_LIST: WS_URL + '/Operations/VeterinariaProductoListar',
        PROD_LIST: WS_URL + '/Operations/ProductoListar',
        SALE_LIST: WS_URL + '/Operations/Venta_Listar',
        SALE_DETAIL_LIST: WS_URL + '/Operations/Venta_Detalle_Obtener',
        SALE_REGISTRY: WS_URL + '/Operations/VentaRegistrar',
        MOBILITY: WS_URL + '/Operations/VeterinariaMovilidadObtener',
        SERVICES_LIST: WS_URL + '/Operations/Servicio_Listar',
        PARAMS: WS_URL + '/Operations/MascotaConsultar',
        PET_EVOLUTION_LIST: WS_URL + '/Operations/MascotaEvolucion',
        PET_EVOLUTION_GET: WS_URL + '/Operations/MascotaEvolucionObtener',
        PET_EVOLUTION_PERCENTAGE: WS_URL + '/Operations/MascotaEvolucionPorcentaje',
        GOOGLE_MAP_API_KEY: WS_URL + '/Operations/Acceso_Obtener_Google',
        PAYMENT_KEY: WS_URL + '/Operations/Acceso_Obtener_Tarjeta'
    }
}
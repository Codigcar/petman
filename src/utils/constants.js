import { Dimensions, Platform } from "react-native";

let WS_URL = 'http://desarrollo2.laprotectora.com.pe:8090/veterinaria';

export default {
    GLOBAL: {
        IMAGES: Platform.OS == 'android'
        ? {
            ICON_FOOTER_HOME: require('../assets/img/footer/icon_footer_home.webp'),
            ICON_FOOTER_HOME_INACTIVE: require('../assets/img/footer/icon_footer_home_inactive.webp'),
            ICON_FOOTER_PET: require('../assets/img/footer/icon_footer_mascota.webp'),
            ICON_FOOTER_PET_INACTIVE: require('../assets/img/footer/icon_footer_mascota_inactive.webp'),
            ICON_FOOTER_CONNECT: require('../assets/img/footer/icon_footer_corazon_active.webp'),
            ICON_FOOTER_CONNECT_INACTIVE: require('../assets/img/footer/icon_footer_corazon_inactive.webp'),
            ICON_FOOTER_ORDER: require('../assets/img/footer/icon_footer_pedidos.webp'),
            ICON_FOOTER_ORDER_INACTIVE: require('../assets/img/footer/icon_footer_pedidos_inactive.webp'),
            ICON_FOOTER_CHAT: require('../assets/img/footer/icon_footer_chat.webp'),
            ICON_FOOTER_CHAT_INACTIVE: require('../assets/img/footer/icon_footer_chat_inactive.webp'),

            LOADING: require('../assets/img/loading.gif'),
            SECURE: require('../assets/img/secure.webp'),
            BACKGROUND_INIT: require('../assets/img/fondo_inicio.webp'),
            LOGO_INIT: require('../assets/img/logo_petman_inicio.webp'),
            BACKGROUND: require('../assets/img/fondo_top.webp'),
            BACKGROUND_SHORT: require('../assets/img/fondo_top_02.webp'),
            LOGO: require('../assets/img/logo_petman.webp'),
            FACE_MAN: require('../assets/img/face_man.webp'),
            FACE_WOMEN: require('../assets/img/face_women.webp'),
            UPLOAD_DOG: require('../assets/img/upload_dog.webp'),
            UPLOAD_CAT: require('../assets/img/upload_cat.webp'),
            FACE_DOG: require('../assets/img/face_dog.webp'),
            FACE_DOG_INACTIVE: require('../assets/img/face_dog_inactive.webp'),
            FACE_CAT: require('../assets/img/face_cat.webp'),
            FACE_CAT_INACTIVE: require('../assets/img/face_cat_inactive.webp'),
            DOG: require('../assets/img/dog.webp'),
            CAT: require('../assets/img/cat.webp'),
            ICON_USER: require('../assets/img/icon_user.webp'),
            ICON_CART: require('../assets/img/icon_cart.webp'),
            GAME_OVER: require('../assets/img/game_over.webp'),
            RATING_STAR: require('../assets/img/rating_star.webp'),
            RATING_STAR_INACTIVE: require('../assets/img/rating_star_inactive.webp')
        }
        : {
            ICON_FOOTER_HOME: require('../assets/img/footer/icon_footer_home.psd'),
            ICON_FOOTER_HOME_INACTIVE: require('../assets/img/footer/icon_footer_home_inactive.psd'),
            ICON_FOOTER_PET: require('../assets/img/footer/icon_footer_mascota.psd'),
            ICON_FOOTER_PET_INACTIVE: require('../assets/img/footer/icon_footer_mascota_inactive.psd'),
            ICON_FOOTER_CONNECT: require('../assets/img/footer/icon_footer_corazon_active.psd'),
            ICON_FOOTER_CONNECT_INACTIVE: require('../assets/img/footer/icon_footer_corazon_inactive.psd'),
            ICON_FOOTER_ORDER: require('../assets/img/footer/icon_footer_pedidos.psd'),
            ICON_FOOTER_ORDER_INACTIVE: require('../assets/img/footer/icon_footer_pedidos_inactive.psd'),
            ICON_FOOTER_CHAT: require('../assets/img/footer/icon_footer_chat.psd'),
            ICON_FOOTER_CHAT_INACTIVE: require('../assets/img/footer/icon_footer_chat_inactive.psd'),

            LOADING: require('../assets/img/loading.gif'),
            SECURE: require('../assets/img/secure.psd'),
            BACKGROUND_INIT: require('../assets/img/fondo_inicio.psd'),
            LOGO_INIT: require('../assets/img/logo_petman_inicio.psd'),
            BACKGROUND: require('../assets/img/fondo_top.psd'),
            BACKGROUND_SHORT: require('../assets/img/fondo_top_02.psd'),
            LOGO: require('../assets/img/logo_petman.psd'),
            FACE_MAN: require('../assets/img/face_man.psd'),
            FACE_WOMEN: require('../assets/img/face_women.psd'),
            UPLOAD_DOG: require('../assets/img/upload_dog.psd'),
            UPLOAD_CAT: require('../assets/img/upload_cat.psd'),
            FACE_DOG: require('../assets/img/face_dog.psd'),
            FACE_DOG_INACTIVE: require('../assets/img/face_dog_inactive.psd'),
            FACE_CAT: require('../assets/img/face_cat.psd'),
            FACE_CAT_INACTIVE: require('../assets/img/face_cat_inactive.psd'),
            DOG: require('../assets/img/dog.psd'),
            CAT: require('../assets/img/cat.psd'),
            ICON_USER: require('../assets/img/icon_user.psd'),
            ICON_CART: require('../assets/img/icon_cart.psd'),
            GAME_OVER: require('../assets/img/game_over.psd'),
            RATING_STAR: require('../assets/img/rating_star.psd'),
            RATING_STAR_INACTIVE: require('../assets/img/rating_star_inactive.psd')
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
        PET_TYPE: Platform.OS == 'android'
        ? {
            ['1']: {
                img_upload: require('../assets/img/face_dog_inactive.webp'),
                img_face: require('../assets/img/face_dog.webp'),
                img_size_pet: require('../assets/img/dog.webp')
            },
            ['2']: {
                img_upload: require('../assets/img/face_cat_inactive.webp'),
                img_face: require('../assets/img/face_cat.webp'),
                img_size_pet: require('../assets/img/cat.webp')
            }
        }
        : {
            ['1']: {
                img_upload: require('../assets/img/face_dog_inactive.psd'),
                img_face: require('../assets/img/face_dog.psd'),
                img_size_pet: require('../assets/img/dog.psd')
            },
            ['2']: {
                img_upload: require('../assets/img/face_cat_inactive.psd'),
                img_face: require('../assets/img/face_cat.psd'),
                img_size_pet: require('../assets/img/cat.psd')
            }
        },
        PET_SEX: Platform.OS == 'android'
        ? {
            ['1']: {
                male: require('../assets/img/sex/male_symbol.webp'),
                female: require('../assets/img/sex/female_symbol_inactive.webp')
            },
            ['2']: {
                male: require('../assets/img/sex/male_symbol_inactive.webp'),
                female: require('../assets/img/sex/female_symbol.webp')
            }
        }
        : {
            ['1']: {
                male: require('../assets/img/sex/male_symbol.psd'),
                female: require('../assets/img/sex/female_symbol_inactive.psd')
            },
            ['2']: {
                male: require('../assets/img/sex/male_symbol_inactive.psd'),
                female: require('../assets/img/sex/female_symbol.psd')
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
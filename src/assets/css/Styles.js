let font_aldrich_regular = 'Aldrich-Regular';
let font_blinker_regular = 'Blinker-Regular';
let font_blinker_bold = 'Blinker-SemiBold';

let color_background = '#FFFFFF';
let color_primary = '#fff200';
let color_secondary = '#eb008b';
let color_tertiary = '#fff';
let color_error = '#ff0000';
let color_opaque = 'rgba(0,0,0,0.5)';
let color_gris = '#838383';
let color_light_grey = '#aaaaaa';
let color_black = '#000000';
let color_cian = '#00aeef';

export const Styles = {
    colors: {
        background: color_background,
        primary: color_primary,
        secondary: color_secondary,
        tertiary: color_tertiary,
        error: color_error,
        opaque: color_opaque,
        gris: color_gris,
        lightGrey: color_light_grey,
        cian: color_cian,
        black: color_black,
        defaultBackground: '#F2F2F2'
    },
    fontAldrichRegular: font_aldrich_regular,
    fontBlinkerRegular: font_blinker_regular,
    fontBlinkerBold: font_blinker_bold,
    button: {
        primary: {
            marginTop: 10,
            marginBottom: 10,
            borderColor: color_black,
            borderWidth: 3,
            backgroundColor: color_primary,
            borderRadius: 15
        },
        secondary: {
            marginTop: 10,
            marginBottom: 10,
            borderColor: color_black,
            borderWidth: 3,
            backgroundColor: color_tertiary,
            borderRadius: 15,
        }
    },
    title: {
        color: color_secondary,
        fontFamily: font_aldrich_regular,
        textAlign: "center",
        fontSize: 26,
        marginTop: 10
    },
    subTitle: {
        color: color_gris,
        fontFamily: font_aldrich_regular,
        textAlign: "center",
        fontSize: 14,
        marginTop: 5,
        marginBottom: 10
    },
    textOpaque: {
        fontFamily: font_aldrich_regular,
        color: color_gris,
        fontSize: 18
    },
    textLightGrey: {
        fontFamily: font_blinker_regular,
        color: color_light_grey
    },
    textBoldOpaque: {
        fontFamily: font_blinker_bold,
        color: color_gris
    },
    textSecondary: {
        fontFamily: font_aldrich_regular,
        color: color_secondary,
    },
    headerBarStyle: {
        backgroundColor: color_primary,
        elevation: 0,
        shadowOpacity: 0
    },
    headerTitleStyle: {
        fontFamily: font_blinker_bold,
        fontSize: 18
    }
};
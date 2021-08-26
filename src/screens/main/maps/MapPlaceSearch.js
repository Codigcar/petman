import React from 'react';
import { StyleSheet } from 'react-native';
import { Styles } from '../../../assets/css/Styles';
import Constant from '../../../utils/constants';
import { fetchPOST } from '../../../utils/functions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

class MapPlaceSearch extends React.Component {
    
    render() {
        return (
            <GooglePlacesAutocomplete
                placeholder='Ingresar una nueva dirección'
                minLength={1} // minimum length of text to search
                // autoFocus={true}
                // returnKeyType={'search'} // Can be left out for default return key 
                // listViewDisplayed={false}    // true/false/undefined
                fetchDetails={true}
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                    console.log('data ' + JSON.stringify(data))
                    console.log('details ' + JSON.stringify(details))
                    let obj = {
                        "I_UB_PlaceId": details.place_id,
                        "I_UB_DireccionFormato": details.formatted_address,
                        "I_UB_Direccion": details.name,
                        "I_UB_Distrito": details.vicinity,
                        "I_UB_Longitud": details.geometry.location.lng,
                        "I_UB_Latitud": details.geometry.location.lat,
                        "I_UB_ResultadoApiAS": JSON.stringify(details)
                    }
                    this.props.notifyChange(obj);
                }}
                // suppressDefaultStyles={true}
                styles={styles}
                query={{
                    key: this.props.apiKey,
                    // language: 'en',
                    // types: '{cities}'
                }}
                enablePoweredByContainer={false}
                nearbyPlacesAPI='GooglePlacesSearch'
                debounce={300}
            />
        );
    }
}
export default MapPlaceSearch;


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: "center",
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        height: 60,
        backgroundColor: Styles.colors.primary
    },
    textInput: {
        color: Styles.colors.gris,
        borderWidth: 1,
        borderRadius: 0,
        borderColor: Styles.colors.lightGrey,
        fontFamily: Styles.fontAldrichRegular,
        fontSize: 16,
    },
    listView: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'white',
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,

    },
    row: {
        backgroundColor: '#FFFFFF',
        padding: 13,
        minHeight: 44,
        flexDirection: 'row',
    },
    loader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 120,
    },
    description: {},
    separator: {
        height: 0.5,
        backgroundColor: '#c8c7cc',
    },
    poweredContainer: {
        justifyContent: "center",
        alignItems: 'center',
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderColor: '#c8c7cc',
        borderTopWidth: 0.5,
    },
    powered: {},
});
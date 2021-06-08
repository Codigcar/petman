export const stateConditionString = state => {
    let navigateTo = '';
    if (state.isLoading) {
        navigateTo = 'LOAD_LOADING';
    } else if (state.isNotSignedIn) {
        navigateTo = 'LOAD_SIGNIN';
    } else if (state.isLoggedIn) {
        navigateTo = 'LOAD_APP';
    } else if (state.isNotSignedUp) {
        navigateTo = 'LOAD_SIGNUP';
    } else if (state.isNotSignedUpPet) {
        navigateTo = 'LOAD_SIGNUP_PET';
    } else if (state.isForgotPassword) {
        navigateTo = 'LOAD_FORGOT_PASSWORD';
    }
    return navigateTo;
};

export const reducer = (prevState, action) => {
    // console.log('prevState: ' + JSON.stringify(prevState) + ' - action: ' + JSON.stringify(action));
    switch (action.type) {
        case 'TO_SIGNUP_PAGE': //LOAD_SIGNUP
            return {
                ...prevState,
                isNotSignedUp: true,
                isNotSignedIn: false,
            };
        case 'TO_SIGNIN_PAGE': //LOAD_SIGNIN
            return {
                ...prevState,
                isNotSignedIn: true,
                isNotSignedUp: false,
                isNotSignedUpPet: false,
                isForgotPassword: false,
                userRoot: null
            };
        case 'TO_SIGNUP_PET_PAGE': //LOAD_SIGNUP_PET
            return {
                ...prevState,
                isNotSignedUpPet: true,
                isNotSignedUp: false,
                userRoot: action.userRoot
            };
        case 'TO_FORGOT_PASS_PAGE': //LOAD_FORGOT_PASSWORD
            return {
                ...prevState,
                isForgotPassword: true,
                isNotSignedIn: false,
            };
        case 'RESTORE_TOKEN': //LOAD_SIGNIN
            return {
                ...prevState,
                isNotSignedIn: true,
                isLoading: false,
            };
        case 'SIGN_IN': //LOAD_APP
            return {
                ...prevState,
                isLoggedIn: true,
                isNotSignedUp: false,
                isNotSignedIn: false,
                userRoot: action.userRoot.data,
            };
        case 'SIGN_OUT': //LOAD_SIGNIN
            return {
                ...prevState,
                isNotSignedIn: true,
                isLoggedIn: false,
            };
    }
};

export const initialState = {
    isLoading: true,
    isNotSignedIn: false,
    isLoggedIn: false,
    isNotSignedUp: false,
    isNotSignedUpPet: false,
    isForgotPassword: false,
    userRoot: null
};

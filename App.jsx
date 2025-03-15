import React from 'react';
import {
    SafeAreaView,
    useColorScheme,
} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import i18n from './i18n';

const App = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? '#000000' : '#ffffff',
    };

    return (
        <SafeAreaView style={backgroundStyle}>
            <I18nextProvider i18n={i18n}>
                <AppNavigator />
            </I18nextProvider>
        </SafeAreaView>
    );
};

export default App;

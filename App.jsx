import React from 'react';
import {
    SafeAreaView,
    useColorScheme,
} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? '#000000' : '#ffffff',
    };

    return (
        <SafeAreaView style={backgroundStyle}>
            <AppNavigator/>
        </SafeAreaView>
    );
};

export default App;

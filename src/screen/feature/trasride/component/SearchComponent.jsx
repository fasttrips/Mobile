import { Motion } from "@legendapp/motion"
import { COMPONENT_STYLES } from "../../../../lib/constants"
import { StyleSheet, View } from 'react-native';
import DropdownSearchComponent from "../../../../component/DropdownSearchComponent";
import { useEffect } from "react";
import { ButtonComponent } from "../../../../component/ButtonComponent";


const ModalSearch = ({
    navigation,
    modalSearchBarShow,
    setmodalSearchBarShow,
    listPlace,
    listPlace2,
    originChoice,
    setoriginChoice,
    destinationChoice,
    setdestinationChoice,

    setsearchLocationonMapMode,
    setlocationStatus,
    setfocus,
    buttonOrigin,
    buttonDestination
}) => {

    useEffect(() => {
        if (modalSearchBarShow) {
            const timer = setTimeout(() => {
                setmodalSearchBarShow(true);
            }, 100); // 0.5 seconds delay
            return () => clearTimeout(timer); // Clean up the timer if the modal visibility changes before the timeout
        } else {
            setmodalSearchBarShow(false); // Reset animation when modal is closed
        }
    }, [modalSearchBarShow]);

    return (
        <Motion.View
            initial={{ y: 0 }}
            animate={{ x: 0, y: modalSearchBarShow ? 0 * 100 : -4 * 100 }} // Use the animateModal state for triggering animation
            whileHover={{ scale: 1.2 }}
            whileTap={{ y: 20 }}
            transition={{ type: 'spring' }}
            style={styles.modalAnimateTop}
        >
            <View style={styles.modalComponentTop} >
                <View style={COMPONENT_STYLES.spacer} />
                <View style={COMPONENT_STYLES.spacer} />
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <DropdownSearchComponent
                            trigger={(a) => buttonOrigin(a)}
                            items={listPlace}
                            value={originChoice}
                            iconNameDes={"caret-up-circle-outline"}
                            iconName={"locate-outline"}
                            setsearchLocationonMapMode={setsearchLocationonMapMode}
                            setfocus={setfocus}
                            focus={'origin'}
                            onValueChange={setoriginChoice}
                            setlocationStatus={setlocationStatus}
                        />
                    </View>
                </View>
                <View style={COMPONENT_STYLES.spacer} />
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <DropdownSearchComponent
                            trigger={(a) => buttonDestination(a)}
                            items={listPlace2}
                            value={destinationChoice}
                            iconNameDes={"location-outline"}
                            setsearchLocationonMapMode={setsearchLocationonMapMode}
                            setfocus={setfocus}
                            focus={'destination'}
                            onValueChange={setdestinationChoice}
                            setlocationStatus={setlocationStatus}
                        />
                    </View>
                </View>
            </View>
            <View style={{ width: 50, margin: 5 }}>
                <ButtonComponent onPress={navigation} style={{ backgroundColor: 'white', borderRadius: 100, elevation: 3 }} iconName={"arrow-back"} />
            </View>
        </Motion.View>
    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    modalAnimateTop: {
        position: 'absolute',
        top: 10, // Position it at the bottom
        left: 10,
        right: 10,
    },
    modalComponentTop: {
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: '#00000030',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingBottom: 20,
        elevation: 1
    }
});

export {
    ModalSearch
}
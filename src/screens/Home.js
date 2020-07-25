import React,{useState,useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
    FlatList
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {inject, observer} from "mobx-react";
import ReadStore from "../store/ReadStore";
import Colors from "../assets/Colors";
import Feather from "react-native-vector-icons/Feather";

const {width,height} = Dimensions.get('window')
function Home({navigation}) {

    const days = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma']
    const [page,setPage] = useState(0)

    useEffect(() => {
        ReadStore.getLocations()
    },[])


    function scroll (event: Object) {
        if(event.nativeEvent.contentOffset.x >=0){
            setPage(Math.floor(event.nativeEvent.contentOffset.x / width))
        }
    }


    return (
            ReadStore.homeLoading ?
                <View style={styles.activityContainer}>
                    <ActivityIndicator size="large" color={Colors.App}/>
                </View>
                :
                ReadStore.error ?
                    navigation.navigate('Search')
                :
                <SafeAreaView style={styles.container}>
                    <View style={{backgroundColor: Colors.White}}>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            onScroll={scroll}
                            scrollEventThrottle={16}
                            horizontal
                            pagingEnabled={true}>

                            {ReadStore.detail.map(function (key,index) {
                                console.log(key.current.condition.text)
                                return (
                                    <View>
                                        <View style={styles.page}>
                                            <View>
                                                <MaterialCommunityIcons style={styles.icon}
                                                                        name={key.current.condition.text.includes('cloudy') ? 'weather-cloudy' :
                                                                            key.current.condition.text.includes('clear') ? 'weather-cloudy' :
                                                                                key.current.condition.text.includes('rain') ? 'weather-pouring' :
                                                                                        key.current.condition.text.includes('Sunny') ? 'weather-sunny' : 'weather-cloudy'

                                                                        }                                                                       size={80} color={Colors.White}/>
                                                <Text style={styles.degreeText}>{key.current.temp_c}°</Text>
                                                <Text style={styles.name}>{ReadStore.locations[index]}</Text>
                                                <View style={styles.cardsRow}>
                                                    <View style={styles.card}>
                                                        <View style={styles.cardIconView}>
                                                            <Feather name="droplet" size={30} color={Colors.Secondary}/>
                                                            <Text style={styles.cardName}>Nem</Text>
                                                        </View>
                                                        <Text style={styles.cardValue}>%{key.current.humidity}</Text>
                                                    </View>
                                                    <View style={styles.card}>
                                                        <View style={styles.cardIconView}>
                                                            <Feather name="sunrise" size={30}
                                                                     color={Colors.Secondary}/>
                                                            <Text style={styles.cardName}>Gün Doğumu</Text>
                                                        </View>
                                                        <Text style={styles.cardValue}>{key.astro.sunrise ? key.astro.sunrise : null}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.cardsRow}>
                                                    <View style={styles.card}>
                                                        <View style={styles.cardIconView}>
                                                            <Feather name="sun" size={30}
                                                                     color={Colors.Secondary}/>
                                                            <Text style={styles.cardName}>UV</Text>
                                                        </View>
                                                        <Text style={styles.cardValue}>{key.current.uv}</Text>
                                                    </View>
                                                    <View style={styles.card}>
                                                        <View style={styles.cardIconView}>
                                                            <Feather name="sunset" size={30}
                                                                     color={Colors.Secondary}/>
                                                            <Text style={styles.cardName}>Gün Batımı</Text>
                                                        </View>
                                                        <Text style={styles.cardValue}>{key.astro.sunset ? key.astro.sunset : null}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.fill}>
                                            <View style={styles.footer}>
                                                {ReadStore.forecast[index].map(function (key) {
                                                    return(
                                                        key.astro.sunrise !== undefined &&
                                                                <View style={styles.forecastCard}>
                                                                    <View style={{alignItems:'center',justifyContent:'center'}}>
                                                                        <MaterialCommunityIcons
                                                                            name={key.day.condition.text.includes('cloudy') ? 'weather-cloudy' :
                                                                                key.day.condition.text.includes('clear') ? 'weather-cloudy' :
                                                                                    key.day.condition.text.includes('rain') ? 'weather-pouring' :
                                                                                            key.day.condition.text.includes('Sunny') ? 'weather-sunny' : 'weather-cloudy'

                                                                            }
                                                                            size={40} color={Colors.White}/>
                                                                        <Text
                                                                            style={styles.forecastDegreeText}>{key.day.avgtemp_c}°</Text>
                                                                        <Text style={styles.forecastDay}>{key.dayName}</Text>
                                                                    </View>
                                                                    <View style={{flexDirection: 'row'}}>
                                                                        <View style={styles.forecastCardDetail}>
                                                                            <Feather style={styles.forecastCardDetailIcon}
                                                                                     name="droplet" size={25} color={Colors.Secondary}/>
                                                                            <Feather style={styles.forecastCardDetailIcon}
                                                                                     name="sun" size={25} color={Colors.Secondary}/>
                                                                        </View>
                                                                        <View style={styles.forecastCardDetail}>
                                                                            <Text style={styles.forecastCardDetailValue}>%{key.day.avghumidity}</Text>
                                                                            <Text style={styles.forecastCardDetailValue}>{key.day.uv}</Text>
                                                                        </View>
                                                                    </View>
                                                                    <View style={{flexDirection: 'row'}}>
                                                                        <View style={styles.forecastCardDetail}>
                                                                            <Feather style={styles.forecastCardDetailIcon}
                                                                                     name="sunrise" size={25}
                                                                                     color={Colors.Secondary}/>
                                                                            <Feather style={styles.forecastCardDetailIcon}
                                                                                     name="sunset" size={25}
                                                                                     color={Colors.Secondary}/>
                                                                        </View>
                                                                        <View style={styles.forecastCardDetail}>
                                                                            <Text style={styles.forecastCardDetailValue}>{key.astro.sunrise ? key.astro.sunrise : null}</Text>
                                                                            <Text style={styles.forecastCardDetailValue}>{key.astro.sunset ? key.astro.sunset : null}</Text>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                    )
                                                })}
                                            </View>
                                        </View>
                                    </View>
                                )
                            })}
                        </ScrollView>
                        <View style={styles.bottomRow}>
                            <TouchableOpacity
                                onPress={() => ReadStore.deleteLocation(page)}
                            >
                                <Feather style={styles.bottomIcon} name="minus-circle" size={30} color={Colors.Secondary}/>
                            </TouchableOpacity>
                            <View style={{flexDirection:'row'}}>
                                {ReadStore.locations.map(function (key,index) {
                                    return (
                                        <View
                                            style={index === page ? styles.activeRound : styles.deactiveRound}>
                                        </View>
                                    )
                                })}
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                                <AntDesign style={styles.bottomIcon} name="search1" size={30} color={Colors.Secondary}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor:Colors.App
    },
    activityContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor:Colors.White
    },
    page:{
        width,
        flex:1.3,
        backgroundColor:Colors.App,
        borderBottomRightRadius:100,
    },
    fill:{
        backgroundColor:Colors.App,
        flex:1,
    },
    footer:{
        width,
        flex:1,
        backgroundColor: 'white',
        borderTopLeftRadius:100,
        justifyContent:'space-around',
        padding:30,
    },
    name:{
        fontSize:30,
        color:Colors.Secondary,
        alignSelf:'center',
        fontWeight:'bold'
    },
    bottomRow:{
        backgroundColor:Colors.App,
        paddingTop: 10,
        paddingHorizontal:20,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-between',
        paddingBottom: Platform.OS === 'android' ? 10 : null
    },
    appName:{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2,
        color:Colors.Secondary,
        fontSize:25,
    },
    bottomIcon:{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2,
    },
    icon:{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
        alignSelf:'center',
        marginTop: 20
    },
    degreeText:{
        fontSize: 60,
        color:Colors.White,
        marginLeft:20,
        alignSelf:'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    cardsRow:{
      flexDirection:'row',
        justifyContent:'space-around',
        marginTop: 20,
        marginHorizontal:50
    },
    card:{
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-around',
        backgroundColor:'white',
        borderRadius:10,
        paddingHorizontal:15,
        paddingVertical:10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
        width:140,
        height:70
    },
    cardName:{
        color:Colors.Secondary,
        fontSize:10,
        marginTop:4
    },
    cardValue:{
        color:Colors.Secondary,
        fontSize:16,
        marginLeft: 10
    },
    cardIconView:{
        alignItems:'center',
        justifyContent:'center'
    },
    forecastCard:{
        backgroundColor:Colors.App,
        borderRadius: 10,
        padding:10,
        marginTop:10,
        alignItems:'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
        flexDirection:'row',
        justifyContent:'space-around'
    },
    forecastDegreeText:{
        fontSize: 22,
        marginLeft:10,
        color:Colors.White,
    },
    forecastDay:{
        fontSize: 16,
        color:Colors.Secondary,
    },
    forecastCardDetail:{
        justifyContent:'space-around',
        alignItems:'flex-end'
    },
    forecastCardDetailValue:{
        color:Colors.Secondary,
        marginTop:10,
        marginLeft:10
    },
    forecastCardDetailIcon:{
        marginTop:10
    },
    activeRound:{
        backgroundColor:Colors.White,
        width:7,
        height:7,
        borderRadius:10,
        marginLeft:5
    },
    deactiveRound:{
        backgroundColor:Colors.Light,
        width:7,
        height:7,
        borderRadius:10,
        marginLeft:5
    }
});

export default inject("ReadStore")(observer(Home));


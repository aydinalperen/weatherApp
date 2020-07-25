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
import {inject, observer} from "mobx-react";
import ReadStore from "../store/ReadStore";
import Colors from "../assets/Colors";
import {SearchBar} from 'react-native-elements';
import Feather from "react-native-vector-icons/Feather";
import {f, firestore} from "../../config/config";

const {width,height} = Dimensions.get('window')
function Search({navigation}) {

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown:ReadStore.locations.length > 0 ? true : false
        });
    }, [navigation,ReadStore.locations.length]);

    const [search, setSearch] = useState('');
    const [searchData, setSearchData] = useState([]);

    function filter(text) {
            const newData = ReadStore.searchData.filter(function(item) {
                const itemData = item ? item.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });

            setSearchData(newData)
            setSearch(text)
    }

    useEffect(() => {
        setSearchData(ReadStore.searchData)
    },[ReadStore.searchData])

    useEffect(() => {
            ReadStore.searchLoading = true
            ReadStore.getSearchData()
    },[])

        //["Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya", "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul", "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kırıkkale", "Kırklareli", "Kırşehir", "Kilis", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"]

    function add(item) {
        ReadStore.searchLoading = true;
        const user = f.auth().currentUser;
        if(ReadStore.locations !== undefined && ReadStore.locations.length > 0){
            ReadStore.locations[ReadStore.locations.length] = item
            const data = {
                locations:ReadStore.locations
            }
            firestore.collection('users').doc(user.uid).set(data)
                .then(function () {
                    ReadStore.searchLoading = true
                    ReadStore.homeLoading = true
                    ReadStore.getLocations()
                    navigation.navigate('Home')
                })

        }else{
            const data = {
                locations:[item]
            }
            firestore.collection('users').doc(user.uid).set(data)
                .then(function () {
                    ReadStore.searchLoading = true
                    ReadStore.homeLoading = true
                    ReadStore.getLocations()
                    navigation.navigate('Home')
                })
        }
    }

    function render({item}) {
        let control = true
        return(
            <View style={styles.card}>
                <Text style={styles.cardText}>{item}</Text>
                {ReadStore.locations.length >0 ?
                    ReadStore.locations.map(function (key,index) {
                        if(control){
                            if(key === item){
                                control = false
                                return (
                                    <View style={styles.iconBackground}>
                                        <Feather name={'check'} size={20} color={Colors.Secondary}/>
                                    </View>
                                )
                            }else if (index === ReadStore.locations.length - 1){
                                return (
                                    <TouchableOpacity onPress={() => add(item)} style={styles.iconBackground}>
                                        <Feather name={'plus'} size={20} color={Colors.Secondary}/>
                                    </TouchableOpacity>
                                )
                            }
                        }
                        })
                :
                    <TouchableOpacity onPress={() => add(item)} style={styles.iconBackground}>
                        <Feather name={'plus'} size={20} color={Colors.Secondary}/>
                    </TouchableOpacity>
                }
            </View>
        )
    }

    return (

        ReadStore.searchLoading ?
            <View style={styles.activityContainer}>
                <ActivityIndicator size="large" color={Colors.App}/>
            </View>
            :
                <SafeAreaView style={styles.container}>
                    <SearchBar
                        autoFocus={false}
                        containerStyle={{backgroundColor: 'transparent', opacity: 1, borderBottomWidth: 0, borderTopWidth: 0}}
                        inputContainerStyle={{backgroundColor: 'white', borderRadius: 100}}
                        inputStyle={{color: Colors.Secondary}}
                        round
                        searchIcon={{size: 24, color: Colors.Secondary}}
                        onChangeText={text => filter(text)}
                        onClear={text => filter('')}
                        placeholderTextColor={Colors.Secondary}
                        clearIcon={{color: Colors.Secondary, size: 25}}
                        placeholder="Ara..."
                        value={search}
                    />
                    {searchData.length === 0 ?
                    <Text style={styles.notResult}>Sonuç Yok</Text>
                    :
                        <FlatList
                            data={searchData}
                            renderItem={render}
                            contentContainerStyle={{paddingBottom:20}}
                        />
                    }
                </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card:{
        backgroundColor:Colors.White,
        flex:1,
        margin:10,
        borderRadius:10,
        justifyContent: 'space-between',
        flexDirection:'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2,
    },
    cardText:{
        color:Colors.Secondary,
        fontWeight:'bold',
        fontSize:16,
        marginLeft:20,
        marginVertical:15,
    },
    iconBackground:{
        backgroundColor: Colors.App,
        borderTopRightRadius:10,
        borderBottomRightRadius:10,
        padding:15,
    },
    notResult:{
        alignSelf:'center',
        fontSize: 20,
        color:Colors.Secondary,
        fontWeight: 'bold',
        marginTop:20
    }
});

export default inject("ReadStore")(observer(Search));


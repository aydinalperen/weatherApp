import { decorate, observable, action } from "mobx";
import {auth, firestore} from "../../config/config";
import {Alert} from "react-native";


class ReadStore {

    @observable locations = []
    @observable detail = []
    @observable forecast = []
    @observable days = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi']
    @observable homeLoading = true
    @observable baseUrl = 'http://api.weatherapi.com/v1/'
    @observable apiKey = '3a8d1274df9b4d18a80125732201907'
    @observable error = false

    @action getLocations = () => {
        const self = this
        self.locations = []
        self.forecast = []
        self.detail = []
        auth.onAuthStateChanged(function(user) {
            if (user) {
                firestore.collection('users').doc(user.uid).get()
                    .then(function (doc) {
                        if(doc.data().locations.length > 0){
                            self.locations = doc.data().locations
                            self.error = false
                            self.searchLoading = false
                        }else{
                            self.error = true
                            self.homeLoading = false
                        }
                    }).then(function () {
                        self.getCurrentData()
                }).catch(function (error) {
                    self.error = true;
                    self.homeLoading = false
                })
            } else {
                auth.signInAnonymously()
                    .catch(function (error) {
                        Alert.alert(
                            "Error",
                            error.message,
                            { text: "OK"}
                        );
                    })
            }
        })
    }

    @action convert = (time) => {
        const [secondTime, modifier] = time.split(' ');
        let [hours, minutes] = secondTime.split(':');

        if (hours === '12') {
            hours = '00';
        }

        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }

        return `${hours}:${minutes}`;
    }

    @action getCurrentData = () => {
        const self = this
        this.locations.map(function (key,index) {
            fetch( self.baseUrl + 'forecast.json?key=' + self.apiKey + '&q=' + key + '&days=3')
                .then((response) => response.json())
                .then((responseJson) => {
                    self.detail.push(responseJson)
                    self.forecast.push(responseJson.forecast.forecastday)
                    const astro = {
                        sunrise: self.convert(responseJson.forecast.forecastday[0].astro.sunrise),
                        sunset: self.convert(responseJson.forecast.forecastday[0].astro.sunset)
                    }
                    self.detail[index].astro = astro
                    self.forecast[self.forecast.length - 1].map(function (key,secondIndex) {
                        const date = new Date()
                        date.setDate(date.getDate() + secondIndex)
                        self.forecast[index][secondIndex]['dayName'] = self.days[date.getDay()]
                        self.forecast[index][secondIndex].astro.sunrise = self.convert(self.forecast[index][secondIndex].astro.sunrise)
                        self.forecast[index][secondIndex].astro.sunset = self.convert(self.forecast[index][secondIndex].astro.sunset)
                    })

                    self.forecast[index].shift()
                })
                .then(function () {
                    if(self.locations.length === self.forecast.length){
                        self.homeLoading = false
                    }
                })
        })
    }

    //Search

    @observable searchLoading = false;
    @observable searchData = []


    @action getSearchData = () => {
        const self = this
        firestore.collection('data').doc('search').get()
            .then(function (doc) {
                self.searchData = doc.data().locations
            }).then(function () {
                self.searchLoading = false;
        })
    }

    @action deleteLocation = (index) => {
        const self = this
        self.homeLoading = true
        const filtered = self.locations.filter(function(value){ return value !== self.locations[index]})
        console.log(filtered)
        const uid = auth.currentUser.uid
        firestore.collection('users').doc(uid).set({
            locations:filtered
        }).then(function () {
            self.getLocations()
        })
    }



}

export default new ReadStore();

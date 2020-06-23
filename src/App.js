import React from 'react';
import Weather from './components/weather';

const API_KEY = '28bf21d94660c7691896649b9a92a3d1';  //API key for https://openweathermap.org/

export default class App extends React.Component {
    state = {
        city: undefined, country: undefined, temp: undefined, weather: undefined, windSpeed: undefined,
        windDeg: undefined, windDir: undefined, windLabel: undefined, humidity: undefined,
        preassure: undefined, sunrise: undefined, sunset: undefined,
        coords: { lat: undefined, lon: undefined }, error: undefined,

        weatherOn: false,  //for animated weather data

        seasonBg : this.getCurrentSeasonStyle()  //array with season picture and season background style
    };

    componentDidMount() {  //drop loader when main component will be ready
        setTimeout(function() {
            document.getElementById('loader').style.display = 'none';
            document.getElementById('body').style.overflowY = 'scroll';
        }, 2000);
    };

    getCurrentSeasonStyle() {  //get app style using season data
        let
            month    = new Date().getMonth(),
            bgImgs   = ['winter.jpg', 'spring.png', 'summer.jpg', 'autumn.jpg'],
            bgSolids = [
                ['light-blue darken-1', '#039be5'], ['green lighten-2', '#81c784'],
                ['light-green', '#8bc34a'], ['orange darken-3', '#ef6c00']
            ];

        return month >= 2 && month <= 4 ? [bgImgs[1], bgSolids[1][0], bgSolids[1][1]] :
            month >= 5 && month <= 7 ? [bgImgs[2], bgSolids[2][0], bgSolids[2][1]]: 
            month >= 8 && month <= 10 ? [bgImgs[3], bgSolids[3][0], bgSolids[3][1]] :
            [bgImgs[0], bgSolids[0][0], bgSolids[0][1]];
    };

    getWindDirection = deg => {
        if (deg) {
            var
                decodeDeg   = Math.floor((deg / 22.5) + 0.5),
                windDirects = [
                    'North', 'North-Northeast', 'Northeast', 'East-Northeast',
                    'East', 'East-Southeast', 'Southeast', 'South-Southeast',
                    'South', 'South-Southwest', 'Southwest', 'West-Southwest',
                    'West', 'West-Northwest', 'Northwest', 'North-Northwest'
                ];
            return windDirects[(decodeDeg % 16)];
        }
        return undefined;
    };

    getWindLabel = speed => {
        if (speed) {
            if (speed >= 0    && speed <= 0.2)  return 'Calm';
            if (speed >= 0.3  && speed <= 1.5)  return 'Light Air';
            if (speed >= 1.6  && speed <= 3.3)  return 'Light Breeze';
            if (speed >= 3.4  && speed <= 5.4)  return 'Gentle Breeze';
            if (speed >= 5.5  && speed <= 7.9)  return 'Moderate Breeze';
            if (speed >= 8.0  && speed <= 10.7) return 'Fresh Breeze';
            if (speed >= 10.8 && speed <= 13.8) return 'strong Breeze';
            if (speed >= 13.9 && speed <= 17.1) return 'Near Gale';
            if (speed >= 17.2 && speed <= 20.7) return 'Gale';
            if (speed >= 20.8 && speed <= 24.4) return 'Severe Gale';
            if (speed >= 24.5 && speed <= 28.4) return 'Strong storm';
            if (speed >= 28.5 && speed <= 32.6) return 'Violent Storm';
            if (speed >= 32.7)                  return 'Hurricane';
        }
        return undefined;
    };

    overlay = param => {  //animate the image overlay
        let overlayAction = param ? 'add' : 'remove';
        eval('document.getElementById("weather_wrap_image").classList.' + overlayAction + '("overlay_active")');
        eval('document.getElementById("weather_image_items").classList.' + overlayAction + '("items_active")');
        eval('document.getElementById("weather_wrap_image_reset").classList.' + overlayAction + '("reset_active")');
    };

    resetWeather = () => { //clear weather search
        document.getElementById('form_city_input').value = '';
        this.overlay(false);
        this.setState({weatherOn: false});
    };

    getWeather = async event => {
        event.preventDefault();  //reset default page reloading after form submiting
        var userCity = event.target.elements.city.value;

        if (userCity) {
            var
                apiUrl = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=${API_KEY}&units=metric`),
                data   = await apiUrl.json();

            if (data.cod === 200) {
                var
                    sunriseDate    = new Date(data.sys.sunrise * 1000),
                    sunsetDate     = new Date(data.sys.sunset * 1000),

                    sunriseHours   = sunriseDate.getHours(),
                    sunriseMinutes = '0' + sunriseDate.getMinutes(),
                    sunriseSeconds = '0' + sunriseDate.getSeconds(),

                    sunsetHours    = sunsetDate.getHours(),
                    sunsetMinutes  = '0' + sunsetDate.getMinutes(),
                    sunsetSeconds  = '0' + sunsetDate.getSeconds(),

                    sunriseTime    = sunriseHours + ':' + sunriseMinutes.substr(-2) + ':' + sunriseSeconds.substr(-2),
                    sunsetTime     = sunsetHours + ':' + sunsetMinutes.substr(-2) + ':' + sunsetSeconds.substr(-2);

                this.setState({
                    city: data.name, country: data.sys.country, temp: data.main.temp, weather: data.weather[0].description,
                    windSpeed: data.wind.speed, windDeg: data.wind.deg, windDir: this.getWindDirection(data.wind.deg),
                    windLabel: this.getWindLabel(data.wind.speed), humidity: data.main.humidity, pressure: data.main.pressure,
                    sunrise: sunriseTime, sunset: sunsetTime, coords: { lat: data.coord.lat, lon: data.coord.lon },
                    weatherOn: true,
                    error: undefined
                });
                this.overlay(true);
            } else {
                this.setState({
                    city: undefined, country: undefined, temp: undefined, weather: undefined, windSpeed: undefined,
                    windDeg: undefined, windDir: undefined, windLabel: undefined, humidity: undefined,
                    pressure: undefined, sunrise: undefined, sunset: undefined, coords: { lat: undefined, lon: undefined },
                    error: 'Hmmm.. i cant find this city', weatherOn: false
                });
                this.overlay(false);
            }
        } else {
            this.setState({
                city: undefined, country: undefined, temp: undefined, weather: undefined, windSpeed: undefined,
                windDeg: undefined, windDir: undefined, windLabel: undefined, humidity: undefined, pressure: undefined,
                sunrise: undefined, sunset: undefined, coords: { lat: undefined, lon: undefined },
                error: 'Enter the name of the city', weatherOn: false
            });
        }
    };

    render () {
        return (
            <div className="app-wrapper">
                <div className={'app-wrapper__inner ' + this.state.seasonBg[1]}>
                    <Weather
                        city={this.state.city} country={this.state.country} temp={this.state.temp}
                        weather={this.state.weather} windSpeed={this.state.windSpeed} windDeg={this.state.windDeg}
                        windDir={this.state.windDir} windLabel={this.state.windLabel} humidity={this.state.humidity}
                        pressure={this.state.pressure} sunrise={this.state.sunrise} sunset={this.state.sunset}
                        coords={this.state.coords} error={this.state.error} getWeather={this.getWeather}
                        seasonBg={this.state.seasonBg} resetWeather={this.resetWeather} weatherOn={this.state.weatherOn}
                    />
                </div>
            </div>
        );
    };
};
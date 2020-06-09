import React from 'react';
import Info from './info';
import Form from './form';
import {Animated} from "react-animated-css";

const Weather = props => (
    <div className="weather-wrap">
        <div id="weather_wrap_image" className="weather-wrap__image" style={{ 'background': 'url(images/' + props.seasonBg[0] + ') no-repeat center bottom / cover' }}>
            <div className="weather-wrap__image-reset" onClick={props.resetWeather} id="weather_wrap_image_reset">
                <svg viewBox="0 0 32 32">
                    <path d="M32 1.829l-1.828-1.829-14.172 14.171-14.171-14.171-1.829 1.829 14.171 14.171-14.171 14.172 1.829 1.828 14.171-14.171 14.172 14.171 1.828-1.828-14.171-14.172z"></path>
                </svg>
            </div>
            <div className="weather-wrap__image-inner">
                <div className="weather-wrap__image-inner-items" id="weather_image_items">
                    <div>
                        {
                            props.city && props.country &&
                            <p className="weather-wrap__country">{props.city}, {props.country}</p>
                        }
                        {
                            props.temp &&
                            <p className="weather-wrap__temps">{(props.temp).toFixed(2)} &deg;C, {((props.temp * (9 / 5)) + 32).toFixed(2)} &deg;F</p>
                        }
                        {
                            props.weather &&
                            <p className="weather-wrap__weather">{props.weather}</p>
                        }
                    </div>
                </div>
            </div>
        </div>
        <div className="weather-wrap__content">
            <div className="weather-wrap__content-inner">
                <Info />
                <Form
                    getWeather={props.getWeather}
                    seasonBg={props.seasonBg}
                />
                { props.city &&
                    <Animated animationIn="fadeInUp" animationOut="fadeOutDown" isVisible={props.weatherOn}>
                        <div className="weather-wrap__content-inner-items">
                            <p className="weather-wrap__content-item">
                                <span>Wind</span>: {props.windLabel ? props.windLabel : '-'},
                                {props.windSpeed && ' ' + props.windSpeed + 'm/s,'}
                                {props.windSpeed && ' ' + (props.windSpeed * 1.6).toFixed(2) + 'km/h,'}
                                {props.windDir && ' ' + props.windDir} {props.windDeg && ' (' + props.windDeg.toFixed(2) + ')'}
                            </p>                           
                            {
                                props.humidity &&
                                <p className="weather-wrap__content-item">
                                    <span>Humidity</span>: {props.humidity}%
                                </p>
                            }
                            {
                                props.pressure &&
                                <p className="weather-wrap__content-item">
                                    <span>Pressure</span>: {props.pressure} hpa
                                </p>
                            }
                            {
                                props.sunrise &&
                                <p className="weather-wrap__content-item">
                                    <span>Sunrise</span>: {props.sunrise}
                                </p>
                            }
                            {
                                props.sunset &&
                                <p className="weather-wrap__content-item">
                                    <span>Sunset</span>: {props.sunset}
                                </p>
                            }
                            {
                                props.coords &&
                                <p className="weather-wrap__content-item">
                                    <span>Geo coords</span>: [{props.coords.lat}, {props.coords.lon}]
                                </p>
                            }
                        </div>
                    </Animated>
                }
                {
                    props.error && <p className="error red">{props.error}</p>
                }
            </div>
        </div>
    </div>
);

export default Weather;

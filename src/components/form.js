import React from 'react';

const Form = props => (
    <form onSubmit={ props.getWeather } className="app-form">
        <div className="app-form__wrapper">
        	<input type="text" name="city" placeholder="City" id="form_city_input" />
       		<button className="btn-floating btn-large pulse blue lighten-5">
                <i className="material-icons" style={{'color': props.seasonBg[2]}}>cloud</i>
            </button>
        </div>
    </form>
);

export default Form;

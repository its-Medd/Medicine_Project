import React from "react";
import "./label.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPen} from '@fortawesome/free-solid-svg-icons';

export default function Label({
    label,
    con,
    valeur,
    type,
    className='',
    click
}){
    return(
        <div className={className}>
            <label className="label">{label}</label>
            <div>
                <span>{con}</span>
                <input type={type} value={valeur} className="input"/>
                <span className="modif"><FontAwesomeIcon icon={faPen} onClick={click}/></span>
            </div>
        </div>
    );
}
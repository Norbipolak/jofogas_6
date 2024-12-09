/*
    Ez a Controller lesz majd minden controller-nek az őse 
*/

import http, { HTTP } from "./HTTP.js";
import Validator from "./Validator.js";

class Controler {
    protected validator:Validator;
    protected http:HTTP; //ez a típus lesz, amit mi csináltunk 

    constructor() {
        this.validator = new Validator();
        this.http = http;
        /*
            Mert itt már a HTTP.ts-en lett ez példányosítva 
            -> 
            const http = new HTTP();
            export default http;
        */
    }

    /*
        Majd ez fogja a jogosultságokat is ellenőrizni, de azt még nem tudjuk, hogy hogyan 
        De a Validator az biztosan lesz neki 

        És mivel ez lesz az őse mindegyik controller-nek, ezért a validator nem private lesz, hanem protected
        ->
        private validator:Validator
        ->
        protected validator:Validator

        És ami még ide kellene az egy HTTP példány (HTTP.ts)
        ->
            protected validator:Validator;
            protected http:HTTP; ***

            constructor() {
                this.validator = new Validator();
                this.http = http; ***

        ******
        controllers-ben van egy olyanunk, hogy UserHandlerController, ami örökölni fog ettől
        class userHandlerController extends Controller 
        Ahol majd lesz egy constructor is mivel extends, ezért örököl és meg kell hívni a super()-t 
    
    */
}

export default Controler;
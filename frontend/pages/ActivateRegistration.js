/*
    Ezt arra csináljuk, hogy amikor elküldjük az email-t, hogy megerősítsük a jelszavunkat, akkor kapunk egy email-t
    amiben van egy link és arra kattintva, meg tudjuk erősíteni 

    Itt kell nekünk egy useParams, mert ahova most visz minket az url-ben ott elklüdjük az activationString-et meg a a userID-t is!!! 
    így néz ki az URL, amikor rákkatintunk a linkre 
    ->
    https:localhost:3000/activate-registration?activationString=ggdgdcds35r&userID=1
    És ezeket le kell menteni a föggvényben ezeket az értékeket, ezt pedig a useParams-val tudjuk!!! 
    Ez ilyen kulcs - értékpáros dolog, kulcsok az activationString meg a userID az értékek meg a ggdgdcds35 és az 1 

    ezeket ilyen formában tudjuk ide lementeni 
    ->
    const {actiovationString, userID} = useParams();

    És erre kell csinálni egy route-ot az App.js-ben!!
    <Route path={"/activate-registration/:activationString/:userID"} element={<ActivateRegistration/>}/> !!!!!!

    Fontos, ahol megcsináljuk a route-ot ott benne kell lennie a registrationString-nek meg a userID-nak az URL-ben, mert azokat az értékeket 
    majd a useParams-val csak így tudjuk megszerezni!!! 

    De ez is nem jó, így mert kétféleképpen tudunk így átadni értékeket, ha az URL-ben van az érték 
    pl. így -> <Route path={"/activate-registration/:activationString/:userID"} element={<ActivateRegistration/>}/>

    Mert itt URL változókkal operáltunk 
    https:localhost:3000/activate-registration?activationString=ggdgdcds35r&userID=1
    Ezt pedig nem a useParams-val hanem a location-val tudjuk megszerezni a függvényen belül!!! 
    const location = useLocation()!!!!!!!!!!!!!!!!!!

    A userParams-nál pedig úgy van, hogy /valami/valami tehát nem így, hogy ?=
    Így is meg lehet oldani csak akkor át kell írni a linket!!! 

    Most useParams-osat csináljuk de akkor át kell írni a userHandler-ben a linket!!!! 
    
    <a href="${process.env.CLIENT_URL}/activate-registration/${activationString}/${userID}">
    Most így kell lennie a userHandlerModels-ben a register függvény, amiben küldünk egy email-t a felhasználónak és abban egy linket
    amire rá kell kattintania a megerősítéshez 
    És ha itt params-val akarjuk kiszedni a id-t meg az actiovationString-et, akkor / jelekkel kell elküldeni ha meg 

    queryVsParams-ban az elmagyarázás 
    Megcsináljuk neki az App.js-ben a Route-ot 
        <Route path={"/activate-registration/:activationString/:userID"} element={<ActivateRegistration/>}/>

    És ez lesz majd megjelenítve ez az ActiceRegistration, mert ez a függvény annál a route-nál lesz meghívva!!! 

*/

import { useParams } from "react-router-dom";
import {  sBaseUrl } from "../../app/url";

function ActivateRegistration() {
    const {activationString, userID} = useParams();

    console.log(activationString, userID); //1PJzIxj4gY 31
    /*
        Mert ez az URL amin most vagyunk, hogy localhost:3000/activate-registration/1PJzIxj4gY/31
    */

    const activateRegistration = async ()=> {
        try {
            const response = await fetch(`${sBaseUrl}/activate-registration/${activationString}/${userID}`);

            
        } catch(err) {

        }
    }

    return(
        <div className="container-lg">

        </div>
    );
}

export default ActivateRegistration;
import { Outlet, Link } from "react-router-dom";
import { createContext } from "react";
import MessageBox from "./MessageBox";

export const GlobalContext = createContext("MbContext");

function Nav() {
    /*
        fontos, hogy amikor vár majd a MessageBox azok a prop-ok, amikert majd átadunk neki azok itt el legyenek tárolva egy useState-ben 
        1. messageBox ezeket várja prop-nak function MessageBox({message, display, setDisplay, buttons, setButtons})
        2. Itt meg akarjuk hívni <MessageBox /> és majd itt kell átadni amiket vár, hogy message... 
        3 Ami meg innen fog jönni, hogy itt eltároljuk egy useState-ben ezeket és azt adjuk át neki!! 
            const [message, setMessage] = useState("");
        4. És most adjuk át neki ezeket az értékeket ami el van tárolva a useState-ben 
            <MessageBox 
                message={message}
                display={display}
                setDisplay={setDisplay}
                buttons={buttons}
                setButtons={setButtons}
            />

    */
    const [message, setMessage] = useState("");
    const [display, setDisplay] = useState(false);
    const [buttons, setButtons] = useState([]);
    const [loading, setLoading] = useState(false);

    //hogy megjelenítödjön a button, amikor feljön az üzenet
    useEffect(()=> {
        setButtons([{
            text:"OK", 
            icon: "fa solid fa-square-check",
            cb: ()=> setDisplay(false);
        }])
    }, []);
    /*
        és akkor így már ott van a button meg az is, hogy OK, ami bele van írva, de még be kell hívni az fontawesome-os ikont az App-js-ben!! 
    */


    return(
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/" >Kezdőlap</Link>
                    </li>
                    <li>
                        <Link to="/regisztracio" >Regisztráció</Link>
                    </li>
                </ul>
            </nav>
            <MessageBox 
                message={message}
                display={display}
                setDisplay={setDisplay}
                buttons={buttons}
                setButtons={setButtons}
            />

            <GlobalContext.Provider
                value={{
                    message,
                    display,
                    setDisplay,
                    buttons,
                    setButtons, 
                    loading, 
                    setLoading
                }}>
            <Outlet/>
            </GlobalContext.Provider>
        </>
    );
}

export default Nav;

/*
*************************************************
    A HTML <a> tag és a React Router Link komponens alapvetően hasonló célt szolgálnak: 
        mindkettő navigációra használjuk!!! 
    Mükődésük és használati esetek között jelentős különbségek vannak 


    HTML <a> tag 
        - Egy URL-re mutató hivatkozás létrehozására használjuk 
        - Ha egy <a> linkre kattintunk, az alapértelmezett müködés szerint az oldal újratöltödik, és a böngésző új kérést küld az adott URL-re!!! 
        
    Példa 
    ->
    <a href="/about">Rólunk</a> 

    1. Frissíti az oldalt 
        - A teljes böngésző újratöltödik, és a szerver küldi vissza a kért oldalt 
    2. SEO barát 
        - A keresőmotorok jól ismerik az <a> tag-vel létrehozott linkeket, ez így jó választás SEO szempontból 
    3. Egyszerű, de limitált 
        - Csak alpvető navigációra alkalmas 
        - Nem lehet egyszerűen integrálni a JavaScript-alapú alkalmazásokba (pl.React) 

    React Router Link komponens 
    Mire való? 
        - A React-Router könyvtár része, amelyet egyoldalas alkalmazások (SPA, single-page application) navigációjára használják
        - Nem tölti újra a teljes oldalt, hanem dinamikusan kezeli az oldalak közötti váltást, miközben az állapot megmarad 

    Példa
    -> 
    import { Link } from "react-router-dom";

    <Link to="/about">Rólunk</Link>

    Jellemzők 
    1. Nem frissíti az oldalt 
        - A navigáció a JavaScript által történik, ami gyorsabb, mivel a böngésző nem küld újra kérést a szervernek 
    2. Dinamikus SPA-navigáció 
        - Az állapotok és komponensek a helyükön maradnak, ami különösen fontos egy interaktiv webalkalmazásnál 
    3. Nem SEO barát alapból 
        - Mivel JavaScript alapú, a keresőmotorok nem mindig tudják megfelelően index-elni 
        - SEO optimalizálás érdekében érdemes a szerveroldali renderelést (SSR) vagy statikus oldalgenerálást használni

    Fő különbségek 
                                A tag                                           Link 
                            Újratöltödik                                    Az oldal nem töltödik újra
                            Hagyományos weboldalak                          JavaScript-alapú SPA-k
                            Lassabb, új kérést küld                         Gyorsabb, csak a nézet változik
    Paraméterek kezelése    Korlátozott (query string)                      Könnyen kezelhető (URL paraméterek)   
*************************************

Majd itt a mesageBox-ot akarjuk megjeleníteni, meg mindenhol, ezért csináltunk egy createContext-et 
fontos, hogy a messageBox az vár nekünk ({message, display, setDisplay, buttons, setButtons})  

Mi az a createContext és a GlobalContext 
1. CreateContext 
    - A React Context API része, amelyet globális állapot létrehozására használunk egy alkalmazáson belül 
    - A cél az, hogy adatokat (pl. message, display) bármely komponens számára elérhetővé tegyünk anélkül, hogy props-ok 
        hosszú láncolatát kellene átadnunk  
. GlobalContext
    - Ez egy globális kontextus, amelyet a createContext-tel hozunk létre 
        export cosnt GlobalContext = createContext("MbContext");
    - Ez az alkalmazás azon részeiben lesz hasznos, ahol szeretnénk hozzáférni az állapothoz pl. message, buttons 
        vagy manipulálni azokat 

    A globális kontextus a React Context API segítségével hozzuk létre. A GlobalCOntext provider csomagolt komponensek 
    például az OUTLET hozzáférnek a következő komponensekhez 
        message, display, stDisplay, buttons .., hogy minden komponensben majd ki tudjuk írni, hogy mi volt a hiba egy ilyen messageBox-ban!!! 
    Ez lehetővé teszi, hogy ezeket az adatokat és állapotfrissítő függvényeket ne kelljen egyenként props-ként átadni, hogy az összes 
    child component-nek. A kontextus használata egyszerűsíti az állapotkezelést, különösen a nagyobb alkalmazások esetén 

    Kód összefoglalása 
    1. Beállít néhány alapvető állapotot (message, display, buttons)
    2. Egy navigációs menüt jelenít meg 
    3. Egy MessageBox nevű komponenst használ, amely az üzenetek kezelésével foglalkozik
            <MessageBox 
                message={message}
                display={display}
                setDisplay={setDisplay}
                buttons={buttons}
                setButtons={setButtons}
            /> 
    4. Egy globális kontextust biztosít a child components számára GlobalContext.Provider segítségével, így az állapot 
    és a kapcsolodó függvények könnyen hozzáférhetőek a teljes alkalmazásban 
            <GlobalContext.Provider
                value={{
                    message,
                    display,
                    setDisplay,
                    buttons,
                    setButtons
                }}>
            <Outlet/>
            </GlobalContext.Provider>

    Ha azt mindjuk a display-re, hogy true, akkor megjelenik az a message box, amit a messageBox-ból van meghívva és az csinálja!! 
        de ez még teljesen üres lesz 

    ********************
    Ez van a messageBox.js-ben 
    Hogyha az display megváltozik 

    useEffect(()=> {
        if(!display && setButtons !== undefined && setButtons !== null) {
            setButtons([{
                text: "OK", 
                icon: "fa solid fa-square-check", 
                cb: ()=> setDisplay(false)
            }])
        }
    }, [display])

    1. hook mükődése
    - A useEffect egy olyan React hook, amely lehetővé teszi, hogy a mellékhatásokat (side effects) hajtsunk végre a komponens életciklusa során
    - Ebben az esetben a useEffect, csak akkor fut le, amikor a display állapota megváltozik 
    
    2. feltételvizsgálat 
    - !display: Ha a display állapot értéke false, tehát nincsen megjelenítendő üzenet 
    - setButtons !== undefined && setButtons !== null: Ha a setButtons függvény definiált és nem null, azaz ténylegesen meghívható 

    3. Gombok beállítása 
    - Ha fenti feltételek teljseülnek, a setButtons függvánnyel egy új gombot állítunk be, Ez a gomb a következő tulajdonságokkal rendelkezik 
        text: A gomb szövege, ebben az esetben OK
        icon: FontAwesome ikon 
        cb (callback): Egy a függvény akkor fut le, amikor a gombot megnyomták. Ebben az esetben ez a setDisplay(false) függvényt hívja meg 
            ami elrejti az üzenetet
    **********************
    Fel kell venni az FontAwesome-os ikonokat az App.js-ben!!! 
        import { library } from "@fortawesome/fontawesome-svg-core";
        import { faCircleXMark } from "@fortawesome/free-solid-svg-icons";
        library.add(
            faCircleXMark
    és akkor meg is jelent az X ikon, amivel be tudjuk zárni ezt a megjelenítődött üzenetet 

    Most az kell megcsinálni, hogy alapból legyen egy button, ami feljön nekönk, amikor megjelenik ez az üzenet box (useEffect)
*/
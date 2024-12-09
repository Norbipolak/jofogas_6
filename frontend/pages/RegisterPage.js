import { useState } from "react";
import { sBasUrl } from "../../app/url";

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [passAgain, setPassAgain] = useState("");

    const register = async ()=> {
        try {
            const response = await fetch(`${sBasUrl}/api/register`, {
                method:"POST",
                body:JSON.stringify({email,pass,passAgain}),
                headers:{"content-type":"application/json"}
            });

            const json = await response.json();

            if(response.ok) { 
                /*
                hogyha response.ok, tehát ha az true, akkor minden rendben ment
                És ha minden rendben ment, akkor el tudtuk küldeni a dolgokat a szerver felé, de itt viszont ki kell üríteni a 
                    useState-s értékeket, hogy nem maradjanak bent!! 
                */
                setEmail("");
                setPass("");
                setPassAgain("");
            }

            /*
                Itt meg kell a messageBox-os dolog, hogy ki írjuk a felhasználónak, hogy rendben ment-e minden vagy nem! 
                most csináltunk egy olyat, hogy MessageBox.js a components-ben a Nav.js meg ez van most!! 
                És a Nav-ban csinálunk egy context-et!!! 
            */
        } catch(err) {
            console.log("RegisterPage.register ", err);
            alert("Nem sikerült elérni a szervert= Próbálja meg késöbb!");
        }

        /*
            Állapotkezekés 
            - 3 állapot van definiálva 
                email, pass, passAgain 
            Ezeket egy React useState hook-val hoztuk létre, hogy dinmikusan frissíthetők legyenek a komponensben 

            register: 
            Ez az aszinkron függvény felelős a regisztrációs kérés küldéséért a szerver felé!!!! 
            1. fetch metódus 
                A ${sBaseUrl}/api/register URL-re küld egy POST tipusú HTTP kérést!!! 
                A kérés törzse (body) egy JSON objektumot tartalmaz, amely a felhasználó által megadott adatokat küldi!!! (email, pass..)

            2. fetch metódus 
                A kérés fejlécében megadjuk, hogy a küldött adat JSON formátumú -> headers: "content-type":"application/json"

            3. response és a json
                A szerver válaszát a (response) JSON formátumban olvassuk ki a response.json() metódussal 

            Összegzés 
                - Email címet és jelszavakat fogad felhasználótól 
                - Küldi az adatokat egy szervernek a regisztráció végrehasjtásához 
                - Kezeli a válaszokat és figyelmeztető üzenteket jelenít meg a felhasználónak ha sikeres vagy sikertelen a kisérlet 
            
        */

        return(
        <div className="container-xl text-center">
            <div className="mw-500 box-light-grey margin-auto p-md">
                 <h4>Email cím</h4>
                 <input/>
            </div>
        </div>
        )
    } 
}

/*
    Folyamat összefoglalása 

    1. Adatok bekérése a felhasználótól
        - A felhasználó által megadott adatok (e-mail, jelszó stb.) a React komponens állapotába kerülnek a useState segítségével 
        
    2. Adatok küldése a szerverre 
        - Az állapotban tárolt adatokat egy JSON objektummá alakítjuk a JSON.stringify() segítségével 
        - Ezt az adatot egy POST kérésben küldjük el a szervernek a FETCH használatával 
    3. Sterver válaszának a fogadása 
        - A szerver egy JSON formátumú választ küld vissza (általában egy objektum vagy tömb formájában) 
        - a választ egy response.json() segítségével alakítjuk át JavaScript objektummá, hogy a komponens fel tudja dolgozni


    Felhasználói input:        React állapot
    ↓                            ↓
    { email, jelszó } ---------> useState (pl. setEmail, setPass)
    ↓
    JSON.stringify(adatok)
    ↓
    HTTP POST kérés ---------> Szerver
                        Szerver feldolgozza, válaszol
    ↓
    response.json()
    ↓
    React komponens megjeleníti a visszajelzést

    Példák szerver válaszokra, amit mi állítunk be szerver oldalon 
    Sikeres válasz 
    {
        "status":200, 
        "message":"Sikeres regisztráció",
        "userID": 1234
    }
    Hiba (pl. az email már foglalt) 
    {
        "status":400,
        "message":"Ez az email cím már használatban van!"
    }
    Szerver hiba 
    {
        "status":500,
        "message":"Belső szerverhiba. Kérjük, próbálja meg késöbb!"
    }

    és akkor itt be lehet állítani, hogy majd mit lásson a felhasználó, hogy Sikeres regisztráció stb.

    Miért kell a JSON.stringify meg a response.json()
    1. JSON.stringify(data): A JavaScript objektumot (React állapot) JSON formátumú szöveggé alakítja, amely az interneten szabvámyosan használható
    2. response.json(): A szerver által küldött JSON választ visszaalakítja JavaScript objektummá, így könnyen hozzáférhetünk 
        a tulajdonságaihoz (pl. status vagy message) !!!!!!!!!!!!!!!!!!

*/
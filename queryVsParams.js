/*
    1. Query 

    A lekérdezési karakterláncra utal az URL-ben
    Az ? után követő rész, amely adatokat ad át kulcs-érték formájában 

    Példa: 
    - URL: https://example.com/search?query=react&sort=asc
    - Lekérdezési karakterlánc: ?query=react&sort=asc
    - Lekérdezési paraméterek: { query:'react', sort: 'asc' }

    Használat:
    Olyan keretrendszerekben, mint a React, a lekérdezési karakterlánc eléréséhez használhatunk pl. react-router-dom-ot vagy egyébb 
    könyvtárakat pl. qs 
*/

import { useSearchParams } from "react-router-dom";

const Komponens = ()=> {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query"); //react 
    const sort = searchParams.get("sort"); //asc
};

/*
    2. Params 

    Az útvonal paraméterekre utal, amelyek az útvonal dinamikus részei!!!!! 
    és helykitöltökkel vannak meghatározva az útvonal konfigurációjában :

    Példa:
    Útvonal: /user/:id 
    URL: https://example.com/user/42
    Paraméter: { id:'42' }

    Használat:
    Az útvonal paraméterek elérése React Router-ben
*/

import { useParams } from "react-router-dom";

const Komponens2 = ()=> {
    const { id } = useParams(); //42
};

/*
    3. Location 

    Az aktuális URL-t jelöli és tatalmazza az útvonalat (pathname), lekérdezési karakterláncot (search), horgonyrészt (hash) stb. 

    Példa: 
    URL: https://example.com/user/42?query=react#section
*/
//Location objektum 
{
    pathname: "/user/42",
    search: "?query=react", 
    hash: "#section",
    state: {} //opcionális, ha egyedi állapotot küldünk 
}

//A location elérése React Router-ben 
import { useLocation } from "react-router-dom";

const Komponens3 = ()=> {
    const location = useLocation();
    console.log(location.pathname); // "/user/42"
    console.log(location.search); // "?query=react"
    console.log(location.hash); // "#section"
};

/*
    4.Navigate 

    Egy függvény vagy egy metódus, amelyet programozott navigációra használnak az útvonalak között 

    Példa: React Routerben
*/

import { usrNavigate } from "react-router-dom";

const Komponens4 = ()=> {
    const navigate = useNavigate();

    const goHome = ()=> {
        navigate("/home"); // A /home oldalra navigál 
    };
};

/*
    Használható például felhasználók átirányítására bizonyos feltételek alapján, pl. űrlap 
    beküldése után vagy hitelesítési ellenőrzés során 
*/

navigate("/home", { state: { message: "Üdv újra itt" } });

/*
    Összefoglaló táblázat 

    Fogalom                  Jelentés                                                             Kulcspontok
    Query        Lekérdeti karakterlánc (pl. ?key=value)      Opcionális adatok átadására használatos az URL-ben, useSearchParams-val érhető el
    Params      Dinamikus útvonal paraméterek (pl. :id)       Az útvonalban meghatározott paramétereket, amelyeket useParams-val érünk el 
    Location    Az aktuális URL objektuma                 Információt nyújt az aktuális útvonalról (pathname, search, hash) useLocation-vel 
    Navigate    Programazott navigációs függvény                Navigációra használható, opcionálisan állapotot is átadhat 
*/

/****************************************************************************************************************************************/

/*
    Egyébek 
    1. Állapot (state) átadása navigáció közben 
    Amikor egy navigate()-et vagy egy Link komponenst használunk, nemcsak a cél útvonalat, hanem egyedi állapotot is átadhatunk 
    amelyek nem jelennek meg az URL-ben 
*/

import { useNavigate, useLocation } from "react-router-dom";

const senderComponent = ()=> {
    const navigate = useNavigate();

    const handleClick = ()=> {
        navigate("/details", { state: { productID: 123, from: "homepage" } });
    }

    return <button onClick={handleClick}>Részletek megtekintése</button>
};

const receiverComponent = ()=> {
    const location = useLocation();

    const { productID, from } = location.state || {}; //productID: 123, from: "homepage"
    return <div>Termék ID: {productID}, érkezett innen: {from}</div>
};

//Fontos ha újratöltjük a state nem marad meg, Ezért fontos, hogy tartós adatokat (pl. query string) használjunk ha erre van szükség

/*
    2. Horgonyrészek (hash) kezelése 

    A hash az URL végén található rész, amely a # jel után következik és általában oldalon belüli navigációhoz használják 
*/

import { userLocation } from "react-router-dom";

const Component = ()=> {
    const location = useLocation();

    //a location.hash tartalmazza a horgonyrészt (hash) pl. #section
    console.log(location.hash);
};

// Ha azt szeretnénk, hogy a horgonyrész automatiokus görgetéssel müködjön 

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHash = ()=> {
    const { hash } = useLocation();

    useEffect(()=> {
        if(hash) {
            const element = document.querySelector(hash);
            if (element) element.scrollIntoView({ behaviour: "smooth" });
        }
    }, [hash]);

    return null;
};  

/*
    3. Útvonalvédelem (Route Guard) 

    Ha van egy olyan oldalunk, amelyhez csak bizonyos feltételek teljseülése esetén lehet hozzáférni 
    (pl. bejelentkezett felhasználók), akkor a védett útvonalakat kell létrehoznunk 
*/

import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, children })=> {
    return isAuthenticated ? children : <Navigate to="/login"/>
};

<Route
    path="/dashboard" 
    element={
        <ProtectedRoute isAuthenticated={userLocation.isLoggedIn}>
            <DashBoard/>
        </ProtectedRoute>
    }
/> 

/*
    4. Dinamikus útvonalak és alútvonalak (nested routes)!!!!!
    
    Az alútvonalak lehetővé teszik, hogy egy főútvonalon belül többb különböző komponens jelenjen meg dinmikusan 

<Route path="/dashboard" element={<DashBoard/>}>
    <Route path="profile" element={<Profile/>}/>
    <Route path="settings" element={<Settings/>}/>   
</Route>
*/

//Megjelenítés

import { Outlet } from "react-router-dom";

const Dashboard = ()=> {
    return(
        <div>
            <h1>Dashboard</h1>
            <Outlet/> {/*Az útvonalak tartalma itt jelenik meg*/}
        </div>
    )
};

/*
    5. Programozott átírányítás (redirect) egy feltétel alapján 

    Pl. ha egy bejelentkezett felhasználót át akarunk írányítani a kezdőoldalra, ha megpróbálja elérni az oldalt
*/

import { Navigate } from "react-router-dom";

const LoginPage = ({ isAuthenticated })=> {
    if(isAuthenticated) {
        return <Navigate to="/home"/>
    }

    return <div>Bejelentkezési oldal</div>
};

/*
    6. BrowserRouter vs HashRouter 

    BrowserRouter 
    - Modern útvonalkezelés, amely egy az URL valódi útvonalait használja 
    - Példa: https://example.com/dashboard
    - Előnyök: SEO barát, tisztább URL-ek 
    - Hátrányok: Szerver beállítása szükséges az útvonalak kezeléséhez (pl. minden útvonal a fő fájlra irányítson vissza)

    HashRouter
    - Az URL #jelét használja az útvonalakhoz 
    - Példa: https://example.com/#/dashboard
    - Előnyök: Nem igényel szerver beállítást7
    - Hátrányok: Nem SEO barát, kevésbé professzinális megjelenés 
*/

/*
    7. Not Found (404) oldal kezelése 
    Egyedi 404-es oldal készítése az ismereten útvonal kezelésére 

    <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="*" element={<NotFound/>} />
    </Routes>
*/

/*
    8. API hívások query vagy params alapján 

    Az URL paraméterek vagy query sting-eket gyakran használják API hívások során 

    Példa:
*/

import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Datafetcher = ()=> {
    const { id } = useParams(); // Dinamikus útvonal paraméter 
    const [searchParams] = useSearchParams(); //lekérdezi paraméterek
    const [data, setData] = useState(null);

    useEffect(()=> {
        const fetchData = async ()=> {
            const response = await fetch(`/api/items/${id}?filter=${searchParams.get("filter")}`);

            const results = response.json();

            setData(results);
        }

        fetchData();
    }, [id, searchParams])

    return(
        <div>{data ? JSON.stringify(data) : '...Betöltés'}</div>
    );
}

/*
    Nagyon fontos Navigate (front-end) vs Redirect (back-end)

    1. Navigate (Front-End Navigáció)

    - A Navigate a kliensoldali navigációt jelenti, amely során az alkalmazás frissíti az URL-t és az oldalon belüli tartalmat 
    anélkül, hogy az oldal újratöltödne

    - Főként single-page application (SPA) alkalmazásokban használják pl. React Routerrel 

    Hogyan müködik?

    - A front-end böngésző a History API-ját (pl. pushState vagy replaceState) használja az URL módosíására 
    - Az alkalmazás az aktuális útvonal alapján határozza meg, hogy milyen tartalmat jelenítsen meg 
        és csak a szükséges komponenseket tölti be 

    Példa:
*/

import { useNavigate } from "react-router-dom";

const Komponens5 = ()=> {
    const navigate = useNavigate();

    const handleClick = ()=> {
        navigate("/about"); //Az URL /about-ra vált és betölti az About komponenst 
    }

    return 
        <button onClick={handleClick}>Tovább az About oldalra</button>
    
};

/*
    Kulcspontok:

    - Nincs teljes oldal újratöltés: A navigáció gyors, mert az oldal egyes részei frissülnek 
    - Front-End útvonalak szükségesek: A front-end alkalmazásban előre meg kell határozni az útvonalakat 
    - A lekéredezés során hsználhatunk query string-eket is pl. ?query=example

    Mire jó?
    - Oldalak közötti navigációra SPA-kban 
    - Gyors és gördülékeny felhasználói élmény biztosítására 
*/

/*
    2. Redirect (Back-End Átírányítás)

    - A Redirect azt jelenti, hogy a szerver utasítja a böngészőt egy új URL betöltésére. Ez egy teljes oldal újratöltéssel jár 
    - Az átírányítást általában HTTP válaszokkal végzik (pl. 301, 302) 

    Hogyan müködik?

    - A szerver egy Location fejlécet küld a böngészőnek, amely tartalmazza az új URL-t 
    - A böngésző ezt követően új kérést küld az URL-re és betölti az adott oldalt 

    Példa:
*/
app.get("old-route", (req, res)=> {
    res.redirect(301, "new-route");
    //Átírányit a /new-route-ra 301 állandó státusszal 
})

/*
    Kulcspontok: 

    - Teljes oldal újratöltés: A böngésző új kérést küld az új URL-re 
    - HTTP státuszkódok: A szerver megadja az átírányítás típusát:
        - 301: Állandó átírányítás (SEO barát, keresők frissítik az indexelt URL-t) 
        - 302: Ideiglenes átírányítás
        - 307: Ideiglenes átírányítás, amely megőrzi az eredeti HTTP metódusát (pl. POST marad POST)
    - SEO szempontok: Fontos, hogy az URL-eket szeretnénk optimalizálni a keresők számára 

    Mire jó? 
    - Elavult vagy nem létező URL-ek átírányítására 
    - Hitelesítés kényszerítésére (pl. nem bejelentkezett felhasználók átírányítása a bejelentkezési oldalra)!!!!!!
    - Domain vagy URL normalizására (pl. http:// -> https://)


    Navigate és Redirect összehasonlítása 
                                    Navigate(kliensoldal)                                      Redirect(Szerveroldal) 
Kiváltja                    Front-end keretrendszer (pl. React vagy Angular)               Szerver válasza (pl. Node.js, PHP, Java)
URL kezelés                 Az URL-t a böngésző History API-ja módosítja                      A böngésző új Location fejlécet kap 
Oldal újratöltése           Nincs újratöltés                                                   Teljes oldal újratöltödik 
Teljesítmény                Gyorsabb, csak a szükséges adatokat tölti be                      Lassabb, újraépíti az egész oldalt    
SEO hatás                   Minimális, csak a kliensoldalon történik                        Fontos, különösen állandó átírányitásnál
HTTP státuszkód             Nincs, böngészőben történik                                        301, 302, 307 stb.
Használati példák           SPA útvonalak közötti váltás                                      Hitelesítés, régi URL-ek frissítése


Navigate és a Redirect kombinálása!!!!!!!!!!!!!!!!!!!

1. A szerver eldönti, a kliens navigál
    - A szerver eldönti, hogy a felhasználót hova írányítsa, a front-end pedig navigate()-vel kezeli 
*/

const checkAuth = async ()=> {
    const response = await fetch("/api/check-auth");
    if(response.ok) {
        navigate("/dashboard");
    } else {
        navigate("/login");
    }
};

/*
    2. szerveroldali biztonsági háló 
        - Ha a kliensoldal nem kezeli az útvonalat, a szerver végzi el az átírányítást 
*/

/**********************************************************************************************************************************************/

/*
    Mi az a History API? 

    A History API a modern böngészők által biztosított eszköz, amely lehetővé teszi, hogy a JavaScript alkalmazások 
    manipulálják a böngésző előzménylistáját (history stack)
    Ez az API kulcsfontosságú a single-page application(SPA) fejlesztésében, mivel a segítségével az URL-eket dinamikusan módosíthatjuk 
        az oldal újratöktése nélkül

    Fő funkciók 
    1. Navigáció ellenőrzése: 
        - A history.back() és history.forward() használatával irányíthatjuk az előzméyneket 
        - A history.go(n) segítségével meghatározott számú navigálhatunk előre vagy vissza
    2. Új állapot hozzáadása az előzményekhez 
        A history.psuhState() segítségével új bejegyzést adhatunk hozzá a böngésző előzménylistájához 
    3. Állapot módosítása 
        A history.replaceState() segítségével lecserélhetjük az aktuális előzménybejegyzést

    History Stack: Hogyan müködik 
    A böngésző minden meglátogatott oldalról egy "stack"-et épít, amely az előzményeket tartalmazza 
    A History API lehetővé teszi, hogy ezeket az elemeket kliensoldalon manipuláljuk 
    Fontos, hogy ezek a müveletek nem érintik a szervert (nem küldhetnek új kérést) 

    Példa egy stack-re 
        - Látogató az alábbi oldalakra megy 
            1. example.com
            2. example.com/about
            3. example.com/contact

    A history stack így fog kinézni 
    [example.com, example.com/about, example.com/contact] 

    Ha a history.back()-et hívjuk meg, a böngésző visszatér a example.com/about oldalra 

    pushState és replaceState

    pushState()
    - Új bejegyzést hoz létre az előzménylistában anélkül, hogy a teljes oldal újratöltödne 
    - Szintaxis
        history.pushState(stateObj, title, url);
    -> 
    stateObj: Egy JavaScript objektum, amely az adott állapothoz kapcsolodó adatokat tartalmazza 
    title: Egy cím az új bejegyzéshez (általában üresen hagyják, mivel a legtöbb böngésző figyelmen kivül hagyja)
    url: Az új URL, amely az aktuális állapotot reprezentálja 

    Példa:
*/
history.pushState({ page: 1 }, "Page 1", "/page1");
console.log(window.location.href); //example.com/page1

/*
    A fenti kód az URL /page1-re változik, de nincs teljes oldal újratöltés
    Ez az új állapot bekerül a history stack-be 
*/

/*
    replaceState()
    - Lecseréli az aktuális előzménybejegyzést egy új állapotra, anélkül, hogy új bejegyzést hozna létre 
    - Szintaxis
        history.replaceState(stateObj, title, url); 

    Példa:
*/
history.replaceState({ page: 2 }, "Page 2", "/page2");
console.log(window.location.href); //example.com/page2
/*
    Ebben az esetben az aktuális előzménybejegyzés URL-je /page2 lesz, de nem ad hozzá új bejegyzést a stack-hez 
*/

/*
    pushState és replaceState különbsége 
                                    pushState                               replaceState
Új bejegyzés a stack-ben            Új bejegyzést hoz létre a stack-ben     Lecseréli az aktuális bejegyzést 
Oldal újratöltése                   Nem tölti újra az oldalt                Nem tölri újra az oldalt 
Mire használható                    Új állapot vagy URL hozzáadása          Az aktuális állapot frissítése 

    **********
    stateObj: Miért hasznos?
    - A stateObj lehetővé teszi, hogy a history stack elemeihez kapcsolodó adatokat tároljunk, amelyeket az alkalmazás késöbb elérhet 
    Ez különösen hasznos pl. 

    1. Alkalmazás állapotának tárolása 
    - Ha a felhasználó navigál az oldalon, megőrizhetjük az aktuális nézet állapotát 
    - Példa: 
        history.pushState({ scrollPosition: 200 }, "", "/page");

    2. Visszaállítás az állapotra 
        - A popstate esemény figyelésével az alkalmazás visszatérhet az adott állapothoz 

    Az események kezelése: popstate
    - A popstate esemény akkor aktiválodik, amikor a a felhasználó navigál az előzményekben (back, forward, go hívásokkal)
    - Példa: 
*/
window.addEventListener("popstate", (event)=> {
    console.log("State changed", event.state);
});
//Ez a kód naplozza a stateObj-t minden alkalommal, amikor a felhasználó navigál az előzményekben 

//Dinamikus URL kezelés SPA-ban 

const navigate = (url, state = {})=> {
    history.pushState(state, "", url);
    renderPage(url);
};

const renderPage = (url)=> {
    if(url === "/about") {
        document.body.textContent = "About Page";
    } else if(url = "/contact") {
        document.body.textContent = "Contact Page";
    } else {
        document.body.textContent = "Home page";
    }
};

navigate("/about", { section: "team" });

//visszanavigálás megőrzött állapotokkal: 
history.pushState({ scrollPosition: 300 }, "", "/products");

window.addEventListener("popstate", (event)=> {
    console.log("Elmentett pozíció: ", event.state.scrollPosition);
});

/*
    Mire érdemes figyelni
    1. SEO problémák 
        A History API változtatja az URL-t, de nem tölt be új HTML dokumentumot a szerverről 
        Meg kell győzödni, hogy a szerver megfelelően kezeli a mélylinkeket 
    2. popstate figyelése 
        A popstate esemény nem aktiválodik a pushState vagy replaceState hívások során, csak a valódi navigáció esetén (back vagy forward)
*/

/***************************************************************************************************************************************/
/*
    Mi az window objektum 

    A window objektum az alapértelmezett globális objektum a böngészőben. Ez az objektum a böngészőablakot és annak tartalmát 
    (pl. HTML dokumetumot, szkripteket, stílusokat) képvisel.
    Minden JavaScript kód automatikusan hozzáfér ehhez, és számos metódust, tulajdonságot, valamit eseményt biztosít 

    1. alert()
        - Egy egyszerű figyelmeztető párbeszédablakot jelenít meg 
        - Használat: ritkán használják modern fejlesztésben, mivel megszakítja a felhasználói élményt 
*/ 
window.alert("Üdvözlünk az oldalon!");

/*
    2. confirm()
        - Egy igaz/hamis választási lehetőséget kínáló párbeszédablakot nyit meg 
        - Használat: Felhasználói megerősítés kérésekor 
*/
if(window.confirm) {
    console.log("Törlés megerősítve");
} else {
    console.log("Törlés megszakítva");
}

/*
    3. prompt()
        - Egy párbeszédablakot jelenít meg, ahol a felhasználó adatot adhat meg 
        - Használat: Egyszerű input kérésekre (modern fejlesztésben ritkán ajánlott, inkább HTML formokat használunk)
*/
const name = window.prompt("Mi a neved?");
console.log("Név: ", name);

/*
    setTimeout()
        - Egy adott kódrészletet meghatározott idő elteltével futtat 
        - Használat: Késleltetett műveletek végrehajtására
*/ 

setTimeout(()=> {
    console.log("Ez 3 ms késöbb jelenik meg!");
}, 3000);   

/*
    setInterval()
        - Egy kódrészletet meghatározott időközönként ismételten futtat 
        - Használat: Időzítők, rendszeresen ismétlödő események (pl. óra kijelzése) 
*/
const intervalId = setInterval(()=> {
    console.log("Ez minden ms-ben megjelenik");
}, 1000);

setTimeout(()=> clearInterval(intervalId), 5000); //ez 5 ms múlva leállítja clearInterval!!!!!

/*

*/
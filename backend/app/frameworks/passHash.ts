import crypto from "crypto";

function passHash(str, algo = "sha512") {
    return crypto.createHash(algo).update(str).digest("hex");
} 

export default passHash;

/*
1. Függvény definiálása 
    function passHash(str, algo = "sha512") {

    Paraméterek 
        str: A szöveg vagy jelszó, amit hash-elni szeretnénk 
        algo: A használni kívánt hash algoritmus neve. Alapértelmezett érték: sha512
            Példa hash algoritmusokra: md5, sha256, sha512

2. Hash létrrehozása 
    return crypto.createHash(algo).update(str).disgest('hex');

    crypto.createHash(algo)
        - Létrehoz egy hash objektumot a megadott algoritmussal (pl. sha512)

    update(str)
        - A hash beírja (frissíti) a megadott szöveget, amit hash-elni szeretnénk 

    .digest('hex')
        - A hash eredményt hexadecimális (16-os számrendszerbeli) formátumot adja vissza 
            - Ez a formátum könnyen olvasható és kezelhető (0-9, a-f)


3. Visszatérési érték 
    A függvény visszatérési értéke a hash-elt szöveg hexadecimális formátuma 
    pl. 
    passHash("jelszo123") -> debeaf472c28a...


    Összefoglalás 

    1. A hash objektum létrehozása a választott algoritmussal (pl. sha512)
    2. Adatok frissítése: A megadott szöveg bekerül a hash-be 
    3. Hexadecimális formátumú eredmény visszaadása 
*/

const hashedPassword = passHash("jelszo123");
console.log(hashedPassword);
//1d1a9e67c81....
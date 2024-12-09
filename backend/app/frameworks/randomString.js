import crypto from "crypto";

function randomString(length) {
    const bytes = Math.ceil(length * 3 / 4);
    const randomBytes = crypto.randomBytes(bytes);
    const randomString = randomBytes.toString('base64')
    .replace(/\+/g, '0')
    .replace(/\//g, '0')
    .replace(/=\+\$/, '')

    return randomString.slice(0, length);
}

export default randomString;

/*
1. Importálás 
    import crypto from "crypto";

    A Node.js beépített crypto modulját importáljuk, amely biztonságosan véletlenszerűen byte-ok generálására használható 
        (és egyébb kriptográfiai funlciókra)

2. Függvény definiálása 
    function randomString(length) {

    Létrehozunk egy randomString nevű függvényt, amely egy paramétert vár: 
        length: Ez határozza meg a generált véletlenszerű string kívánt hosszát 

3. Számítás a byte-ok számára 
    const bytes = Math.ceil(length * 3 / 4);
    
    A Base 64 karakterlánc generálásához a byte-ok számát a következő képlettel számítjuk ki: 
    - Egy Base64 karakter 6 bitet képvisel, tehát 3 byte (24 bit) 4 karaktert eredményez 
    - Ezért szükséges byte-ok száma: length * 3 / 4 
    - Math.ceil: Felkerekíti az eredményt a következő egész számra, hogy biztosítsa elegendő byte legyen a kívánt hosszúság eléréséhez 

4. Véletlenszerű byte-ok generálása 
    const randomBytes = crypto.radnomBytes(bytes);

    - Crypto.randomBytes(bytes): Generál egy biztonságos véletlenszerű byte tömböt, amelynek mérete az előző lépésben számított bytes 

5. Base64 string létrehozása 
    const randomString = randomBytes.toString('base64')

    A generált byte-tömböt átalakítjuk egy Base64 kódolású karakterláncra 

    Base64: Egy kódolási szabvány, amely 64 karakterből áll (a-z, A-Z, 0-9, +, /)

6. Karakterek helytesítése 
    .replace(/\+/g, '0')
    .replace(/\//g, '0')
    .replace(/=\+\$/, '')

    A replace(/\+/g, '0') - A + karaktereket cseréli 0-ra (biztonsági vagy esztétikai okokból)
    .replace(/\//g, '0') - A / karaktereket szintén 0-ra cseréli 
    .replace(/=\+\$/, '') - Eltávolítja a egyenlőségjelet, amely a Base64 karakerlánc végén töltelékként jelenhet meg


Ez nagyon fontos!!!! 

7. String levágása a kivánt hosszra 
    
    return randomString.slice(0, length);

    A véletlenszerű Base64 karakterlácot levágja az eredeti, felhasználó által kért hosszra (length)

    slice(0, length): A karakterlánc első length hosszúságú részét adja vissza 

8. Exportálás 

    export default randomString;

    A függvényt exportáljuk, hogy más fájlokban is használható legyen 
*************

    Összefoglalás 
    1. Kiszámítja, hogy hány byte szükséges a kivánt hosszúságú Base64 string létrehozásához -> const bytes = Math.ceil(length * 3 / 4);
    2. Generál biztonságos véletlenszerű byte-okat a crypto modul segítségével -> const randomBytes = crypto.randomBytes(bytes);
    3. Átalakítja a byte-okat Base64 formátumú string-gé -> const randomString = randomBytes.toString('base64')
    4. Tisztítja a Base64 string-et 
        - lecseréli a nem kívánt karaktereket (+, /)
        - eltávolítja a végén az egyenlőségjelet (=)
            .replace(/\+/g, '0')
            .replace(/\//g, '0')
            .replace(/=+$/, '');
    5. Levágja a string-et a megadott hosszra és visszaadja -> return randomString.slice(0, length);


*/
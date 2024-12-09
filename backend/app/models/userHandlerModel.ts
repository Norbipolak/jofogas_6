/*
    Fenntartja az adatbázis kapcsolatot 
*/

import { HTTPResponse, User } from "./types.js";
import catchFunc from "../frameworks/catchFunc.js";
import trim from "../frameworks/trim.js";
/*
    Azért jó, hogy csináltunk egy típust, type-ot a types.js-en, amit ide behívunk
    mert azt tudjuk mondani, hogy amit vár a register user-t az egy User típus lesz!!! 
    ->
    public async register(user:User)***
*/
import { ResultSetHeader } from "mysql2";
import Model from "../frameworks/Model.js";
import passHash from "../frameworks/passHash.js";
import randomString from "../frameworks/randomString.js";
import EmailSender from "../frameworks/emailSender.js";



class userHandlerModel extends Model {

    constructor() {
        super("users", ["email", "pass"]);
    }

    //     public async register(user:User):Promise<HTTPResponse>|never {
    //         try {
    //             trim(user);
    //             this.checkNonFriendlyFields(user);

    //             const response = await this.insert(user).execute() as ResultSetHeader;

    //             if(response.affectedRows === 1) {
    //                 return {
    //                     status: 201, //created
    //                     message: `Sikeresen regisztráltál. Nézd meg a következő email címedet ${user.email}`
    //                     /*
    //                         Az a kérdés, hogy szükséges-e, hogy visszaadjuk a userID(insertId), mert az HTTPResponse-ban 
    //                         type HTTPResponse = {
    //                             status:number,
    //                             message:string,
    //                             insertID?:number
    //                         De nem kell, mert nem tudjuk mire a továbbiakban használni a userID-t(insertId)                          
    //                     */
    //                 }
    //             }  else {
    //                     throw {
    //                         status:503, 
    //                         message: `A szolgáltatás ideiglenesen nem érhető el`
    //                     }   
    //             }

    //         } catch (err:any) {
    //             catchFunc(err, "UserHandler", "register");
    //         }
    //     }

    //     public async activeRegistration(activationString:string, userID:number) {
    //         try {
    //             const asHash:string = passHash(activationString);

    //             const response = await this.update({activated:1}).where("userID", "=", userID).and("activationString", "=", asHash).execute();

    //             if(response.affectedRows === 1) {
    //                 return {
    //                     status:200,
    //                     message: "Sikeres aktiválás"
    //                 }
    //             } else {
    //                 throw {
    //                     status: 401, 
    //                     message: "A rendszer nem tudott azonosítani!"
    //                 }
    //             }
    //         } catch(err) {
    //             catchFunc(err, "UserHandler", "activateRegistration");
    //         }
    //     } 

    //     /*
    //         Regisztráció megerősítését végzi egy megadott aktiválási kód alapján (actiovationString) és a felhasználói azonosító alapján (userID) alapján 

    //         1. Paraméterek fogadása 
    //             - activationString: Ez az a kód, amit a felhasználó email-ben kap, hogy igazolja a regisztrációját 
    //             - userID: A felhasználó egyedi azanósítója a rendszerben 

    //         2. try - catch blokk 
    //             - A függvény megpróbálja végrehajtani a regisztráció aktiválását. Ha valami hiba történik, a catch blokk kezeli a hibát 
    //                 fontos, hogy ez egy Update, mert azt akarjuk, hogy activated mező legyen 1 és annál a felhasználónál, akinek a
    //                 userID meg a actiovationString az valami (activationString-et) hash-elni kell, mert úgy van bent az adatbázisban! 

    //         3. asHash generásálása
    //             - Az aktiválási kódot (activationString) egy hash algoritmussal (passHash) titkosítják, hogy biztonságosan lehessen tárolni 
    //             és összehasonlítani az adatbázisban levő értékkel 

    //         4. Adatbázis frissítése 
    //             - A this.update({activated:1}) beállítja, hogy az adott felhasználó (userID) activated mezője 1 legyen (aktivvá válik) 
    //             - a .where és .and metódusok biztosítják, hogy a megfelelő rekordot frissítsük, ahol 
    //                 1. A userID megegyezik a paraméterben kapott értékkel 
    //                 2. az activationString (titkosított változata, asHash) is megegyezik az adatbázisban tárolt értékkel 

    //         5. Válasz ellenőrzése 
    //             - Ha a response.affectedRows értéke 1, az azt jelenti, hogy pontosan egy reordot frissítettünk, tehát a regisztráció aktiválása 
    //             sikeres. Ebben az esetben egy sikeres válaszobjektumot (status: 200, message: "") küld vissza 
    //             - Ha frissítés nem történt meg, egy hibát dobunk, ami tartalmazza: 
    //                 status: 401 -> ez azt jelenti, hogy a hitelesítés sikertelen 
    //                 message: "A rendszer nem tudott azonosítani!" 

    //         6. Hiba kezelése 
    //             Ha bármilyen hiba történik a try blokkban, a catch blokk meghívja a catchFunc függvényt, ami logolja a hibát 

    //         Ha a felhasználó egy aktiváló linkre kattint, az URL tartalmazza az aktiválási kódot. A szerver ezzel a függvénnyel ellenőrzi, hogy 
    //         hogy a kód helyes-e és aktiválja a regisztrációt ha minden okés 
    //     */

    //     public async login() {

    //     }

    //     //hogyan tudunk kétfaktoros autentikációt csinálni 
    //     public async twoFactor() {

    //     }
    // }

    // export default userHandlerModel;

    async register(user) {
        try {
            trim(user);
            this.checkNonFriendlyFields(user);
            await this.beginTransaction();
            const actiovationÍString = randomString(10);
            user.actiovationString = passHash(actiovationÍString);
            user.pass = passHash(user.pass);

            const response = await this.insert(user).execute();

            if (response.affectedRows === 0) {
                throw {
                    status: 503,
                    message: `A szolgáltatás ideiglenesen nem érhető el!`
                };
            }

            const userID = parseInt(response.insertId);
            const html = `
            <h1>Kedves Felhasználó!</h1>
            Sikeresen regisztráltál a Jófogás koppintás oldalunkra. A registráció hitelesítéséhez kérlek kattints 
            az alábbi linkre: <br>
            <a href="${process.env.CLIENT_URL}/activate-registration/${activationString}/${userID}">
                Kattints ide!
            </a>
        `;

            const mailOptions = {
                from: "kovacs.oliver1989@gmail.com",
                to: user.email,
                subject: "Registráció a jófogás koppintás oldalra",
                html: html
            }

            const success = await this.emailSender.sendMail(mailOptions);
            await this.commit();
            if (!success) {
                await this.delete().where("userID", "=", userID).execute();
                throw {
                    status: 503,
                    message: `Nem sikerült elküldeni az aktivációs emialt. Kérlek probálkozz késöbb!`
                };
            }
            return {
                status: 201,
                message: `Sikeresen regisztráltál. Nézd meg a következő email címedet: ${user.email}`
            };
        } catch (err) {
            this.rollBack();
            catchFunc(err, "usrHandler", "register");
        }
    }
}

/*
    1. A függvény célja
    - Fogad egy user objektumot, amely tartalmazza a regisztrációhoz szükséges adatokat (pl. jelszó, email)
    - Elvégzi a szükséges adatellenőrzést 
    - A felhasználó adatait elmenti az adatbázisba
    - Generál egy aktivációs linket és elküldi emial-ben 
    - Kezeli az esetleges hibákat, mint pl. adatbázishbák, vagy email küldési problémák 

    2. A kód mükődése lépésről lépésre 
    - Adatok Ellenőrzése 
        trim(user): Eltávolítja a felesleges szóközöket a user objektum szöveges mezőiből 

        function trim(obj:Record<string, any>):Record<string, any> {
            for(const key in obj) {
                if(typeof obj[key] === "string")
                    obj[key] = obj[key].trim();   
            }

            return obj;
        }

        - this.checkNonFriendlyFields(user): Ellenőrzi, hogy a felhasználó adatai nem tartalmaznak érévnytelen vagy veszélyes adatokat 
            (pl. SQL injekció) 

    -Tranzakció indítása 
        await this.beginTransaction(): Tranzakciót indít az adatbázisban, hogy biztosítsa, minden müvelet sikeres legyen, vagy minden 
        visszavonásra kerüljön hiba esetén 
        
    - Aktivációs string és jelszó titkosítása 
        const activationString = randomString(10);
        user.activationString = pasHash(activationString);
        user.pass = passHash(user.pass);

        randomString(10): Egy 10 karakter hosszú véletlen aktivációs stringet generál 
        passHash: Az aktivációs string-et és a felhasználó jelszavát titkosítja, mielőtt ez bekerül az adatbázisba!!!!! 
        
    - Felhasználó adatainak beszúrása az adatbázisba!!! 
        const response = await this.insert(user).execute();
        if(response.affectedRows === 0) {
            throw {
                status: 503, 
                message: `A szolgáltatás ideiglenesen nem elérhető!`
            }
        }
        Az adatbázisba beszúrja a felhasználó adatait
        Ellenőrzi, hogy a beszúrás sikeres volt (affectedRows nem 0) 

    - Aktivációs email létrehozása 
        const userID = parseInt(response.insertId);
        const html = `
            <h1>Kedves Felhasználó!</h1>
            Sikeresen regisztráltál a Jófogás koppintás oldalunkra. A registráció hitelesítéséhez kérlek kattints 
            az alábbi linkre: <br>
            <a href="${process.env.CLIENT_URL}/activate-registration/${activationString}/${userID}">
                Kattints ide!
            </a>
        `;

        const mailOpions = {
            from: "kovacs.oliver1989@gmail.com", 
            to: user.email,
            subject: "Regisztrációs a jófogás koppintás oldalra",
            html: hmtl
        }

        Az aktivációs email HTML tartalmát dinamikusan összeállítja, beleértve az aktivációs linket, amely tartalmazza 
            - véletlenszerűen generált aktivációs string-et
            - a felhasználó egyedi ID-jét (userID)

        const success = await this.emailSender.sendMail(mailOptions);

        Email-t küld a felhasználónak a sendMail metódussal 

    - Email küldés sikereségének az ellenőrzése 

        if(!success) {
            await this.delete().where("userId", "=", userID).execute();
            throw {
                status: 503, 
                message: `Nem sikerült elküldeni az aktivációs emailt. Kérlek próblkozz meg újra`
            }
        }
        
        Ha az email küldés sikertelen, törli a felhasználót az adatbázisból, majd hibát dob!!! 

    - Tranzakció lezárása 
        
        await this.commit()
        Ha minden müvelet sikeres, a tranzakciót véglegesíti az adatbázisban 

    - Sikeres regisztráció visszajelzése 

        return {
            status: 201, 
            message: `Sikeresen regisztráltál. Nézd meg a következő email címedet ${user.email}`
        }
    Return-öl a sikeres regisztrációról szóló üzenettel

    - Hibakezelés 
        catch (err) {
            this.rollBack();
            catchFunc(err, "userHandler", "register")
        }

        Ha hiba történik a tranzakció visszavonásra kerül (rollBack)
        A hibát egy catchFunc függvény kezeli, amely naplózza az eseményt 
    




*/
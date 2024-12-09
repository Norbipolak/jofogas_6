/*
    Ezek fogják elkészíteni az endpoint-okat és ellenőrzik a bejővő adatok helyeségét 

    Ennek lesz egy model párja, a model pedig fenntartja az adatbáziskapcsolatot  
*/
import Controller from "../frameworks/Controller.js";
import { Request, Response } from "express";
import { User, HTTPResponse } from "../models/types.js";
import userHandlerModel from "../models/userHandlerModel.js";

class userHandlerController extends Controller {
    private model:userHandlerModel

    constructor() {
        super();
        this.model = new userHandlerModel();
        this.http.post("/register", this.register).bind(this);
    }

    public async register(req:Request, res:Response) {
        /*
            Ugyanaz a neve, mint a UserHandlerModel-ben, hogy register 

            Vár egy req-et meg egy res-t -> req:Request, res:Response és be kell hívni a express-ből ezeket -> import { Request, Response } from "express";
        */
        try {
            const errors:string[] = [];
            const user:User = req.body as User;
            /*
                Elmentjük az adatokat, amiket megkapunk a body-ből 
                És innentől kezdve kell leellőrizni ennek a user-nek az adatait 
                email-vel és jelszóval lehet regisztrálni, tehét a user-nek van egy email-je meg egy jelszava
                és megnézzük, hogy ezek megfelelően vannak megadva, mármint a value(értékei) amit beírt a felhasználó pl. emailRegex szerint
            */

            /*
                De csak az email meg pass kell majd és nem is fog más bemenni, mert csak azt a kettőt kell megadni regisztrációnál 
                Tehát más a adatbázisba nem fog bemenni, mert ahol a profilt szerkezti az majd csak a Profile lesz és ott tudja megadni
                hogy firstName meg lastName 
                ezért a UserHandlerModel-ben csak az email-t meg a pass-t engedélyezzük 
                -> 
                class userHandlerModel extends Model {
                    constructor() {
                        super("users", ["email", "pass"]);
                mondjuk nagy kárt nem tudna okozni ha beírná a firstName-t meg lastName-t de itt csak ezek lesznek 
            */
            let err = this.validator.setValue("email cím", user.email).required(true).isEmail().execute();
            /*
                Ezzel az execute-val visszakapjuk (ami a Validator-ban van) return err; visszakapjuk a hibákat, hogyha voltak 
                ha pl. nem email formátumú a user.email 
                meg az is fontos amellett, hogy email formátumot megnézzük, hogy required legyen, mert mindenképp ki kell tölteni
                ->
                let err = this.validator.setValue("email", user.email).required()****.isEmail().execute();

                Létrehozunk felülre egy ilyet -> const errors:string[] = []
                És hogyha az err.length nagyobb mint nulla, tehát volt valami hiba 
                    akkor az itteni errors-ba belerakjuk az err-t, de így ...err, egyesével, ha volt több hiba is 
                -> 
                    if(err.length > 0) 
                        errors.push(...err);
            */
            if(err.length > 0) 
                errors.push(...err);

            /*
                És akkor ugyanezt a folyamatot megcsináljuk a jelszóra is 
            */
            err = this.validator.setValue("jelszó", user.pass).required(true).minLength(8).execute();

            if(err.length > 0) 
                errors.push(...err);

            /*
                És most megnézzük, hogy az itteni errors-ban van-e valami, amibe beletettük validate-vel ha volt valami hiba
            */
            if(errors.length > 0) {
                throw {
                    status:400,
                    messages:errors
                }
            }

            /*
                Mert a Validator execute-ban ott meg van adva, hogy mit írjon ki, hogyha olyat írunk be aminek kevesebb, mint 8 karakteres
                    ott van egy habaüzenet, amit push-olunk egy tömbbe, amit return-ölünk és ha itt meg van hívva ez 
                    -> 
                    err = this.validator.setValue("jelszó", user.pass).required().minLength(8).execute();
                Akkor ebben lesznek azok a hibák, amiket a Validatorban dobtunk!!! 
            */

            /*
                Itt majd be kell hívni a userHandlerModel-t 
                ->
                    private model:userHandlerModel*****

                    constructor() {
                        super();
                        this.model = new userHandlerModel();****

                A userHandlerModel-ben (ami majd csak a user táblára fog készülni )lesz egy register
                Ahol elöször megnézzük, hogy nincsen-e nonFriendlyFields
                majd -> const response = await this.insert(user).execute() as ResultSetHeader;
                    ez egy ResultSetHeader-t ad majd vissza és ott meg tudjuk nézni ha minden sikerült, akkor affectedRows === 1 
                    és küldünk egy status meg egy message-t ha meg nem akkor is küldünk egy status-t meg egy messege-t meg a catch ág 

                Tehát ott meg meg van minden, itt meg meghívjuk a register-t, ami vár egy user-t 
                -> 
                const response:HTTPResponse = await this.model.register(user);

            */
            
            const response:HTTPResponse = await this.model.register(user);

            res.status(response.status).send(JSON.stringify(response.message));
            /*
                response-ban ahol meghívtuk a model-neka register-jét, ott visszakaptunk ha sikerült a müvelet egy status 200-t meg egy 
                message-t 
                és ha megkaptuk az adatokat, akkor csak a send-vel kiírjuk ezt a message-t egy (JSON.stringify) tehát JSON string-ként!!!  
            */

        } catch(err:any) {
            res.status(err.status).send(err.message);
            /*
                itt meg elkapjuk, ha ott nem sikerült valami és ugyanígy van egy status, mondjuk 403, amit mi dobtunk meg egy message
                mert az ugye ott a catch ágban tovább van dobva és azt itt elkapjuk!!! 

                Tehát a userHandlerModel-nél van ez a catchFunc és itt továbbítjuk
                ->
                function catchFunc(err:any, cls:string, method:string):never {
                    console.log(`${cls}.${method}`, err**);

                    if(err.status) 
                        throw err;

                    throw {
                        status: 503,
                        message: "A szolgáltatás ideiglenes nem elérhető"
                    };

                Ezzel meg van az endpoint-unk és kérdés, hogy ez, honnan kapja a req-et meg a res-ot 
                -> 
                ezt meghívjuk a constructor-ben 
                this.http.post("/register", this.register)
                    de ha itt megadjuk a this.register-t, akkor a http-nak a dolgait fogja látni, ezért kell a bind 
                    hogy megmaradjon ebben az osztályban 
                this.http.post("/register", this.register).**bind(this);
                ***
                .bind(this) a JavaScriptben arra szolgál, hogy a this kontextust (vagyis a this-re való hivatkozást)
                hozzákösse ahhoz az objektumhóz, amelyen éppen vagyunk/dolgozunk 
                
                itt a this.http.post("/register", this.register).bind(this) sor:
                1. Elöször meghívja a post metódust, amely a this.http objektumon található, és két paramétert kap 
                    - az url-t ("/register") és a this.register függvényt 
                2. a bind(this) metódus használatával biztosítjuk, hogy a this kulcsszó a register függvényben az aktuális objektumra 
                mutasson és ne változzon meg attól függően, hogy hol vagy hogyan hívják meg a függvényt 

                Ez hasznos, ha a függvényt késöbb valamilyen aszinkron kontextusban, pl. egy API hívás vagy eseménykezelő részeként hívjuk meg 
                mivel ilyen esetekben a this kontextus gyakran másik objektumra mutatna 
                ****
                public async post(path:string, cb(req:Request, res:Response) => void) {
                    this.app.post(path, cb);
    
                És el is készítettük az endpoint-ot, de egyetlen egy probléma van itt, hogy egy ilyen endpoint-nak ugyanaz a route-ja 
                mint a React-nek a route-ja, mondjuk jelen esetben a register (tehát ez nem lehet ugyanaz) 

                Tehát mindenhol, ahol ezeket elkészítjük a HTTP-én, azt kell beírni, hogy /api 

                public async get(path:string, cb:(req: Request, res: Response) => void) {
                    this.app.get("/api" + path,cb);
                és ugyanígy a post, path, put, delete-nél os hozzá kell adni ezt a "/api"-t 
                Minden endpoint-ot, ami a backend-hez köthető, úgy fogjuk megszólítani, hogy /api!!!!
                    és akkor biztos, hogy nem lesznek ilyen route ütközések 

                Befejezzük a Validator-t mert ott csak a notRequired meg a maxLength van meg!!!  

            */ 
        }
    }
}

export default userHandlerController;
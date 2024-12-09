/*
    Ez egy specifikus adatbázis táblához fog csatlakozni 

    Ezért lesz egy table változója -> private table:string;

    És a constructor-ban be lehet állítani, hogy melyik táblához csatlakozzon
    pl. jelen esetben azt akarjuk, hogy a users táblához majd
    ->
    constructor(table:string) {
        this.table = table;
    }
*/
import SqlQueryBuilder from "./SqlQueryBuilder.js";
import { joinTypes } from "../models/types.js";
import { ResultSetHeader } from "mysql2";

class Model {
    private table:string;
    private qb:SqlQueryBuilder;
    private friendlyFields:string[];

    constructor(table:string, friendlyFields:string[]) {
        this.table = table;
        this.qb = new SqlQueryBuilder();
        this.friendlyFields = friendlyFields;
    }

    public select(fields:string[]):Model{
        this.qb.select(this.table, fields);
        return this;
    }

    public async beginTransaction():Promise<void> {
        await this.qb.beginTransaction();
    }

    public async commit():Promise<void> {
        await this.qb.commit();
    }

    public async rollBack():Promise<void> {
        await this.qb.rollBack();
    }

    public where(field:string, operation:string, value:string):Model {
        this.qb.where(field, operation, value);
        return this;
    }

    public and(field:string, operation:string, value:string):Model {
        this.qb.and(field, operation, value);
        return this;
    }

    /*
        Amik vannak a SqlQueryBuilder-ben az összeset itt emeg kell hívni és akkor erre a bizonyos table-re fog vonatkozni 
        de mivel itt a like/and/where nem kell meghatározni, hogy pontosan melyik table-nél használjuk, 
        ezért itt csak meghívjuk egy ugyanolyan nevű függvényben és ugyanúgy át kell majd adni azokat a dolgokat, amit az SqlQueryBuilder-en kér 
        
        SqlQueryBuilder  
        -> 
        public where(field:string, operation:string, value:any):_sqlQueryBuilder {
            this._sql += `WHERE ${field} ${operation} ? `;l 
            this.values.push(value);
            return this;

        és az itteni where
        -> 
        public where(field:string, operation:string, value:string):Model {
            this.qb.where(field, operation, value);
            return this;

        csak meghívjuk az ottani where-t (this.qb.where) és átadjuk neki ugyanazokat a dolgokat 
        field, operation, value 

        ahol válozás történt az pl. a select, mert itt ebben a class-ban van egy olyan változó, hogy table és majd ezt adjuk meg neki 
        de ezt viszont itt nem kérjük be!! 
        SqlQueryBuilder
        public select(table:string, fields:string[]):_sqlQueryBuilder 
            this._sql += `SELECT ${fields.join(", ")} FROM ${table}} `;
            return this;
        
        itteni 
        public select(fields:string[]):Model{
            this.qb.select(this.table, fields);
            return this;
        }

    */

    public like(field:string, operation:string, value:string):Model {
        this.qb.like(field, operation, value);
        return this;
    }

    public or(field:string, operation:string, value:string):Model {
        this.qb.or(field, operation, value);
        return this;
    }

    public in(field:string, values:any[], andOrWhere:string):Model {
        this.qb.in(field, values, andOrWhere);
        return this;
    }

    public between(field:string, values:[any,any], andOrWhere:string):Model {
        //values:[any,any] fontos, hogy itt egy tuple-ös megoldás van, vár egy tömböt amiben pontosan kettő any érték lehet majd 
        this.qb.between(field, values, andOrWhere);
        return this;
    }

    public join(joinType:joinTypes, table:string, fields:[string, string]):Model {
        this.qb.join(joinType, table, fields);
        return this;
    }

    public innerJoin(table:string, fields:[string, string]):Model {
        this.qb.innerJoin(table, fields);
        return this;
    }

    public leftJoin(table:string, fields:[string, string]):Model {
        this.qb.leftJoin(table, fields);
        return this;
    }

    public rightJoin(table:string, fields:[string, string]):Model {
        this.qb.rightJoin(table, fields);
        return this;
    }

    public callProcedure(name:string, values:any[]):Model {
        this.qb.callProcedure(name, values);
        return this;
    }

    /*
        Insert-nél hasonlóna, mint a Select-nél nem kérjük be a table-t, hanem átadjuk neki a this.table-t 
    */
    public insert(fieldsValues:Record<string, any>):Model {
        //már tudjuk a table-t és a fieldsValues, ami itt szükséges 
        this.qb.insert(this.table, fieldsValues);
        return this;
    }

    public update(fieldsValues:Record<string, any>):Model {
        this.qb.update(this.table, fieldsValues);
        return this;
    }

    /*
        Fontos, hogy itt nem adunk vissza Model-t meg return.this sincs!!! 
    */

    public exists(subQuery:SqlQueryBuilder, andOrWhere:string) {
        this.qb.exists(subQuery, andOrWhere);
    }

    public any(subQuery:SqlQueryBuilder, andOrWhere:string) {
        this.qb.any(subQuery, andOrWhere);
    }

    public subQuery(subQuery:SqlQueryBuilder, andOrWhere:string) {
        this.qb.subQuery(subQuery, andOrWhere);
    }

    public async execute():Promise<ResultSetHeader|Record<string, any>[]> { //fontos, hogy ennek async-nek kell lennie!! 
        //ez nem vár paramétert, csak meghívja a this.qb.execute-ot 
        const response = this.qb.execute();
        return response;
    }

    public async checkNonFriendlyFields(obj:Record<string, any>[]) {
        /*
            Ehhez majd kell egy private friendlyFields-es változó 
            ->
            class Model {
                private table:string;
                private qb:SqlQueryBuilder;
                private friendlyFields:string[]; *****

                constructor(table:string, friendlyFields:string[]****) {
                    this.table = table;
                    this.qb = new SqlQueryBuilder();
                    this.friendlyFields = friendlyFields;****

            Ez a nonFriendlyFields ez kér tölünk egy objektumot -> obj:Record<string, any>[]
        */
        const nonFriendly:string[] = [];
        /*
            és ebbe belerakjuk a field-eket, pl. ha megnézzük a types-okat, akkor van egy ilyenünk, hogy User
            -> 
            type User = {
                userID?:number,  
                isAdmin:number,
                email:string,
                pass:string...
            Amik itt vannak benne azok lesznek nekünk a friendlyFields-ek!!! 

            És ha egy olyan objektumot kapunk, amiben létezik egy field, ami a User típusban nincs, akkor azt bele kell rakni ebbe 
            a const nonFriendly:string[] = []

            De ehhez végig kell menni a obj-en, amit itt bekér ez a függvény (a kulcsain)
            -> 

        */ 
        const keys:string[] = Object.keys(obj); 
        /*
            Az Object.keys(obj)-vel szerezzük meg legkönnyebben egy objektumnak a kulcsait, amit majd ebbe a keys-ben tárolunk, tehát ez egy tömb 
            lesz string-ekkel (kulcsokkal) 
            és akkor nekünk ezen kell végigmenni egy for-val és megnézni, hogy ugyanaz-e ami frindlyFields-ben, ha nem akkor meg berakjuk 
            a const nonFriendly:string[] = []
        */

        for(const key of keys) {
            /*
                Ha friendlyFields nem tartalmazza azt a key-t amin jelenleg van a for
                ->
                if(!this.friendlyFields.includes(key)) -> itt nagyon fontos az includes, mert akkor megnézni, hogy a friendlyFields tömbben
                meg van-e az adott key és mivel végigmegyünk az összes key-en, ezért megnézzük egyesével az összeset 

                Tehát ha nem tartalmazza, akkor meg azt a key-t belerakjuk a nonFriendly-be
                -> 
                nonFriendly.push(key);

                Megnézzük, hogy van-e valami a nonFriendly-ben (length-je nem nagyobb mint 0) 
                Ha igen akkor throw és egy ilyet, hogy nem ismeri fel.. ${nonFriendly.join(", ")
                    behelyetesítjük a nonFriendly-t és mivel ez egy tömb join-olni kell és kiírjuk egy karakterláncban, hogy melyik mező 
            */
            if(!this.friendlyFields.includes(key)) {
                nonFriendly.push(key);
            }

            if(nonFriendly.length > 0)
                throw `A következő adatokat nem ismeri fel a rendszer ${nonFriendly.join(", ")}`;
        }
    }

    /*
        Átmegyünk a userhandlerModel-re 
    */





}

export default Model;

/*


*/
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
key:any;
  constructor(private sqlite: SQLite ) {
    console.log('Hello DatabaseProvider Provider');
  }
  database: SQLiteObject;
  addKey(frind,key): Promise<void> {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS keys(rowid INTEGER PRIMARY KEY AUTOINCREMENT, friendid TEXT UNIQUE, key TEXT)')
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(e));
    })
      return this.database.executeSql('INSERT INTO keys (friendid,key) VALUES(?,?)',[frind,key])
      .catch(e => console.log(e));
  }
   readKeys(){
    return this.database.executeSql("SELECT * FROM keys", []).then((data) => {
      let keys = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          keys.push({ friendid: data.rows.item(i).friendid, key: data.rows.item(i).key});
        }
      }
      return keys;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
   }
   getCurrentKey(friendid):Promise<void> {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM keys WHERE friendid=?', [friendid])
      
        .then(res => {

          if(res.rows.length > 0) {
            this.key=res.key;
          }
        })
        .catch(e => {
          console.log(e);
        });
    }).catch(e => {
      console.log(e);
    });
    return this.key;
    if(this.key==null){
      return null;
    }
  }

}

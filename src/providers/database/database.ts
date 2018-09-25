import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
  keys: any;
  key: any;
  constructor(private sqlite: SQLite) {
    console.log('Hello DatabaseProvider Provider');
  }
  database: SQLiteObject;
  addKey(frind, key) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS keys(rowid INTEGER PRIMARY KEY ,userId TEXT, friendid TEXT UNIQUE, key TEXT)').then(() => {
        db.executeSql(`INSERT INTO keys (friendid,key) VALUES(${frind},${key})`)
      })
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
    })
      .catch(e => console.log(e));
  }
  readKeys(): Promise<void> {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS keys(rowid INTEGER PRIMARY KEY ,userId TEXT , friendid TEXT UNIQUE, key TEXT)')
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
      db.executeSql('"SELECT * FROM keys", []')
        .then(data => {
          this.keys = [];
          for (var i = 0; i < data.rows.length; i++) {
            this.keys.push({ friendid: data.rows.item(i).friendid, key: data.rows.item(i).key });
          }
        })
    })
    return this.keys;
  }


}

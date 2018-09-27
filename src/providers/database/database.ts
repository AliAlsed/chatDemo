import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
  constructor(public storage: Storage) {
  }
  addKey(frind, key):Promise<void> {
    return this.storage.set(frind, key);
  }
  readKeys(s) {
    return this.storage.get(s);
  }


}

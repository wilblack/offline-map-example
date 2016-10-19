import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';

declare var sqlitePlugin: any;
declare var plugins: any;

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = TabsPage;
  mbtilePath: string;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      if (window.sqlitePlugin) {

        this.mbtilePath = 'newport_z14.mbtiles';
        console.log("[App contructor()] Trying to copy mbtiles from ", this.mbtilePath);
        plugins.sqlDB.copy(this.mbtilePath, 0, (res) => {
          console.log("[App()] Successfully copied database", res);

          this.testDb();
        }, (error) => {
          console.log("[App()] Error copying database", error);
          if (error.code === 516) {
            //dbconn = window.sqlitePlugin.openDatabase({ name: this.mbtilePath, location: 'default', createFromLocation: 1 });
            this.testDb();
          }
        });
      }

    }); // end platform.ready
  }

  testDb() {
    console.log("[App.testDb()]*** Test database ***");
    let obj = this;
    window.sqlitePlugin.openDatabase({ name: this.mbtilePath, location: "default", createFromLocation: 1, androidDatabaseImplementation: 2 },
      function(conn) {
        console.log("[App.testDb()] successfully opened DB, trying to get tables ");
        conn.transaction((tx) => {
          tx.executeSql("SELECT * FROM sqlite_master", [], (tx, res) => {
            console.log("[App.testDb()] Got tables:", res.rows);
            let out = JSON.stringify(res.rows.item(0));
            console.log(out);
          }, (tx, res) => {
            console.log("[App.testDb()] Failed to get tables.", res.toString);
          })
        }, (res) => {
          console.log("[App.testDb()] Transaction failed:");
          console.log(res.toString());
        }) // end transaction
      }, (res) => {
        console.log("[App.testDb()] FAIL failed to open db", res.toString())
      }); // end openDatabase()
  }
}

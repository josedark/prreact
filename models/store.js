'use strict';

const moment = require('moment');

const {
  BadRequestError,
  InvalidModelArgumentsError,
  NoRecordFoundError,
} = require('../exceptions');

function Store(code, name, description, logo, countryId, language, currencyId, createdBy) {
  this.code = code || '';
  this.name = name || '';
  this.description = description || '';
  this.logo = logo || '';
  this.countryId = countryId || 0;
  this.language = language || 'en';
  this.currencyId = currencyId || 0;
  this.createdBy = createdBy || 0;
}

Store.prototype.get = function(code, db) { 
  return new Promise((resolve, reject) => {
    db.connect();
    db.query(
      `select name, code, description, logo, country_id as countryId, language, currency_id as currencyId 
       from store where code='${code}' and status=1`,
      (error, results) => {  
        db.end();
        if (error) {
            
          reject(new NoRecordFoundError('No store found.'));
        } else {   
          const { name, code, description, logo, countryId, language, currencyId } = results[0];
          resolve(new Store(code, name, description, logo, countryId, language, currencyId));
        }
      }
    );
  });
};

Store.prototype.add = function(store, db) {
  return new Promise((resolve, reject) => {
    if (store instanceof Store) {
      Object.keys(store).forEach(function(key, index) {
        if(!store[key]){
          reject(
            new InvalidModelArgumentsError(
              'Not all required fields have a value.'
            )
          );
        }
      });

      const { code, name, description, logo, countryId, language, currencyId } = store;
      db.connect();
      db.query(
        `insert into store(name, code, description, created_on, logo, country_id, language, currency_id) 
         values('${name}', '${code}', '${description}', '${ moment.utc().format('YYYY-MM-DD HH:mm:ss')}', '${logo}', ${countryId}, '${language}', ${currencyId})`,
        error => {
          db.end();
          if (error) {
            reject(new BadRequestError('Invalide store data.'));
          } else {
            resolve(new Store(code, name, description, logo, countryId, language, currencyId));
          }
        }
      );
    } else {
      reject(new BadRequestError('Invalide store data.'));
    }
  });
};

Store.prototype.update = function(store, db) {
  return new Promise((resolve, reject) => {
    if (store instanceof Store) {
      const { code, name, description, logo, countryId, language, currencyId } = store;
      db.connect();
      db.query(
        `update store set name='${name}', logo='${logo}', description='${description}', currency_id='${currencyId}', language='${language}', country_id=${countryId} where code='${code}' and created_by=${this.createdBy}`,
        (error, results) => {

          db.end();
          if (error || results.affectedRows == 0) {
            reject(new BadRequestError('Invalide store data.'));
          } else {
            resolve(new Store(code, name, description, logo, countryId, language, currencyId));
          }
        }
      );
    } else {
      reject(new BadRequestError('Invalide store data.'));
    }
  });
};

Store.prototype.delete = function(code, db) {
  return new Promise((resolve, reject) => {
    db.connect();
    db.query(`update store set status=0 where code=${code}`, error => {
      if (error) {
        reject(new BadRequestError('Deleting store failed.'));
      } else {
        resolve('Store deleted.');
      }
    });
  });
};

module.exports = Store;

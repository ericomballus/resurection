/*const mongodb = require("./mongo");
const getTenantDB = (tenantId, modelName, schema) => {
  const dbName = `${tenantId}`;
  if (mongodb) {
   
    const db = mongodb.mongodb.useDb(dbName, { useCache: true });
   
    db.model(modelName, schema);
    return db;
  }
 
};*/

/**
 * Return Model as per tenant
 */
/*exports.getModelByTenant = (tenantId, modelName, schema) => {
  // console.log(`getModelByTenant tenantId : ${tenantId}.`);
  const tenantDb = getTenantDB(tenantId, modelName, schema);
  return tenantDb.model(modelName);
};*/

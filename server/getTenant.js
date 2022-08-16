const mongodb = require("./mongo");
const getTenantDB = (tenantId, modelName, schema) => {
  const dbName = `${tenantId}`;
  if (mongodb) {
    // useDb will return new connection
    //  console.log(mongodb);
    const db = mongodb.mongodb.useDb(dbName, { useCache: true });
    // console.log(`DB switched to ${dbName}`);
    db.model(modelName, schema);
    return db;
  }
  // return throwError(500, codes.CODE_8004);
};

/**
 * Return Model as per tenant
 */
exports.getModelByTenant = (tenantId, modelName, schema) => {
  console.log(`getModelByTenant tenantId : ${tenantId}.`);
  const tenantDb = getTenantDB(tenantId, modelName, schema);
  return tenantDb.model(modelName);
};

const isExpired = (schema, options) => {
  schema.add({ lastMod: String });

  schema.pre("init", () => {
    // console.log(schema);
    // this.where({ deleted: false });
    this.lastMod = "hello last modifi";
    console.log(this);
  });
};
module.exports = isExpired;

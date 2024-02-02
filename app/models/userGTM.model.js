module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      botUserId: String,
      userId: String,
      lineUid: String,
      lineDisplayName: String,
      client_id: String,
      userAgent: String,
      ipAddressWebStart: String,
      ipAddressChatLine: String,
      uniqueEventId: String,
      sessionId: String,
      timeStamp: String,
      utm_source: String,
      utm_medium: String,
      utm_term: String,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const userGTM = mongoose.model("userGTM", schema);
  return userGTM;
};

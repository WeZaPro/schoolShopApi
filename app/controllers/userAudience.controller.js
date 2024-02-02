const db = require("../models");
const userAudience = db.userAudience;
const axios = require("axios");

// user audience =====> start
exports.createUserAudience = (req, res) => {
  console.log("Path createUserAudience req.body---> ", req.body);
  console.log(
    "Path createUserAudience req.body.utm_source---> ",
    req.body.utm_source
  );
  console.log(
    "Path createUserAudience req.body.utm_medium---> ",
    req.body.utm_medium
  );
  console.log(
    "Path createUserAudience req.body.utm_term---> ",
    req.body.utm_term
  );

  console.log(
    "Path createUserAudience req.body.ipAddress---> ",
    req.body.ipAddress
  );
  // Validate request
  if (!req.body.ipAddress) {
    res.status(400).send({ message: "ipAddress can not be empty!" });
    return;
  }
  const date = new Date();
  const _userAudience = new userAudience({
    userId: req.body.userId,
    client_id: req.body.client_id,
    userAgent: req.body.userAgent,
    ipAddress: req.body.ipAddress,
    uniqueEventId: req.body.uniqueEventId,
    sessionId: req.body.sessionId,
    utm_source: req.body.utm_source,
    utm_medium: req.body.utm_medium,
    utm_term: req.body.utm_term,
    timeStamp: date,
  });

  // check cookiesUid in db
  console.log("userId ==> ", req.body.userId);
  userAudience.findOne(
    // Todo Filter from audience เปลี่ยนจาก IP เป็น userId (cookies) เพราะใช้ ip มันเปลี่ยนไปมา น่าจะมาจาก router wifi
    // { ipAddress: req.body.ipAddress },
    { ipAddress: req.body.ipAddress }, // from gtm api

    // { userId: "1704613370490" },
    function (err, _ipAddress) {
      console.log("FIND DATA*********==>", _ipAddress);
      console.log("ipAddressWebStart*********==>", req.body.ipAddressWebStart);
      if (!_ipAddress) {
        console.log("Not Found botUserId ==>SAVE DATA ");
        _userAudience
          .save()
          .then((data) => {
            console.log("save-> ", data);
            res.send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the Tutorial.",
            });
          });

        //saveDataUserAudience(_userAudience, res);
      } else {
        console.log("Found botUserId ==>IGNORE ");
        res.send("FOUND DATA IN DB");
      }
    }
  );
};

// const saveDataUserAudience = (setData, res) => {
//   console.log("saveDataUserAudience-> ", setData);
//   userAudience
//     .save(setData)
//     .then((data) => {
//       console.log("save-> ", data);
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the Tutorial.",
//       });
//     });
// };

// Find a single  ip address in audence
exports.findOneAudience = async (req, res) => {
  console.log("start findOneAudience --> ");
  const id = req.params.id;
  console.log("AUDIENCE FIND IP -----> ", id);
  var queryData = {
    ipAddress: id,
  };

  userAudience.findOne(queryData, function (err, data) {
    if (!data) {
      console.log("NO DATA AUDIENE IN NODE API-->SAVE DATA ");
      // res.status(404).send({ message: "Not found lineUid " + id });

      res.send({ message: "NO FOUND DATA", sendData: queryData });
    } else {
      console.log("FOUND AUDIECCE DATA --> ", data);
      // res.send(data);
      res.send({ message: "FOUND DATA", sendData: data });
    }
  });
};

// user audience =====>

// update line user id from liff web ******
exports.findIpAndUpdate = async (req, res) => {
  const ip = req.body.ipAddress;
  const _lineUid = req.body.lineUid;
  const filter = { ipAddress: ip };
  const update = { lineUid: _lineUid };

  await userAudience
    .findOneAndUpdate(filter, update, {
      new: true,
    })
    .then((data) => {
      res.send(data);
      console.log("data--> ", data);
    });
};

// find line user id from liff app and send data to GA4******
exports.findLineUidSendToGA = async (req, res) => {
  const _lineUid = req.body.lineUid;

  await userAudience
    .findOne({ lineUid: _lineUid })
    .then((data) => {
      console.log("data :", data);
      // send to GA4
      sendDataGA(res);
      //res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

function sendDataGA(res) {
  const _measurement_id = "G-75KFFSMBKP";
  const _api_secret = "nk_Kg0X7R5W8hERJRekynQ";
  let data = JSON.stringify({
    client_id: "123456.7654321",
    user_properties: {
      ipAddress: {
        value: "223.204.238.149",
      },
    },
    events: [
      {
        name: "LineChatRoom",
        params: {
          campaign_id: "google_1234",
          campaign: "Summer_fun",
          source: "google",
          medium: "cpc",
          term: "summer+travel",
          content: "logolink",
          session_id: "123",
          engagement_time_msec: "100",
        },
      },
    ],
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://www.google-analytics.com/mp/collect?measurement_id=${_measurement_id}&api_secret=${_api_secret}`,
    // url: "https://www.google-analytics.com/mp/collect?measurement_id=G-75KFFSMBKP&api_secret=nk_Kg0X7R5W8hERJRekynQ",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      res.send("send event -LineChatRoom- GA4 OK");
    })
    .catch((error) => {
      console.log(error);
    });
}

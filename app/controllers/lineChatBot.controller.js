const db = require("../models");
const https = require("https");
const LineBot = db.getMessage;
require("dotenv").config();
const liff = require("@line/liff");
let channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

exports.getChat = (req, res) => {
  res.status(200).send({ message: "Send from chat bot" });
};

exports.chat = (req, res) => {
  const lineChatBot = new LineBot({
    userId: req.body.events[0].source.userId,
    inputMessage: req.body.events[0].message.text,
  });
  //Todo -> find user id from db=> req.body.events[0].source.userId
  //Todo -> yes -> next | no -> save to db

  LineBot.findOne(
    { userId: req.body.events[0].source.userId },
    function (err, _userId) {
      console.log("_userId => ", _userId);
      console.log(
        "req.body.events[0].message.text  => ",
        req.body.events[0].message.text
      );

      //Todo รับข้อความจาก Liff -> เช็คว่าใช่คำว่า "START"
      if (req.body.events[0].message.text === "START") {
        //Todo save db
        lineChatBot
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
      } else {
        if (_userId === null) {
          //Todo send message confirm save
          confirmSaveDb(req, res, channelAccessToken);
        } else {
          console.log("req.body.events[0].--> ", req.body.events[0]);
        }
      }
    }
  );
};

function confirmSaveDb(req, res, channelAccessToken) {
  const lineUserId = req.body.events[0].source.userId;
  if (req.body.events[0].message.type === "text") {
    // not stricker

    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      //   messages: samplePayload(),

      messages: setRegister(lineUserId),

      //   ],
    });

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + channelAccessToken,
    };

    const webhookOptions = {
      hostname: "api.line.me",
      path: "/v2/bot/message/reply",
      method: "POST",
      headers: headers,
      body: dataString,
    };

    const request = https.request(webhookOptions, (res) => {
      res.on("data", (d) => {
        process.stdout.write(d);
      });
    });

    request.on("error", (err) => {
      console.error(err);
    });

    request.write(dataString);
    request.end();

    //=====> end
  } else {
    console.log("message type = !text");
    res.status(200).send({
      message: "message type = !text",
    });
  }
}

function setRegister(lineUserId) {
  //var urlLiff = `line://app/1656824759-YxEy381k/path?botUserId=` + lineUserId;//ไปหน้า WebA / Cotact |  แก้เป็น liff web a หน้าสำหรับ redirect
  var urlLiff =
    `line://app/${process.env.liffApp}/path?botUserId=` + lineUserId; //ไปหน้า Liff App |แก้เป็น liff web a หน้าสำหรับ redirect
  console.log("urlLiff -> ", urlLiff);
  return [
    {
      type: "template",
      altText: "this is a confirm template",
      template: {
        type: "confirm",
        text: "ต้องการที่จะติดต่อพนักงานหรือไม่?",
        actions: [
          {
            // type: "message",
            // label: "YES",
            // text: "START",
            //
            type: "uri",
            label: "YES",
            uri: urlLiff,
          },
          {
            type: "message",
            label: "NO",
            text: "NO",
          },
        ],
      },
    },
  ];
}

function sendMessage(req, res, channelAccessToken) {
  if (req.body.events[0].message.type === "text") {
    // not stricker

    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      //   messages: samplePayload(),

      messages: [
        {
          type: "text",
          text: responseMessage(req.body.events[0].message.text),
        },
        {
          type: "sticker",
          packageId: "446",
          stickerId: "1988",
        },
      ],

      //   ],
    });

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + channelAccessToken,
    };

    const webhookOptions = {
      hostname: "api.line.me",
      path: "/v2/bot/message/reply",
      method: "POST",
      headers: headers,
      body: dataString,
    };

    const request = https.request(webhookOptions, (res) => {
      res.on("data", (d) => {
        process.stdout.write(d);
      });
    });

    request.on("error", (err) => {
      console.error(err);
    });

    request.write(dataString);
    request.end();

    //=====> end
  } else {
    console.log("message type = !text");
    res.status(200).send({
      message: "message type = !text",
    });
  }
}

function responseMessage(inputMsg) {
  return inputMsg;
}
function samplePayload() {
  console.log("test send payLoad-->");
  return [
    {
      type: "template",
      altText: "this is a confirm template",
      template: {
        columns: [
          {
            title: "เบียร์สด หรือ นามะบีรุ",
            actions: [
              {
                type: "uri",
                uri: "https://liff.line.me/2001254953-w391eWy1",
                label: "รายละเอียด",
              },
            ],
            text: "เป็นเครื่องดื่มที่ทางร้านนาเอบะขาดไม่ได้เลย ลูกค้ามักจะถามถึงเป็นอันดับแรก",
            thumbnailImageUrl:
              "https://naebaizakaya.com/wp-content/uploads/2023/11/1-1.jpg",
          },
          {
            actions: [
              {
                type: "uri",
                uri: "https://liff.line.me/2001254953-w391eWy1",
                label: "รายละเอียด",
              },
            ],
            title: "เมนูเสียบไม้ หรือ ยากิโทริ",
            text: "ยากิโทริคือไก่ย่างเสียบไม้โดยจะมีไก่หลายส่วนให้เลือก",
            thumbnailImageUrl:
              "https://naebaizakaya.com/wp-content/uploads/2023/11/2-2.jpg",
          },
          {
            text: "เป็นเครื่องดื่มอีกชนิดที่ลูกค้าที่ร้านนาเอบะชอบสั่งมาดื่มกัน มีรสชาติหวานอมเปรี้ยว",
            thumbnailImageUrl:
              "https://naebaizakaya.com/wp-content/uploads/2023/11/3-1.jpg",
            actions: [
              {
                label: "รายละเอียด",
                uri: "https://liff.line.me/2001254953-w391eWy1",
                type: "uri",
              },
            ],
            title: "เหล้าบ๊วย หรือ อุเมะชุ",
          },
          {
            title: "หม้อไฟ หรือ นาเบะ",
            actions: [
              {
                type: "uri",
                label: "รายละเอียด",
                uri: "https://liff.line.me/2001254953-w391eWy1",
              },
            ],
            text: "คืออาหารที่ใส่ผัก,เห็ด,เนื้อสัตว์,เต้าหู้ และเส้น ลงในหม้อแล้วพร้อมเสริฟ",
            thumbnailImageUrl:
              "https://naebaizakaya.com/wp-content/uploads/2023/11/4-1.jpg",
          },
        ],
        type: "carousel",
        imageSize: "cover",
        imageAspectRatio: "square",
      },
    },
  ];
}

var webPush = require('web-push');

const vapidKeys = {
    "publicKey":"BIcMqEc23-ZJdXuBq0mdUkUb_kDOynGWYj9PV96cp6JbIXgCkTQIH-SiqHG-bdG2-VRfnh899PL4xpAUlo2n9xc",
    "privateKey":"01FkW13-hHSBjJFeTUR7KqWVgq2OVC98ddbwTr3pCFU"

};

webPush.setVapidDetails(
    'mailto:laliga@laliga.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

var pushSubscription = {
    "endpoint" : "https://fcm.googleapis.com/fcm/send/ccf1V9MXTlc:APA91bHQReclErcKdSXDIVFGUK29CFKbI0DgfOBlJIb3UuxLC7jq3zCFsK0JtdO9BaZMyk5nr2IbDurXTbmoLM91QLLY54c-VaGtyaryHjJtJk3tX-wSm-Li0TGl5sQ4OQmaeWRHRpSQ",
    "keys" : {
        "p256dh": "BIQmpuKHPOq7z5aNM08OdEDIDmEu30ggNTolr5rbwlrYC+svaY/wzpMEFWN8jkzIpWtHc4XJsomH1qB83s/OGfU=",
        "auth": "mTq1ayI5rTMgvQ4DrQn5sw=="
    }
}

var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

var options = {
    gcmAPIKey: '664290932518',
    TTL: 60
 };
 webPush.sendNotification(
    pushSubscription,
    payload,
    options
 );
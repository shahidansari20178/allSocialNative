const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
let db = admin.database();
const socialCollection = 'AllSocialData';
const userCollection = 'users';
let socialId = undefined;
const is_url = (url) => {
    let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return regexp.test(url);
};

const isBase64 = (str) => {
    try {
        let base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
        return base64regex.test(str);
    } catch (err) {
        return false;
    }
};

exports.sendPushNotificationOnCreate = functions.database
    .ref(`${socialCollection}/{socialID}`)
    .onCreate(event => {
        console.log('---event',event)
        const info = event._data
        let userRef = db.ref(userCollection);
        userRef.once('value',(data)=> {
            sendNotification(data.val().notification_token,info)
        })

    });

const sendNotification = (token,info) => {
    console.log('---------info',info)
    let payload = {
        notification: {
            title: info.title,
            body: info.socialSiteUrl
        }
    };
    // let socialRef = db.ref(`${socialCollection}/${socialId}`);
    // socialRef.once('value',(data)=> {
    //     payload.notification.title = data.val().title;
    //     payload.notification.body= data.val().socialSiteUrl;
    // });
    // console.log('payload',payload,'-------',socialId)
    admin
        .messaging()
        .sendToDevice(token, payload)
        // eslint-disable-next-line promise/always-return
        .then(function(response) {
            console.log("Notification sent successfully:", response);
        })
        .catch((error) => {
            console.log("Notification sent failed:", error);
        });
};

exports.sendPushNotificationOnUpdate = functions.database
    .ref(`${socialCollection}/{socialID}`)
    .onUpdate(event => {
        const info = event._data
        console.log('---event',event)
        let userRef = db.ref(userCollection);
        userRef.once('value',(data)=> {
            let userList = Object.values(data.val());
            console.log('userList------',userList);
            // eslint-disable-next-line array-callback-return
            userList.map((item) => {
                console.log('item------',item);
                sendNotification(item.notification_token,info)
            })
        })
    });

exports.socialAll_Add_Provider = functions.https.onRequest((req, res) => {
    let socialRef = db.ref(socialCollection);
    const {title = '', socialSiteImageUri = '', socialSiteUrl = '', isReachable = false} = req.body;
    if (!title || title === '') {
        return res.send({"error": "please pass title"});
    } else if (!socialSiteImageUri || socialSiteImageUri === '') {
        return res.send({"error": "please pass socialSite Image uri field"});
    } else if (!isBase64(socialSiteImageUri)) {
        return res.send({"error": "please pass right socialSite Image uri"});
    } else if (!socialSiteUrl || socialSiteUrl === '') {
        return res.send({"error": "please pass socialSite url field"});
    } else if (!is_url(socialSiteUrl)) {
        return res.send({"error": "please pass right socialSite url"});
    } else {
        let socialInfo = {
            title: title,
            socialSiteUrl: socialSiteUrl,
            socialSiteImageUri: socialSiteImageUri,
            isReachable: isReachable
        };
        socialRef.push(socialInfo, (error) => {
            if (error) {
                return res.send({"message": "Data could not be saved." + error})
            } else {
                return res.send({"message": "Data saved successfully."})
            }
        });
    }
});

exports.socialAll_Get_Provider_By_Id = functions.https.onRequest((req, res) => {
    const {id = ''} = req.body;
    if (!id || id === '') {
        return res.send({"error": "please pass socialSite id field"});
    } else {
        let socialRef = db.ref(`${socialCollection}/${id}`);
        socialRef.once("value", (snapshot) => {
            let socialInfo = snapshot.val();
            if (socialInfo) {
                socialInfo.id = id;
                res.send({socialInfo});
            } else {
                res.send({message: 'no Data Found'});
            }
        }, () => (errorObject) => {
            res.send({"error": "The read failed: " + errorObject.code});
        });
    }
});

exports.socialAll_Delete_Provider_By_Id = functions.https.onRequest((req, res) => {
    const {id = ''} = req.body;
    if (!id || id === '') {
        return res.send({"error": "please pass socialSite id field"});
    } else {
        let socialRef = db.ref(`${socialCollection}/${id}`);
        socialRef.once("value", (snapshot) => {
            let socialInfo = snapshot.val();
            if (socialInfo) {
                // eslint-disable-next-line promise/always-return
                socialRef.remove().then((response) => {
                    res.send({message: 'successfully Deleted'});
                }).catch((err) => {
                    res.send({error: err});
                });
            } else {
                res.send({message: 'please enter correct id'});
            }
        }, () => (errorObject) => {
            res.send({"error": "The read failed: " + errorObject.code});
        });
    }
});

exports.socialAll_Update_Provider_By_Id = functions.https.onRequest((req, res) => {
    const {id = '',title = '', socialSiteImageUri = '', socialSiteUrl = '', isReachable = false} = req.body;
    if (!id || id === '') {
        return res.send({"error": "please pass socialSite id field"});
    } else if (!title || title === '') {
        return res.send({"error": "please pass title"});
    } else if (!socialSiteImageUri || socialSiteImageUri === '') {
        return res.send({"error": "please pass socialSite Image uri field"});
    } else if (!isBase64(socialSiteImageUri)) {
        return res.send({"error": "please pass right socialSite Image uri"});
    } else if (!socialSiteUrl || socialSiteUrl === '') {
        return res.send({"error": "please pass socialSite url field"});
    } else if (!is_url(socialSiteUrl)) {
        return res.send({"error": "please pass right socialSite url"});
    } else {
        let socialRef = db.ref(`${socialCollection}/${id}`);
            socialId = id;
            socialRef.once("value", (snapshot) => {
            if (snapshot.val()) {
                let socialInfo = {
                    title: title,
                    socialSiteUrl: socialSiteUrl,
                    socialSiteImageUri: socialSiteImageUri,
                    isReachable: isReachable
                };
                // eslint-disable-next-line promise/always-return
                socialRef.update(socialInfo,(error) => {
                    if (error) {
                        return res.send({"message": "Data could not be updated." + error})
                    } else {
                        return res.send({"message": "Data updated successfully."})
                    }
                })
            } else {
                res.send({message: 'please enter correct id'});
            }
        }, () => (errorObject) => {
            res.send({"error": "The read failed: " + errorObject.code});
        });
    }
});

exports.socialAll_Get_All_Provider = functions.https.onRequest((req, res) => {
    if(req.method ===  'GET'){
        let socialRef = db.ref("/AllSocialData");
        socialRef.once("value", (snapshot) => {
            let socialObjectValues = Object.values(snapshot.val());
            let socialObjectKeys = Object.keys(snapshot.val());
            socialObjectValues.map((data, index) => socialObjectValues[index].id = socialObjectKeys[index]);
            res.send(socialObjectValues)
        }, () => (errorObject) => {
            res.send({"error": "The read failed: " + errorObject.code});
        });
    } else {
        res.status(405).send({error: 'Something blew up!'});
    }
});

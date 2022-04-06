const Notification = require("../models/Notification");
const response = require("../utils/responses.utils");
const roles = require("../utils/roles");

module.exports = {

    /**
     * createNotification: Creates new notification when an event is triggered
     * @Desc This method creates a new notification and saves it to db.
     * @param {*} event Triggered event type
     * @param {*} content Notification data
     * @param {*} creator User who created the notification
     * @param {*} receivers Users who will receive notifications
     */
    createNotification: async (event, content, creator, receivers) => {
        console.log("Post Notification triggered..")
        try{
            const newNotify = new Notification({
                event: event,
                creator: creator._id,
                creatorModel: creator.role,
                content: content._id,
                contentModel: event.model,
            });

            newNotify.receivers = receivers.map((receiver) => {
                return {
                    role: receiver.role,
                    user: receiver._id,
                    read: false
                }
            })

            await newNotify.save();
        }
        catch(err){
            console.log(err)
        }
    },

    // fetch all notification
    getAllNotifications: async (req, res, next) => {
        try{
            const notifications = await Notification.find({"receivers.user" : req.user._id}).populate(["creator", "content", "receivers.user"]);
            response.success(res, "", notifications);
        }
        catch(err){
            console.log(err)
        }
    },

    // fetch notification by id
    getNotificationById: async (req, res, next) => {
        try{
            const notification = await Notification.findById(req.params.id);
            response.success(res, "", notification);
        }
        catch(err){
            console.log(err);
            response.error(res);
        }
    },

    // set notifications as read
    setNotificationAsRead: async (req, res, next) => {
        try{
            const user = req.user;
            const notifications = req.body.notificationIds;

            notifications.forEach(async (item) => {

                if(item.willReceive) {
                    await Notification.findOneAndUpdate({ _id: item.id, "receivers.user": user._id }, {
                        $set: {
                            "receivers.$.read": true,
                            "receivers.$.willReceive": true
                        }
                    })
                } 
                else {
                    await Notification.findOneAndUpdate({ _id: item.id, "receivers.user": user._id }, {
                        $set: {
                            "receivers.$.read": true,
                        }
                    })
                }
            });
            
            response.success(res);
        }
        catch(err){
            console.log(err)
        }
    }

}
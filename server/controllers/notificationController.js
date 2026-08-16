import notificationModel from "../models/Notification.js";

const createNotification = async (recipientId, type, message, relatedAssignmentId) => {
    const notification = new notificationModel({
        recipient : recipientId,
        type,
        message,
        relatedAssignment : relatedAssignmentId
    });

    await notification.save();
}

const createBulkNotification = async (recipientIds, type, message, relatedAssignmentId) => {
    const notifications = recipientIds.map((id)=>({
        recipient : id,
        type,
        message,
        relatedAssignment : relatedAssignmentId
    }));

    await notificationModel.insertMany(notifications);
}

const getMyNotification = async (req, res) => {
    try {
        const notifications = await notificationModel.find({recipient : req.user.userId}).sort({ createdAt : -1 });
        return res.status(200).json({ success: true, notifications });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await notificationModel.findById(notificationId);
        if(!notification){
            return res.status(404).json({ success: false, message: "Notification not found"});
        }
        const isCorrectUser = notification.recipient.toString() === req.user.userId ? true : false;
        if(!isCorrectUser){
            return res.status(403).json({success: false, message: "This notification in not for you"})
        }
        await notification.updateOne({isRead : true});
        return res.status(200).json({success: true, message: "Notification updated"});
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export { createNotification, createBulkNotification, getMyNotification, markAsRead }
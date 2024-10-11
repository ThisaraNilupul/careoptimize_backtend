const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('../models/userModel');
const Notification = require('../models/notificationModel');



//get patient profile
exports.getPatientProfile = async (req, res) => {
    try{
        // Find the patient by the ID attached by the auth middleware
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ msg: 'Patient not found'});
        }
        res.json(patient);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
};

//edit patient's profile data
exports.editPatientProfile = async (req, res) => {
    try{
        const {firstName, lastName, addressNo, street, city, province, phoneNumber, email, height, weight} = req.body;
        const patient = await Patient.findById(req.params.id);
        if (!patient){
            return res.status(404).json({msg: 'Patient not found'});
        }
        patient.firstName = firstName || patient.firstName;
        patient.lastName = lastName || patient.lastName;
        patient.addressNo = addressNo || patient.addressNo;
        patient.street = street || patient.street;
        patient.city = city || patient.city;
        patient.province = province || patient.province;
        patient.phoneNumber = phoneNumber || patient.phoneNumber;
        patient.email = email || patient.email;
        patient.biodata.height = height || patient.biodata.height;
        patient.biodata.weight = weight || patient.biodata.weight;

        await patient.save();
        res.status(200).json({msg: 'Patient details updated successfully', patient});
    }catch (error){ 
        res.status(500).json({msg: 'Server error'});
    }
}

//update medical bio-data
exports.addMedicalBioData = async (req, res) => {
    const { bloodType, height, weight } = req.body;

    try {
        const patient = await Patient.findById(req.params.id);
        if(!patient){
            return res.status(404).json({msg: 'Patient not found'});
        }

        if (!patient.biodata) {
            patient.biodata = {};
        }

        patient.biodata.bloodType = bloodType || patient.biodata.bloodType;
        patient.biodata.height = height || patient.biodata.height;
        patient.biodata.weight = weight || patient.biodata.weight;

        await patient.save();
        res.status(200).json({msg: 'Medical bio-data updated successfully', patient});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: error.message});
    }
};

//get medical bio-data
exports.getMedicalBio = async (req, res) => {
    try{
        const patient = await Patient.findById(req.params.id);
        if (!patient){
            return res.status(404).json({msg: 'Patient not found'});
        }

        const medicalBioData = {
            bloodType: patient.biodata.bloodType,
            height: patient.biodata.height,
            weight: patient.biodata.weight,
            healthIssues: patient.healthIssues
        }

        res.status(200).json(medicalBioData);
    }catch (error) { 
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

//add patient's relatives
exports.addrelative = async (req, res) => {
    const { firstName, lastName, addressNo, street, city, province, nic, phoneNumber, email, relationship} = req.body;

    try{
        const patient = await Patient.findById(req.params.id);
        if (!patient){
            return res.status(404).json({msg: 'Patient not found'});
        }

        const newRelative = { firstName, lastName, addressNo, street, city, province, nic, phoneNumber, email, relationship};
        patient.relatives.push(newRelative);

        await patient.save();
        res.status(200).json({msg: 'Relative added successfully', patient});
    }catch (error){
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

//get one patient's relative
exports.getOneRelative = async (req, res) => {
    try{
        const {id, rid} = req.params;
        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({msg: 'Patient not found'});
        }
        const relative = patient.relatives.find(rel=>rel._id.toString()===rid);
        if (!relative) {
            return res.status(404).json({msg: 'Relative details not found'});
        }
        res.status(200).json(relative);
    }catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Server error'});
    }
}
 
//get all patient's relatives
exports.getRelatives = async (req, res) => {
    try{
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ msg: 'Patient not found' });
        }
        res.status(200).json(patient.relatives);
    }catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

//delete a patient's relative
exports.deleteOneRelative = async (req, res) => {
    try{
        const {id, rid} = req.params;
        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({msg: 'Patient not found'});
        }
        const relativeIndex = patient.relatives.findIndex(rel=>rel._id.toString()===rid);
        if (relativeIndex === -1) {
            return res.status(404).json({msg: 'Relative details not found'});
        }
        patient.relatives.splice(relativeIndex, 1);
        await patient.save();
        res.status(200).json({msg: 'Relative deleted successfully'});
    }catch (error){
        res.status(500).json({msg: 'Server error'});
    }
}

//update a patient's relative
exports.updateOneRelative = async (req, res) => {
    try{
        const {id, rid} = req.params;
        const {firstName, lastName, addressNo, street, city, province, nic, phoneNumber, email, relationship} = req.body;
        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({msg: 'Patient not found'});
        }
        const relative = patient.relatives.find(rel => rel._id.toString() === rid);
        if (!relative) {
            return res.status(404).json({ msg: 'Relative not found' });
        }
        relative.firstName = firstName || relative.firstName;
        relative.lastName = lastName || relative.lastName;
        relative.addressNo = addressNo || relative.addressNo;
        relative.street = street || relative.street;
        relative.city = city || relative.city;
        relative.province = province || relative.province;
        relative.nic = nic || relative.nic;
        relative.phoneNumber = phoneNumber || relative.phoneNumber;
        relative.email = email || relative.email;
        relative.relationship = relationship || relative.relationship;

        await patient.save();
        res.status(200).json({msg: 'Relative updated successfully', relative})
    }catch (error){
        res.status(500).json({ error: 'Server error' });
    }
}

//add patient's health issues
exports.addHealthIssue = async (req, res) => {
    try{
        const {id} = req.params;
        const {issue} = req.body;

        const patient = await Patient.findById(id);
        if (!patient){
            return res.status(404).json({msg: 'Patient not found'});
        }

        patient.healthIssues.push({issue});
        await patient.save();
        res.status(201).json({msg: 'Health issue added successfully', healthIssues: patient.healthIssues});
    } catch (error){
        res.status(500).json({ error: 'Server error' });
    }
}

// Get all health issues for a patient
exports.getAllHealthIssues = async (req, res) => {
    try{
        const patient = await Patient.findById(req.params.id);
        if (!patient){
            return res.status(404).json({msg: 'Patient not found'});
        }

        res.status(200).json({healthIssues: patient.healthIssues});
    } catch (errorr){
        res.status(500).json({ error: 'Server error' });
    }
}

//get one health issue for a patient
exports.getOneHealthIssue = async (req, res) => {
    try{
        const {id, issueId} = req.params;
        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({msg: 'Patient not found'});
        }
        const issue = patient.healthIssues.find(issu=>issu._id.toString() === issueId);
        if (!issue) {
            return res.status(404).json({msg: 'Helath issue details not found'});
        }
        res.status(200).json(issue);
    }catch (error){
        console.error(error);
        res.status(500).json({msg: 'Server error'});
    }
}

// Delete a health issue
exports.deleteHealthIssue = async (req, res) => {
    try{
        const {id, issueId} = req.params;
        const patient = await Patient.findById(id);
        if (!patient){
            return res.status(404).json({msg: 'Patient not found'});
        }

        const issueIndex = patient.healthIssues.findIndex(issue => issue._id.toString() === issueId);
        if (issueIndex === -1){
            return res.status(404).json({msg: 'Health issue not found'});
        }

        patient.healthIssues.splice(issueIndex, 1);
        await patient.save();

        res.status(200).json({msg: 'Health issue deleted successfully', healthIssues: patient.healthIssues});
    }catch (error){
        res.status(500).json({ error: 'Server error' });
    }
}

//Update a health issue
exports.updateHealthIssue = async (req, res) => {
    try{
        const { id, issueId } = req.params;
        const { issue } = req.body;

        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({ msg: 'Patient not found' });
        }

        const healthIssue = patient.healthIssues.find(hi => hi._id.toString() === issueId);
        if (!healthIssue) {
            return res.status(404).json({ msg: 'Health issue not found' });
        }

        healthIssue.issue = issue;
        await patient.save();
        
        res.status(200).json({ msg: 'Health issue updated successfully', healthIssues: patient.healthIssues });
    }catch (error){
        res.status(500).json({ error: 'Server error' });
    }
}

//get notifications
exports.getNotification = async (req, res) => {
    const { userId } = req.params;
    console.log('Fetching notifications for userId:', userId);
    
    try{
        const notifications = await Notification.find({ userId: userId.trim() }).sort({ date: -1 });

        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ message: 'No notifications found for this user.' });
        }

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Error fetching notifications' });
    }
}

//update notification mark as read
exports.updateNotificationMarkAsRead = async (req, res) => {
    const { id } = req.params;

    try{
        const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });

        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' })
        }

        res.status(200).json({ msg: 'Notification marked as read', notification});
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/userModel');
const Treatment = require('../models/ongoingTreatmentModel');
const { 
    scheduleTreatmentStartNotification,
    scheduleTreatmentEndNotification, 
    scheduleCheckupNotifications, 
    scheduleTreatmentPlanNotifications 
} = require('../config/notificationService');

//Get doctors's profile
exports.getDoctorProfile = async (req, res) => {
    try{
        const doctor = await Doctor.findById(req.params.id).select('-password');;
        if (!doctor || doctor.role !== "D") {
            return res.status(404).json({ msg: 'Doctor profile not found' });
        }
        res.status(200).json(doctor);
    }catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

//edit doctor's profile
exports.editDoctorProfile = async (req, res) => {
    const { firstName, lastName, addressNo, street, city, province, phoneNumber, email, eduLevel, specialistArea } = req.body;

    try{
        let doctor = await Doctor.findById(req.params.id);
        if (!doctor || doctor.role !== "D") {
            return res.status(404).json({ msg: 'Doctor profile not found' });
        }

        doctor = await Doctor.findByIdAndUpdate(req.params.id, {
            firstName, lastName, addressNo, street, city, province, phoneNumber, email, "doctorInfo.eduLevel": eduLevel, "doctorInfo.specialistArea": specialistArea
        }, {new: true});

        res.status(200).json({ msg: 'Doctor info updated successfully', doctor })
    }catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

//add doctor's doctorInfo
exports.addDoctorInfo = async (req, res) => {
    const { eduLevel, specialistArea } = req.body;

    try{
        let doctor = await Doctor.findById(req.params.id);
        if (!doctor || doctor.role !== "D") {
            return res.status(404).json({ msg: 'Doctor profile not found' });
        }

        doctor.doctorInfo = { eduLevel, specialistArea };
        await doctor.save();
        res.status(200).json({ msg: 'Doctor-info updated successfully', doctor });
    }catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

//get doctor's doctorInfo
exports.getDoctorInfo = async (req, res) => {
    try{
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor || doctor.role !== "D") {
            return res.status(404).json({ msg: 'Doctor profile not found' });
        }

        if (!doctor.doctorInfo) {
            return res.status(404).json({ msg: 'Doctor-info not found' });
        }

        res.status(200).json(doctor.doctorInfo);
    }catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

//add doctor's work at info
exports.addDoctorWorkAt = async (req, res) => {
    const { placeName, h_addressNo, h_street, h_city, h_province, h_phoneNumber, h_email } = req.body;

    try{
        let doctor = await Doctor.findById(req.params.id);
        if (!doctor || doctor.role !== "D") {
            return res.status(404).json({ msg: 'Doctor profile not found' });
        }

        const workAtEntry = { placeName, h_addressNo, h_street, h_city, h_province, h_phoneNumber, h_email };

        doctor.workAt.push(workAtEntry);
        await doctor.save();

        res.status(200).json({msg: 'Doctor work at info added successfully'});
    }catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}

//edit doctor's work at info
exports.editDoctorWorkAt = async (req, res) => {
    const { placeName, h_addressNo, h_street, h_city, h_province, h_phoneNumber, h_email } = req.body;

    try{
        let doctor = await Doctor.findById(req.params.id);
        if (!doctor || doctor.role !== "D") {
            return res.status(404).json({ msg: 'Doctor profile not found' });
        }

        const workAtEntry = doctor.workAt.id(req.params.wid);
        if (!workAtEntry) {
            return res.status(404).json({ msg: 'Work at info not found' });
        }

        workAtEntry.placeName = placeName;
        workAtEntry.h_addressNo = h_addressNo;
        workAtEntry.h_street = h_street;
        workAtEntry.h_city = h_city;
        workAtEntry.h_province = h_province;
        workAtEntry.h_phoneNumber = h_phoneNumber;
        workAtEntry.h_email = h_email;

        await doctor.save();

        res.status(200).json({msg: 'doctor work at info updated successfully', workAtEntry});
    }catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

//get one doctor's work at info
exports.getDoctorWorkAt = async (req, res) => {
    try{
        let doctor = await Doctor.findById(req.params.id);
        if (!doctor || doctor.role !== "D") {
            return res.status(404).json({ msg: 'Doctor profile not found' });
        }

        const workAtEntry = doctor.workAt.id(req.params.wid);
        if (!workAtEntry) {
            return res.status(404).json({ msg: 'Work at info not found' });
        }

        res.status(200).json(workAtEntry);
    }catch (error){
        console.error(error.message);
        res.status(500).send('Server error');
    }
}

//delete doctor's work at info
exports.deleteDoctorWorkAt = async (req, res) => {
    try{
        const { id , wid } = req.params;
        let doctor = await Doctor.findById(id);
        if (!doctor || doctor.role !== "D") {
            return res.status(404).json({ msg: 'Doctor profile not found' });
        }

        const workAtIndex = doctor.workAt.findIndex(workat => workat._id.toString() === wid);
        if (workAtIndex === -1) {
            return res.status(404).json({msg: 'Work-at info not found.'});
        }

        doctor.workAt.splice(workAtIndex, 1);
        await doctor.save();

        res.status(200).json({msg: 'Work-at info deleted successfully.'});
    }catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}

//get all patients
exports.getAllPatients = async (req, res) => {
    try{
        const patients = await Doctor.find({role: "P"});

        if (!patients || patients.length === 0) {
            return res.status(404).json({msg: 'No patients found'});
        }

        res.status(200).json(patients);
    }catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}

//add new treatment
exports. addNewTreatment = async (req, res) => {
    try{
        const {
            patientId,
            patientName,
            gender,
            age,
            phone,
            email,
            diagnosis,
            diagnosisDescription,
            prescription,
            checkups,
            startDate,
            endDate,
            days,
            treatmentPlans,
            doctorInfo,
            hospitalInfo,
        } = req.body;

        const newTreatment = new Treatment({
            patientId,
            patientName,
            gender,
            age,
            phone,
            email,
            diagnosis,
            diagnosisDescription,
            prescription,
            checkups,
            startDate,
            endDate,
            days,
            treatmentPlans,
            doctorInfo,
            hospitalInfo,
        });

        await newTreatment.save();

        scheduleTreatmentStartNotification(newTreatment);
        scheduleTreatmentEndNotification(newTreatment);
        scheduleCheckupNotifications(newTreatment);
        scheduleTreatmentPlanNotifications(newTreatment);

        res.status(200).json({ msg: 'New treatment added successfully', treatment: newTreatment });
    } catch (error) {
        console.error('Error adding treatment:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

//get patient's treatments
exports.getPatientTreatments = async (req, res) => {
    try{
        const { patientId } = req.params;

        const treatments = await Treatment.find({ patientId });
        if (!treatments || treatments.length === 0) {
            return res.status(404).json({ msg: 'No treatments found for this patient.' });
        }

        res.status(200).json(treatments);
    } catch (error) {
        console.error('Error fetching treatments:', error);
        res.status(500).json({ error: 'Server error' });
    }
}
const Profile = require("../models/profile");
const { profileSchema } = require('../middlewares/validator');
const asyncCatch = require('../middlewares/asyncTryCatch');

const createUpdateProfile = asyncCatch(profileSchema, async(req, res)=>{
        const {id:user} = req.user;
            // Find if a profile already exists for the user
        let profile = await Profile.findOne({ user });
    
        if (profile) {
          // Update existing profile
          profile = await Profile.findOneAndUpdate(
            { user },
            { $set: req.body },
            { new: true } // Return updated profile
          );
        } else {
          // Create a new profile
          profile = new Profile({ user, ...req.body });
          await profile.save();
        }
    
        return res.status(200).json({ success: true, profile ,message:"Profile updated successfully"});

});

const getProfile =async(req, res)=>{
    const {id:user} = req.user;
    let profile = await Profile.findOne({ user });
    if(!profile){
        return res.status(404).json({ message: "No profile found." });
    }
    return res.status(200).json({ success: true, profile });
}
module.exports ={createUpdateProfile, getProfile}
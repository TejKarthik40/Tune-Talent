const musicnotemodel = require('../models/musicnotemodel')
const usermodel = require('../models/usermodel')
const cloudinary = require('../config/cloudinary')

exports.uploadnote = async (req,res) =>{
    try{
        if(!req.file) return res.json({message : "No File Uploaded"})

        const {title,description,rate,genre} = req.body
        if(!title || !rate || !genre) return res.json({message : "Error Missing Fields"})

        let user = await usermodel.findOne({username : req.user.username})
        if(!user) return res.json({message : "User Not Found"})

        const base64 = req.file.buffer.toString('base64')
        const datauri = `data:${req.file.mimetype};base64,${base64}`
        const result = await cloudinary.uploader.upload(datauri,{
            folder : 'tunetalent/musicnotes',
            resource_type : 'auto'
        })

        let note = await musicnotemodel.create({
            user : user._id,
            title : title,
            genre : genre,
            description : description,
            fileurl : result.secure_url,
            rate : rate
        })

        res.status(201).json({message : "Music Note Uploaded",note : note})
    }catch(err){
        res.json({message : err.message})
    }
}

exports.getmynotes = async (req,res) =>{
    try{
        let user = await usermodel.findOne({username : req.user.username})
        if(!user) return res.json({message : "User Not Found"})

        let notes = await musicnotemodel.find({user : user._id}).populate('user','username email')
        res.status(200).json({message : "Notes Fetched",notes : notes})
    }catch(err){
        res.json({message : err.message})
    }
}

exports.getnotebyid = async (req,res) =>{
    try{
        let note = await musicnotemodel.findById(req.params.noteid).populate('user','username email').populate('ratings.user','username').populate('bids.user','username')
        if(!note) return res.json({message : "Note Not Found"})

        res.status(200).json({message : "Note Fetched",note : note})
    }catch(err){
        res.json({message : err.message})
    }
}

exports.ratenote = async (req,res) =>{
    try{
        const {value} = req.body
        if(!value || value < 1 || value > 5) return res.json({message : "Rating must be between 1 and 5"})

        let user = await usermodel.findOne({username : req.user.username})
        if(!user) return res.json({message : "User Not Found"})

        let note = await musicnotemodel.findById(req.params.noteid)
        if(!note) return res.json({message : "Note Not Found"})

        if(note.user.toString() === user._id.toString()) return res.json({message : "Cannot rate your own note"})

        let existingrating = note.ratings.find(r => r.user.toString() === user._id.toString())
        if(existingrating){
            existingrating.value = value
        }else{
            note.ratings.push({user : user._id,value : value})
        }

        await note.save()
        res.status(200).json({message : "Note Rated",note : note})
    }catch(err){
        res.json({message : err.message})
    }
}

exports.bidonnote = async (req,res) =>{
    try{
        const {amount} = req.body
        if(!amount) return res.json({message : "Bid Amount Required"})

        let user = await usermodel.findOne({username : req.user.username})
        if(!user) return res.json({message : "User Not Found"})

        let note = await musicnotemodel.findById(req.params.noteid)
        if(!note) return res.json({message : "Note Not Found"})

        if(note.user.toString() === user._id.toString()) return res.json({message : "Cannot bid on your own note"})

        note.bids.push({user : user._id,amount : amount})
        await note.save()

        res.status(201).json({message : "Bid Placed",note : note})
    }catch(err){
        res.json({message : err.message})
    }
}

exports.getnotebids = async (req,res) =>{
    try{
        let user = await usermodel.findOne({username : req.user.username})
        if(!user) return res.json({message : "User Not Found"})

        let note = await musicnotemodel.findById(req.params.noteid).populate('bids.user','username email')
        if(!note) return res.json({message : "Note Not Found"})

        if(note.user.toString() !== user._id.toString()) return res.json({message : "Only note owner can view bids"})

        res.status(200).json({message : "Bids Fetched",bids : note.bids})
    }catch(err){
        res.json({message : err.message})
    }
}

exports.deletenote = async (req,res) =>{
    try{
        let user = await usermodel.findOne({username : req.user.username})
        if(!user) return res.json({message : "User Not Found"})

        let note = await musicnotemodel.findById(req.params.noteid)
        if(!note) return res.json({message : "Note Not Found"})

        if(note.user.toString() !== user._id.toString()) return res.json({message : "Not Authorized"})

        await musicnotemodel.findByIdAndDelete(req.params.noteid)
        res.status(200).json({message : "Note Deleted"})
    }catch(err){
        res.json({message : err.message})
    }
}

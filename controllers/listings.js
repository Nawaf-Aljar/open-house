const express = require('express');
const router = express.Router();

const Listing = require('../models/listing');

router.get("/", async (req,res) => {
    try{
   const Listings = await Listing.find().populate("owner")
   res.render("listings/index.ejs", {Listings})
    }
    catch(err){
        console.error("Error", err)
    }
})

router.get("/new", async (req,res) => {
    try{
        res.render("listings/new.ejs")
    }
    catch(err){
        console.error("Error", err)
    }
})
router.post("/", async (req,res) => {
    try{
        req.body.owner = req.session.user._id
        await Listing.create(req.body)
        res.redirect("/listings")
    }
    catch(err){
        console.error("Error Occured",err)
    }
})
router.get("/:id", async (req,res) => {
    try{
    const listing = await Listing.findById(req.params.id).populate("owner")
    res.render("listings/show.ejs", {listing})
}
catch(err){
    console.error("Error Occured",err)
}
})
router.delete("/:id", async (req,res) => {
    try{
        const listing = await Listing.findById(req.params.id)
        if (listing.owner.equals(req.session.user._id)){
           await listing.deleteOne()
            res.redirect("/listings")
        }
        else{
            throw new Error()
        }
    }
    catch(err){
        console.error("Error Occured",err)
    }
})
router.get("/:id/edit", async (req,res) => {
    try{
        const listing = await Listing.findById(req.params.id)
        res.render("listings/edit.ejs", {listing})
    }
    catch(err){
        console.error("Error Occured",err)
    }
})
router.put("/:id", async (req,res) => {
    try{
        const listing = await Listing.findById(req.params.id)
        const isOwner = listing.owner.equals(req.session.user._id)
        if(isOwner){
            await listing.updateOne(req.body)
            res.redirect(`/listings/${req.params.id}`)
        }
        else{
            res.redirect(`/listings/${req.params.id}`)
        }
    }
    catch(err){
        console.error("Error Occured",err)
    }
})
module.exports = router;

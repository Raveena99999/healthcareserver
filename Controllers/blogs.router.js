const express = require("express");
const { BlogModel } = require("../Model/Blogs.Model");
const blogRouter = express.Router();
const { auth } = require("../Middlewares/Auth.middleware");
blogRouter.use(auth);
const {authorizedRole} =require ('../Middlewares/authorizedrole')
blogRouter.get("/",authorizedRole(["doctor", "patient", "admin"]),
 async (req, res) => {
  try {
    const blogs = await BlogModel.find();
    res.status(200).send({ msg: "All records", data: blogs });
  } catch (error) {
    res.status(404).send({ msg: error.message });
  }
});

blogRouter.post("/add", authorizedRole(["doctor", "admin"]), async (req, res) => {
  try {
    let userId = req.userId;
    let username = req.username;
    const blog = new BlogModel({ ...req.body, userId, username });
    await blog.save();
    res.status(200).send({ msg: "record added successfully" });
  } catch (error) {
    res.status(404).send({ msg: error.message });
  }
});

blogRouter.patch("/update/:blog_id",  authorizedRole(["doctor", "admin"]), async (req, res) => {
  try {
    const { blog_id } = req.params;
    const userId = req.userId;
    const blog = await BlogModel.findOne({ _id: blog_id });
    if (blog.userId === userId) {
      await BlogModel.findByIdAndUpdate({ _id: blog_id }, req.body);
      res.status(200).send({ msg: "record updated successfully" });
    } else {
      res
        .status(200)
        .send({ msg: `You are not authorized to update this record` });
    }
  } catch (error) {
    res.status(404).send({ msg: error.message });
  }
});
blogRouter.delete("/delete/:blog_id", authorizedRole(["admin"]), async (req, res) => {
  try {
    const { blog_id } = req.params;
    const userId = req.userId;
    const blog = await BlogModel.findOne({ _id: blog_id });
    if (userId === blog.userId) {
      await BlogModel.findByIdAndDelete({ _id: blog_id });
      res.status(200).send({ msg: "record deleted successfully" });
    } else {
      res
        .status(200)
        .send({ msg: `You are not authorized to delete this record` });
    }
  } catch (error) {
    res.status(404).send({ msg: error.message });
  }
});

module.exports = { blogRouter };

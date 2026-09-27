const Job = require("../models/Job");

const createJob = async (req, res) => {
  try {

    const { company, position, status } = req.body;

    const job = await Job.create({
      company,
      position,
      status,
      createdBy: req.user.userId
    });

    res.status(201).json({
      message: "Job created successfully",
      job
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getJobs = async (req, res) => {
  try {

    const jobs = await Job.find({ createdBy: req.user.userId });

    res.status(200).json({
      count: jobs.length,
      jobs
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateJob = async (req, res) => {
  try {

    const { id } = req.params;

    const job = await Job.findOne({
      _id: id,
      createdBy: req.user.userId
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteJob = async (req, res) => {
  try {

    const { id } = req.params;

    const job = await Job.findOne({
      _id: id,
      createdBy: req.user.userId
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await Job.findByIdAndDelete(id);

    res.status(200).json({
      message: "Job deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createJob, getJobs, updateJob, deleteJob };
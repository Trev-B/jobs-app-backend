const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const reader = require('xlsx');
const path = require('path');
const fs = require('fs');

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userID }).sort('createdAt');
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
  } = req;

  const job = await Job.findOne({
    _id: jobID,
    createdBy: userID,
  });

  if (!job) {
    throw new NotFoundError(`No job with ID ${jobID}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  // req.body.createdBy = req.user.userID;
  const job = await Job.create({ ...req.body, createdBy: req.user.userID });
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
    body: { company, position, location },
  } = req;

  if (company === '' || position === '' || location === '') {
    throw new BadRequestError(
      `Company, position, or location fields cannot be empty`
    );
  }

  const job = await Job.findOneAndUpdate(
    {
      _id: jobID,
      createdBy: userID,
    },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError(`No job with ID ${jobID}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
  } = req;

  const job = await Job.findByIdAndRemove({
    _id: jobID,
    createdBy: userID,
  });

  if (!job) {
    throw new NotFoundError(`No job with ID ${jobID}`);
  }

  res.status(StatusCodes.OK).send();
};

const downloadJobs = async (req, res) => {
  const jobsDoc = await Job.find({ createdBy: req.user.userID }).select(
    '-createdAt -createdBy -updatedAt -__v -_id'
  );

  const jobs = [];
  for (let job of jobsDoc) {
    jobs.push(job.toObject());
  }

  const ws = reader.utils.json_to_sheet(jobs);
  const wb = reader.utils.book_new();
  reader.utils.book_append_sheet(wb, ws, 'Sheet1');

  reader.writeFile(wb, `${req.user.name}-Jobs.xlsx`);

  const file = path.join(__dirname, '../', `${req.user.name}-Jobs.xlsx`);

  // res.setHeader('Content-Type', 'application/vnd.openxmlformats');
  // res.setHeader(
  //   'Content-Disposition',
  //   'attachment; filename=' + `${req.user.name}-Jobs.xlsx`
  // );

  res.status(StatusCodes.OK).sendFile(file, (err) => {
    if (err) {
      next(err);
    } else {
      fs.unlink(file, (err) => {
        if (err) throw err;
      });
    }
  });
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  downloadJobs,
};

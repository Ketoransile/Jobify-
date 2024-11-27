import Job from "../models/jobModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.js";
import mongoose from "mongoose";
import dayjs from "dayjs";
// Get all Jobs
export const getAllJobs = async (req, res) => {
  console.log(req.query);
  const { search, jobStatus, jobType, sort } = req.query;
  const queryObject = {
    createdBy: req.user.userId,
  };
  if (search) {
    queryObject.$or = [
      { position: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }
  if (jobStatus && jobStatus !== "all") {
    queryObject.jobStatus = jobStatus;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }
  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    "a-z": "position",
    "z-a": "-position",
  };
  const sortKey = sortOptions[sort] || sortOptions.newest;

  // Setup pagination
  // const page = Number(req.query.page) || 1;
  // const limit = Number(req.query.limit) || 10;
  // const skip = (page - 1) * limit;
  // const jobs = await Job.find(queryObject)
  //   .sort(sortKey)
  //   .skip(skip)
  //   .limit(limit);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const jobs = await Job.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  if (!jobs || jobs.length === 0) throw new NotFoundError(`No jobs are found`);
  //   res.status(StatusCodes.OK).json({
  //     message: "Here are jobs",
  //     jobs: jobs,
  //   });
  res
    .status(StatusCodes.OK)
    .json({ totalJobs, numOfPages, currentPage: page, jobs });
};
// Create Job
export const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};
// Get a single job
export const getJob = async (req, res) => {
  const { id } = req.params;

  const job = await Job.findById(id);

  res.status(StatusCodes.OK).json({
    status: "success",
    job,
  });
};

// Update Job
export const updateJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  // if (!job) {
  //   return res
  //     .status(StatusCodes.NOT_FOUND)
  //     .json({ message: `No job found with the id ${id} ` });
  // }

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(StatusCodes.OK).json({
    status: "success",
    data: { updatedJob },
  });
};

// Delete Job
export const deleteJob = async (req, res) => {
  const deletedJob = await Job.findByIdAndDelete(req.params.id);

  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Job deleted successfully",
    data: { deletedJob },
  });
};

//
export const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$jobStatus", count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": -1, "_id.month": -1 },
    },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = dayjs()
        .month(month - 1)
        .year(year)
        .format("MMM YY");
      return { date, count };
    })
    .reverse();
  // let monthlyApplications = [
  //   {
  //     date: "May 23",
  //     count: 12,
  //   },
  //   {
  //     date: "Jun 23",
  //     count: 9,
  //   },
  //   {
  //     date: "Jul 23",
  //     count: 3,
  //   },
  // ];
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

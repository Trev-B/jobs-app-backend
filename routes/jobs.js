const express = require('express');
const router = express.Router();

const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  downloadJobs,
} = require('../controllers/jobs');

router.route('/download').get(downloadJobs);
router.route('/').post(createJob).get(getAllJobs);
router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob);

module.exports = router;

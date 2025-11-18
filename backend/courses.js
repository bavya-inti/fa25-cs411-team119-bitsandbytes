const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

router.get('/', async (req, res) => {
  const query = `
    SELECT 
      ci.course_code,
      ci.course_name,
      ci.credit_hours,
      ROUND(
        SUM((gpa.Percentage_As * 4.0 + gpa.Percentage_Bs * 3.0 + 
             gpa.Percentage_Cs * 2.0 + gpa.Percentage_Ds * 1.0 + 
             gpa.Percentage_Fs * 0.0) / 100.0 * gpa.Total_Students) / 
        SUM(gpa.Total_Students)
      ) as avg_gpa
    FROM Course_Information ci
    LEFT JOIN course_gpa_by_instructor gpa ON ci.course_code = gpa.Course_Code AND gpa.Total_Students > 0
    GROUP BY ci.course_code, ci.course_name, ci.credit_hours
    ORDER BY ci.course_code
  `;

  const [rows] = await pool.query(query);
  res.json(rows);
});


router.get('/:code', async (req, res) => {
  const { code } = req.params;
  
  const [courseInfo] = await pool.query(`
    SELECT 
      ci.course_code,
      ci.course_name,
      ci.credit_hours,
      ROUND(
        SUM((gpa.Percentage_As * 4.0 + gpa.Percentage_Bs * 3.0 + 
             gpa.Percentage_Cs * 2.0 + gpa.Percentage_Ds * 1.0 + 
             gpa.Percentage_Fs * 0.0) / 100.0 * gpa.Total_Students) / 
        SUM(gpa.Total_Students)
      ) as avg_gpa
    FROM Course_Information ci
    LEFT JOIN course_gpa_by_instructor gpa ON ci.course_code = gpa.Course_Code AND gpa.Total_Students > 0
    WHERE ci.course_code = ?
    GROUP BY ci.course_code, ci.course_name, ci.credit_hours
  `, [code]);
  
  const course = courseInfo[0];
  
  const [instructors] = await pool.query(`
    SELECT 
      Instructor,
      Percentage_As,
      Percentage_Bs,
      Percentage_Cs,
      Percentage_Ds,
      Percentage_Fs,
      Total_Students,
      ROUND((Percentage_As * 4.0 + Percentage_Bs * 3.0 + 
             Percentage_Cs * 2.0 + Percentage_Ds * 1.0 + 
             Percentage_Fs * 0.0) / 100.0, 2) as gpa
    FROM course_gpa_by_instructor
    WHERE Course_Code = ? AND Total_Students > 0
    ORDER BY gpa DESC
  `, [code]);
  
  const [prerequisites] = await pool.query(`
    SELECT DISTINCT prerequisite_course_code, requirement_group_id
    FROM Prerequisite
    WHERE course_code = ?
    ORDER BY requirement_group_id, prerequisite_course_code
  `, [code]);
  
  const [concurrent] = await pool.query(`
    SELECT concurrent_enrollment_course_code
    FROM Concurrent_Enrollment
    WHERE course_code = ?
    ORDER BY concurrent_enrollment_course_code
  `, [code]);
  
  res.json({
    ...course,
    instructors: instructors || [],
    prerequisites: prerequisites || [],
    concurrentEnrollment: concurrent || []
  });
});








module.exports = router;


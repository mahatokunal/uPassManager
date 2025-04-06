// lambda-code/index.mjs

// Uncomment the following line for local testing (not needed in production)
// import 'dotenv/config';

import AWS from 'aws-sdk';
import XLSX from 'xlsx';
import mysql from 'mysql2/promise';

// S3 is built-in in Lambda's runtime, so AWS SDK is available,
// but xlsx and mysql2 will come from your Lambda Layer.
const s3 = new AWS.S3();

export const handler = async (event) => {
  try {
    // Validate S3 event
    if (!event.Records || event.Records.length === 0) {
      console.log('No S3 records found in event.');
      return { statusCode: 400, body: 'No S3 records found.' };
    }
    
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    console.log(`Bucket: ${bucket}, Key: ${key}`);
    
    // Process only files in "raw_data/" folder
    if (!key.startsWith('raw_data/')) {
      console.log('File not in raw_data folder, skipping.');
      return { statusCode: 200, body: 'Not processed.' };
    }
    
    // Retrieve the file from S3
    const fileData = await s3.getObject({ Bucket: bucket, Key: key }).promise();
    console.log('File retrieved from S3.');
    
    // Parse Excel file using xlsx
    const workbook = XLSX.read(fileData.Body, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log('Parsed data:', JSON.stringify(jsonData, null, 2));
    
    // Connect to RDS using environment variables
    const connection = await mysql.createConnection({
      host: process.env.RDS_HOST,
      user: process.env.RDS_USER,
      password: process.env.RDS_PASSWORD,
      database: process.env.RDS_DB,
    });
    console.log('Connected to RDS.');
    
    // Define your SQL query (update the table name as needed)
    const sql = `
      INSERT INTO u_pass_manager (
        U_Pass_ID,
        Active_U_Pass_Card,
        Replaced_U_Pass_Card,
        Metro_Acct,
        Distribution_Date,
        Picked_Up_By,
        Student_ID,
        First_Name,
        Last_Name,
        Email,
        Disclaimer_Signed,
        Notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        Active_U_Pass_Card = VALUES(Active_U_Pass_Card),
        Replaced_U_Pass_Card = VALUES(Replaced_U_Pass_Card),
        Metro_Acct = VALUES(Metro_Acct),
        Distribution_Date = VALUES(Distribution_Date),
        Picked_Up_By = VALUES(Picked_Up_By),
        Student_ID = VALUES(Student_ID),
        First_Name = VALUES(First_Name),
        Last_Name = VALUES(Last_Name),
        Email = VALUES(Email),
        Disclaimer_Signed = VALUES(Disclaimer_Signed),
        Notes = VALUES(Notes)
    `;
    
    // Loop over each row in the Excel JSON and execute the query
    for (const row of jsonData) {
      // Default missing values to null
      const {
        U_Pass_ID = null,
        Active_U_Pass_Card = null,
        Replaced_U_Pass_Card = null,
        Metro_Acct = null,
        Distribution_Date = null,
        Picked_Up_By = null,
        Student_ID = null,
        First_Name = null,
        Last_Name = null,
        Email = null,
        Disclaimer_Signed = null,
        Notes = null
      } = row;
      
      await connection.execute(sql, [
        U_Pass_ID,
        Active_U_Pass_Card,
        Replaced_U_Pass_Card,
        Metro_Acct,
        Distribution_Date,
        Picked_Up_By,
        Student_ID,
        First_Name,
        Last_Name,
        Email,
        Disclaimer_Signed,
        Notes
      ]);
      
      console.log(`Upserted row for U_Pass_ID = ${U_Pass_ID}`);
    }
    
    await connection.end();
    console.log('Database connection closed.');
    
    return { statusCode: 200, body: 'Database updated successfully' };
    
  } catch (error) {
    console.error('Error processing file:', error);
    return { statusCode: 500, body: JSON.stringify(error) };
  }
};

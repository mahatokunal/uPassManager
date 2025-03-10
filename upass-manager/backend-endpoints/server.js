// const express = require("express");

// backend-endpoints/server.js
import express from "express";

const app = express();
import { authenticateUser } from '../backend-common/auth.js';

app.use(express.json());

app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    // Email and password fetching
    const result = await authenticateUser(email, password);

    // Generate token
    // const token = generateToken(authResult.user);

    // Return appropriate status code based on result
    if (result.status === "error") {
        // Not valid credential
    return res.status(500).json({
        status: "error",
        message: "Invalid",
      });
    }
    else{
        return res.status(200).json({
            role: result.user.role,
            // token,
            message: "Success"
          });
    }
  });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
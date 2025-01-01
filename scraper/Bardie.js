"use strict";
const axios = require("axios");
const baseurl = "https://bard.rizzy.eu.org";

const Bardie  = {
 question: async ({ ask }) => {
    if (!ask) {
      throw new Error("Please specify a question!");
    }
    try {
      const response = await axios.post(`${baseurl}/backend/conversation`, { ask }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.content
    } catch (err) {
      throw new Error("Error: " + err.message);
    }
  },
     image: async ({ ask, image }) => {
    if (!ask) {
      throw new Error("Please specify a question!");
    }
    if (!image) {
      throw new Error("Please specify a URL for the image!");
    }
    try {
      const response = await axios.post(`${baseurl}/backend/conversation/image`, { ask, image }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.content
    } catch (err) {
      throw new Error("Error: " + err.message);
    }
  }
}

module.exports = Bardie;
// src/utils/storage.js

const STORAGE_KEY = "urlData";

export const saveUrl = (shortcode, data) => {
  const allData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  allData[shortcode] = data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
};

export const getUrlByShortcode = (shortcode) => {
  const allData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  return allData[shortcode];
};

export const getAllUrls = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
};

export const generateShortcode = () => {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let shortcode = "";
  for (let i = 0; i < 6; i++) {
    shortcode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return shortcode;
};

export const getUrlData = () => {
  return getAllUrls();
};

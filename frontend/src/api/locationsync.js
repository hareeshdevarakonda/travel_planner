// src/api/locationSyncAPI.js

import api from "./axios";

/* =====================================================
   COMMON ERROR HANDLER
===================================================== */
const handleRequest = async (request) => {
  try {
    const res = await request;
    return res.data;
  } catch (error) {
    console.error(
      "Location Sync API Error:",
      error?.response?.data || error.message
    );

    throw new Error(
      error?.response?.data?.detail ||
      error?.response?.data ||
      "Location sync request failed"
    );
  }
};

/* =====================================================
   HEALTH CHECK (OPTIONAL)
   GET /location-sync/test
===================================================== */
export const locationSyncTest = () =>
  handleRequest(api.get("/location-sync/test"));

/* =====================================================
   🌍 COUNTRIES
===================================================== */

/* GET ALL COUNTRIES */
export const getCountries = () =>
  handleRequest(api.get("/location-sync/countries"));

/* CREATE / SYNC COUNTRY */
export const createCountry = (name) =>
  handleRequest(
    api.post("/location-sync/countries", {
      name,
    })
  );

/* =====================================================
   🗺️ STATES
===================================================== */

/* CREATE STATE */
export const createState = (name, countryId) =>
  handleRequest(
    api.post("/location-sync/states", {
      name,
      country_id: countryId,
    })
  );

/* =====================================================
   🏙️ CITIES
===================================================== */

/* GET ALL CITIES */
export const getCities = () =>
  handleRequest(api.get("/location-sync/cities"));

/* CREATE CITY */
export const createCity = (name, stateId) =>
  handleRequest(
    api.post("/location-sync/cities", {
      name,
      state_id: stateId,
    })
  );
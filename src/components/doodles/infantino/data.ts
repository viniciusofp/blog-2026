"use server";

import csvToJson from "convert-csv-to-json";

export async function getStadiums() {
  const res = await fetch(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTZ0ZFvPL0wM-8hEtLnRD5sDbEKfey0x8KdVbbgzXPfU0YWOwPzaLhRJHud-AaJQlFzlxcq8KDk7qZM/pub?output=csv",
  )
    .then((res) => {
      return res.text();
    })
    .then((res) => {
      const json = csvToJson.csvStringToJson(res);
      return json;
    });
  return res;
}

export async function getAttendances() {
  const res = await fetch(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTkV2L_l_d0MO2iPYCRCMHSdHcurj2ur6sE99XC5QfJrvDbV74jeDkdMjZrtXZBToN3i0QtLDqkthhR/pub?gid=1488544120&single=true&output=csv",
  )
    .then((res) => {
      return res.text();
    })
    .then((res) => {
      const json = csvToJson.csvStringToJson(res);
      return json;
    });
  return res;
}

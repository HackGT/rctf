const axios = require("axios");

const applicantTypes = {
  PARTICIPANT: "Participant",
  STAFF: "Staff",
  SPONSOR: "Sponsor",
  JUDGE: "Judge",
  MENTOR: "Mentor",
  VOLUNTEER: "Volunteer",
  PARTNER: "Partner",
};

function classifyConfirmationBranch(branch: string) {
  if (branch === "Staff") {
    return applicantTypes.STAFF;
  } else if (branch === "Judge") {
    return applicantTypes.JUDGE;
  } else if (branch === "Sponsor") {
    return applicantTypes.SPONSOR;
  } else if (branch === "Mentor") {
    return applicantTypes.MENTOR;
  } else if (branch === "Partner") {
    return applicantTypes.PARTNER;
  } else {
    if (!/Participant/.exec(branch)) {
      console.warn("Unknown participant type. Classifying as 'Participant'");
    }
    return applicantTypes.PARTICIPANT;
  }
}

async function getRegistrationData(email: string, url: string, token: string) {
  const registrationResponse = await axios({
    method: "POST",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      query: `
          query {
            user(email: "${email}") {
              accepted,
              application {
                type,
              },
              question(name: "affiliation") {
                name,
                value
              }
            }
          }
        `,
    }),
  });

  if (!registrationResponse.data.data.user) {
    return null;
  }

  const { accepted, application, question } = registrationResponse.data.data.user;

  return {
    id: registrationResponse.data.data.user.uuid,
    accepted,
    application,
    affiliation: question?.value,
  };
}

module.exports = {
  getRegistrationData,
  classifyConfirmationBranch,
  applicantTypes,
};

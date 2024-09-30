module.exports.commonFlightBook = async function (request) {
  try {
    return { result: {} };
  } catch (error) {
    console.log({ error });
    return { error: error.message };
  }
};

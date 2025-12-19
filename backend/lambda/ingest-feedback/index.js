exports.handler = async (event) => {
  console.log("Incoming event:", JSON.stringify(event));

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid JSON payload"
      })
    };
  }

  // (Placeholder values) real logic comes in Week 2
  const response = {
    message: "Feedback received (Week 1 skeleton)",
    feedback_id: "placeholder-id",
    timestamp: new Date().toISOString()
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
};

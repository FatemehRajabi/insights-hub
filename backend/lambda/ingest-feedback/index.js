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

  // Basic shape validation (Week 2 level)
  if (
    !body.survey_version ||
    !body.ratings ||
    !body.open_text ||
    typeof body.ratings.overall_satisfaction !== "number" ||
    typeof body.ratings.speed_satisfaction !== "number" ||
    typeof body.ratings.recommend_likelihood !== "number" ||
    !body.open_text.improve_one_thing ||
    !body.open_text.keep_doing_one_thing
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid request payload",
        error: "Missing or invalid required fields"
      })
    };
  }

  // Placeholder enrichment (real S3 logic comes in Week 3)
  const response = {
    message: "Feedback received",
    feedback_id: "placeholder-id",
    submitted_at: new Date().toISOString()
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
};

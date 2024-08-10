const fs = require("fs").promises;
const path = require("path");

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const params = new URLSearchParams(event.body);
  const newImage = {
    imageUrl: params.get("imageUrl"),
    description: params.get("description") || "",
    altText: params.get("altText") || "",
    prompt: params.get("prompt") || "",
    creationDate: params.get("creationDate") || "",
  };

  const jsonFile = path.join(
    __dirname,
    "..",
    "..",
    "inn",
    "wandering-inn.json"
  );

  try {
    let data = { images: [] };

    try {
      const fileContents = await fs.readFile(jsonFile, "utf8");
      data = JSON.parse(fileContents);
    } catch (error) {
      // If file doesn't exist or is empty, we'll start with an empty array
      console.log("No existing file found, starting with empty data");
    }

    data.images.push(newImage);
    await fs.writeFile(jsonFile, JSON.stringify(data, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Image added successfully" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to add image" }),
    };
  }
};

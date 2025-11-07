import axios from "axios";

export const updateLog = async (body: { level: string; message: string }) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API}/logging`, {
      ...body,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating log:", error);
    throw error;
  }
};

import { API_URL } from "@/lib/api";
import axios from "axios";


export const getLuxuryStory = () =>
  axios.get(`${API_URL}/luxury-story`);



export const updateLuxuryStory = (payload) =>
  axios.put(
    `${API_URL}/luxury-story`,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  export const deleteLuxuryStory=()=>{

return axios.delete(
`${API_URL}/luxury-story`
);

}



export const toggleLuxuryStoryStatus=()=>{

return axios.patch(
`${API_URL}/luxury-story/status`
);

}
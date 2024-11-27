import { toast } from "react-toastify";
import { JobsContainer, SearchContainer } from "../components";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";
import { useContext, createContext } from "react";

export const loader = async ({ request }) => {
  console.log(request.url);
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);
  console.log(params, "console.log params all jobs page");
  console.log(request.url, "full URL in loader");
  try {
    const { data } = await customFetch.get("/jobs", {
      params,
    });
    console.log(data, "data from Alljobs container");
    return { data, searchValues: { ...params } };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const AllJobsContext = createContext();
const AllJobs = () => {
  const { data, searchValues } = useLoaderData();
  console.log("from useLoader data", data);
  return (
    <AllJobsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};

export const useAllJobsContext = () => useContext(AllJobsContext);
export default AllJobs;

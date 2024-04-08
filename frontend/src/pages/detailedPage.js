import React,{ useState, useEffect} from "react";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import Plot from 'react-plotly.js';
import DetailedTable from "../compoents/detailedTable";
import { getReviewData } from "../api/getData";
import DetailedTable from "../compoents/detailedTable";

const DetailedPage = () => {
  //store review data into data
  const [data, setData] = useState([0]);
  //fetch review data by getReviewData method
  
  //load data everytime
  useEffect(() => {
    const fetchData = async() => {
      try{
          const data = await getReviewData();
          const content = data.reviewData;
          setData(content);
  
        } catch (error){
  
        };
      };

    fetchData();

    return (
        <div>
            <Navigation/>
            <h1>Reviews</h1>
            <DetailedTable />
        </div>
    )
}
export default DetailedPage;

import React,{ useState, useEffect} from "react";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import DetailedTable from "../compoents/detailedTable";

const DetailedPage = () => {

    return (
        <div>
            <Navigation/>
            <h1>Reviews</h1>
            <DetailedTable />
        </div>
    )
}
export default DetailedPage;
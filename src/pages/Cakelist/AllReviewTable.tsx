import { useState } from "react";
import ReviewTable from "./ReviewTable";
import CakeReviewTable from "./CakeReviewTable";
function AllReviewTable(){
     const [selectedView, setSelectedView] = useState<"allreview" | "cakereview">("allreview");
return(
    <div>
        <div className="Reviews" style={{marginTop:'100px',marginLeft:"45px"}}>
           <h3>Review</h3>
            <div className="radio-group" style={{display:'flex',gap:"16px",alignItems:"center"}}>
            <label className="radio"style={{display:"inline-flex",gap:"8px",alignItems:"center",cursor:"pointer",userSelect:"none"}}>
                <input type="radio" name="choice" value="yes" checked={selectedView === "allreview"} onChange={() => setSelectedView("allreview")}
                    style={{width:"16px",height:"16px"}} />
                <span>Reviews</span>
            </label>

            <label className="radio" style={{display:"inline-flex",gap:"8px",alignItems:"center",cursor:"pointer",userSelect:"none"}}>
                <input type="radio" name="choice" value="no" checked={selectedView === "cakereview"} onChange={() => setSelectedView("cakereview")} style={{width:"16px",height:"16px"}} />
                <span>Cake Review</span>
            </label>
            </div>
        </div>
         {selectedView === "allreview" ? <ReviewTable /> : <CakeReviewTable />}
    </div>
)
}
export default AllReviewTable
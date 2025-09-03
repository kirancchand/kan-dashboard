import { Link } from 'react-router-dom';
import { Button, TabPane } from "reactstrap"
import { AnalyicsCustomTable } from '../../Reacttable/Tables';
function CatageoriesTable() {
    return (
        <div>
            <div className="list-tables" style={{ marginTop: '110px' }}>
              <Link to='/add-catageories'> <Button color="warning"  style={{margin:'20px',padding:'10px 20px',}}>+ Add</Button></Link> 
              
            </div>
            <div>
                <AnalyicsCustomTable />
            </div>
                      
        </div>
    )
}
 export default CatageoriesTable 
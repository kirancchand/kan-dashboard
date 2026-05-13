import React, { useMemo, useState, useEffect } from 'react'
import Organisation from './Organisation';
import OrganisationMember from './OrganisationMember';
import RegisterOrganisationMember from './RegisterOrganisationMember';
const OrganisationMemberIndex = () => {

 let initialResp={
      nav:"Organisation",
      mode:"",
      data:null,
      origin:"OrganisationMember",
      title:"Organisation"
    }
    const [respValue,setRespValue]=useState(initialResp);
    console.log("respValue",respValue)
    return (
        <React.Fragment>
            {{
                'Organisation':<Organisation respValue={respValue} setRespValue={setRespValue}/>,
                'OrganisationMember':<OrganisationMember respValue={respValue} setRespValue={setRespValue}/>,
                'RegisterOrganisationMember':<RegisterOrganisationMember respValue={respValue} setRespValue={setRespValue}/>
            }[respValue.nav]}
        </React.Fragment>
    );
}

export default OrganisationMemberIndex
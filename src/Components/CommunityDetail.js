import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import Cookies from 'universal-cookie';


export default function CommunityDetail(props) {
    
    const cookies = new Cookies();
    let {qId} = useParams();
    const [data, setData] = useState();

    let tok = cookies.get("token");
    const stringWithoutQuotes = tok && tok.replace(/"/g, "");

    useEffect(()=>{
        const fetchData = async () => {
            try{
            const q = await fetch(`http://127.0.0.1:4000/api/v1/question/${qId}/getQuestionById`, {
                headers:{
                    Authorization: `Bearer ${stringWithoutQuotes}`
                }
            })

        if(q.ok){
            let dt = await q.json();
            console.log(dt)
            setData(dt);
        }
        else{
            let dt = await q.json();
            console.log(dt.message)
        }
    }
        catch(err){
            console.log(err)
        }
    }
    fetchData()
}, [])

    return(
        <>
        <div className="detail-cont">
            {data && data?.q.map((el)=>(
                <div className="detail-inner-cont">
                <div className="detail-user-cont">
                    <p className="detail-u-icon">{el.userId.name.substr(0,1).toUpperCase()}</p>
                    <p>{el.userId.name}</p>
                </div>
            <p className="detail-des">{el.description}</p>
            </div>
            ))}
        </div>
        </>
    )
}
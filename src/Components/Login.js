import { useEffect, useState} from "react";
import Cookies from 'universal-cookie';
import { Link, useNavigate } from "react-router-dom";

export default function Login(props) {

    const cookies = new Cookies();

    const [data, setData] = useState();
    const [currUser, setCurrUser] = useState();

    const [postData, setPostData] = useState({
        // Your POST data fields go here
        email: "",
        password: ""
      });
    
      const handleChange = (e) => {
        setPostData({ ...postData, [e.target.name]: e.target.value });
    };
    

    const postLogin = async () => {
        try {
            const q = await fetch(
              `http://127.0.0.1:4000/api/v1/auth/login`,
              {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData), 
              }
            );
    
            if (q.ok) {
                // window.location.reload()
              let dt = await q.json();
              setData(dt);
              console.log(dt);

              cookies.set("token", dt.token)

              fetchUser(dt.token)
            //   window.location.href = `${data?.comm}`
            } else {
              let dt = await q.json();
              console.log(dt.message);
            }
        } catch (err) {
            console.log(err);
        }
    }


    // currUser && console.log(currUser.user.communityId)


    const fetchUser = async (id) => {
        try {
          const q = await fetch(
            `http://127.0.0.1:4000/api/v1/auth/getCurrUser`,
            {
              headers: {
                Authorization: `Bearer ${id}`,
              },
            }
          );
  
          if (q.ok) {
            let dt = await q.json();
            console.log(dt)
            setCurrUser(dt);

            if(currUser?.user?.role === "admin")
            window.location.href = `/doctor`
        else{
            window.location.href = `/${currUser.user.communityId}`
        }
          } else {
            let dt = await q.json();
            console.log(dt.message);
          }
        } catch (err) {
          console.log(err);
        }
      };

    return(
        <>
        <div className="login">

{/* <p className="login-msg">{result?.message}</p> */}

<div className="login-cont">
  <p>Health</p>
  <p>Please login to get access</p>
  <input className="email"
  type="text"
  name="email"
  value={postData.email}
  onChange={handleChange} placeholder="Email"/>

  <input className="password" type="password" name="password" value={postData.password}
  onChange={handleChange} placeholder="Password"/>

  {/* <p>New to PASSPORT? <Link to="/signup"><span className="redirect">SignUp</span></Link></p> */}


  <button className="login-submit" onClick={postLogin}>Submit</button>

  </div>
</div>
        </>
    )
}
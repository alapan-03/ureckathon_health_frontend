import { useState } from "react";
// import { Link } from "react-router-dom";
import Cookies from 'universal-cookie';
import { Link } from "react-router-dom";


export default function Signup(props) {
    
    const cookies = new Cookies();
    
    const [result, setResult] = useState(null);
    const [token, setToken] = useState(null);


    const [postData, setPostData] = useState({
        // Your POST data fields go here
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        city: ""
      });

      const handleChange = (e) => {
        setPostData({ ...postData, [e.target.name]: e.target.value });
    };
    
    let alert = document.getElementsByClassName("alert")[0]

      const handlePostRequest = async () => {
        try {
          const response = await fetch('http://127.0.0.1:4000/api/v1/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
          });
    
          if (response.ok) {
            setTimeout(() => {
                
                alert.style.visibility = "visible"
            }, 1000);
          }
    
          // Handle the response data
          const result = await response.json();
          console.log(result);
          setToken(result.token)

          cookies.set('token', result.token, { path: '*' });


        } catch (error) {
          console.error('Error making POST request:', error);
        }
    }

    let tok = cookies.get("token");
    const stringWithoutQuotes = tok && tok.replace(/"/g, "");
    

      const getIntoCommunity = async () => {
        try {
          const response = await fetch('http://127.0.0.1:4000/api/v1/community/getIn', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${stringWithoutQuotes}`
            },
          });

          console.log(cookies.get("token"))
    
          if (response.ok) {
            const result = await response.json();
            console.log(result);
          }
    
          // Handle the response data
        //   setToken(result.token)
        //   if(token)
        //   navigate('/login')

          // setResult(result);




        } catch (error) {
          console.error('Error making POST request:', error);
        }
    }





    return(
        <>
        <div className="signup">

        <div className="alert alert-success success-msg" role="alert">
  <p>You are successfully signed up. You are invited to your respective community </p>
  <button onClick={getIntoCommunity}>Join</button>
</div>
          <div className="signup-cont">   

          <p className="login-msg">{result?.message}</p>

           <p>Health</p>
          <p>Please signup to get access</p>         
            <input className="name"
            type="text"
            name="name"
            value={postData.name}
            onChange={handleChange} placeholder="Name"/>


            <input className="email"
            type="email"
            name="email"
            value={postData.email}
            onChange={handleChange} placeholder="Email"/>

            <input className="password" type="password" name="password" value={postData.password}
            onChange={handleChange} placeholder="Password"/>

            <input className="confirmPassword" type="password" name="confirmPassword" value={postData.confirmPassword}
            onChange={handleChange} placeholder="Confirm Password"/>

            <input className="name"
            type="text"
            name="city"
            value={postData.city}
            onChange={handleChange} placeholder="City"/>

{/* <p>Already have an account? <Link to="/login"><span className="redirect">Login</span></Link></p> */}

            <button className="signup-submit" onClick={handlePostRequest}>Submit</button>

          </div>
        </div>

        </>
    )
}
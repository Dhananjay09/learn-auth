import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Layout from "./Layout";

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  const makeApiCall = useCallback(() => {
    axios
      .get("users/list-users")
      .then((res) => {
        console.log("FETCH USERS SUCCESS!!", res);

        setUsers(res.data.result);
      })
      .catch((err) => {
        if (err && err.response && err.response.data) {
          toast.error(err.response.data.error);
        }
      });
  }, []);

  useEffect(() => {
    makeApiCall();
  }, [makeApiCall]);

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />

        <ul>
          {!users.length ? (
            <li>No users have signedup.</li>
          ) : (
            users.map((user) => <li key={user._id}>{user.name}</li>)
          )}
        </ul>

        <button className="btn btn-primary" onClick={makeApiCall}>
          Make API Call
        </button>
      </div>
    </Layout>
  );
};

export default Dashboard;

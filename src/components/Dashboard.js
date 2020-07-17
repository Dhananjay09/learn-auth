import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Layout from "./Layout";

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
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
      </div>
    </Layout>
  );
};

export default Dashboard;

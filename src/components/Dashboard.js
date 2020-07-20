import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Layout from "./Layout";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [fileUpload, setFileUpload] = useState();

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

  const onChangeHandler = useCallback((event) => {
    setFileUpload(event.target.files[0]);
  }, []);

  const uploadImage = useCallback(() => {
    const data = new FormData();
    data.append("myImage", fileUpload);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios
      .post("file/image-upload", data, config)
      .then((res) => {
        console.log("IMAGE UPLOAD SUCCESS!!", res);
      })
      .catch((err) => {
        if (err && err.response && err.response.data) {
          toast.error(err.response.data.error);
        }
      });
  }, [fileUpload]);

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

        <form>
          <input type="file" name="file" onChange={onChangeHandler} />
          <button type="button" className="btn btn-primary" onClick={uploadImage}>
            Upload
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Dashboard;

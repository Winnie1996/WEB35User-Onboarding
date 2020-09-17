import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

const form = {
  name: "",
  email: "",
  password: "",
  termsOfService: false,
};

function Form() {
  const [formState, setFormState] = useState({ ...form });
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [errorState, setErrorState] = useState({ ...form, termOfServices: "" });
  const [usersState, setUsersState] = useState([]);

  const handleChanges = (event) => {
    event.persist();
    validateChange(event);
    setFormState({
      ...formState,
      [event.target.name]:
        event.target.name === "termsOfService"
          ? event.target.checked
          : event.target.value,
    });
  };
  const formSchema = yup.object().shape({
    name: yup.string().required("Please enter your name."),
    email: yup
      .string()
      .email("Please enter a valid email address.")
      .required("Please enter your email."),
    password: yup.string().required("Please create a password."),
    termsOfService: yup
      .boolean()
      .oneOf([true], "You must agree to the Term Of Services to register."),
  });

  const validateChange = (event) => {
    yup
      .reach(formSchema, event.target.name)
      .validate(
        event.target.name === "termsOfService"
          ? event.target.checked
          : event.target.value
      )
      .then((valid) => {
        setErrorState({ ...errorState, [event.target.name]: " " });
      })
      .catch((error) => {
        console.log("Please review the following errors:", errorState);
        setErrorState({ ...errorState, [event.target.name]: error.errors[0] });
      });
  };

  useEffect(() => {
    formSchema.isValid(formState).then((validity) => setBtnDisabled(!validity));
  }, [formState]);

  useEffect(() => {
    console.log("Users List Updated", usersState);
    //         axios.get('https://reqres.in/api/users')
    //   .then(function (response) {
    //     // handle success
    //     console.log(response);
    //     setUsersState([...usersState, { response }])
    //   })
    //   .catch(function (error) {
    //     // handle error
    //     console.log(error);
    //   })
    //   .finally(function () {
    //     // always executed
    //   });
  }, [usersState]);

  const submitForm = (event) => {
    event.preventDefault();
    axios
      .post("https://reqres.in/api/users", formState)
      .then((response) => {
        console.log("Posted new user data!", response.data);
        {
          /* add users to array */
        }
        const createdUser = response.data;
        setUsersState([...usersState, { ...createdUser }]);
        setFormState(form);
      })
      .catch((failure) =>
        console.log("Failed to post new user data...", failure)
      );
  };

  return (
    <div>
      <form onSubmit={submitForm}>
        {/* Form startes here! Needs: name, email, pw, tos, submit 
    Also, there are validation error message that will display if they exist
*/}
        <label htmlFor="name">
          Name:
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            onChange={handleChanges}
            value={formState.name}
          />
          {errorState.name.length > 0 ? <p>{errorState.name}</p> : null}
        </label>

        <label htmlFor="email">
          Email:
          <input
            type="text"
            id="email"
            name="email"
            placeholder="example@example.com"
            onChange={handleChanges}
            value={formState.email}
          />
          {errorState.email.length > 0 ? <p>{errorState.email}</p> : null}
        </label>

        <label htmlFor="password">
          Password:
          <input
            type="password"
            id="password"
            name="password"
            placeholder="**********"
            onChange={handleChanges}
            value={formState.password}
          />
          {errorState.password.length > 0 ? <p>{errorState.password}</p> : null}
        </label>

        <label htmlFor="termsOfService">
          <input
            type="checkbox"
            id="termsOfService"
            name="termsOfService"
            onChange={handleChanges}
            value={formState.termsOfService}
          />
          I have read and agree to the{" "}
          <a href="http://google.com" target="_blank">
            Terms of Service
          </a>
          .
          {errorState.termsOfService.length > 0 ? (
            <p>{errorState.termsOfService}</p>
          ) : null}
        </label>
        <button type="submit" disabled={btnDisabled}>
          {" "}
          Register{" "}
        </button>
        {/* Show users array here */}
      </form>
      <h4>New Members</h4>
      {Array.from(usersState).map((item) => (
        <li>
          {item.name} [{item.email}]
        </li>
      ))}
    </div>
  );
}

export default Form;
